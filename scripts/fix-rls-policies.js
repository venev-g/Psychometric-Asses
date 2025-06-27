#!/usr/bin/env node

console.log('Script starting...')
require('dotenv').config({ path: '.env.local' })
console.log('Environment loaded')
const { createClient } = require('@supabase/supabase-js')
console.log('Supabase client loaded')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
console.log('Environment variables read')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

console.log('🚀 Starting RLS policy fix...')
console.log('📊 Supabase URL:', supabaseUrl)
console.log('🔑 Service key available:', !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies...')
  
  try {
    // First, check if the correct table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'user_profiles'])
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError)
      return
    }
    
    console.log('📋 Available tables:', tables?.map(t => t.table_name) || [])
    
    // Drop existing policies that reference wrong table
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view their own profile" ON users',
      'DROP POLICY IF EXISTS "Users can update their own profile" ON users',
      'DROP POLICY IF EXISTS "Admins can view all users" ON users',
      'DROP POLICY IF EXISTS "Admins can update all users" ON users',
      'DROP POLICY IF EXISTS "Admins can manage test configurations" ON test_configurations',
      'DROP POLICY IF EXISTS "Admins can manage test types" ON test_types',
      'DROP POLICY IF EXISTS "Admins can manage questions" ON questions',
      'DROP POLICY IF EXISTS "Admins can manage question options" ON question_options',
      'DROP POLICY IF EXISTS "Admins can view all assessment sessions" ON assessment_sessions',
      'DROP POLICY IF EXISTS "Admins can manage assessment sessions" ON assessment_sessions',
      'DROP POLICY IF EXISTS "Admins can view all user responses" ON user_responses',
      'DROP POLICY IF EXISTS "Admins can manage user responses" ON user_responses',
      'DROP POLICY IF EXISTS "Admins can view all assessment results" ON assessment_results',
      'DROP POLICY IF EXISTS "Admins can manage assessment results" ON assessment_results'
    ]
    
    for (const sql of dropPolicies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql })
        if (error && !error.message.includes('does not exist')) {
          console.warn('Warning dropping policy:', error.message)
        }
      } catch (err) {
        console.warn('Warning dropping policy:', err.message)
      }
    }
    
    // Disable RLS on users table if it exists
    try {
      await supabase.rpc('exec_sql', { sql: 'ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY' })
    } catch (err) {
      console.warn('Warning disabling RLS on users table:', err.message)
    }
    
    // Enable RLS on user_profiles
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY' })
      if (error) console.warn('Warning enabling RLS on user_profiles:', error.message)
    } catch (err) {
      console.warn('Warning enabling RLS on user_profiles:', err.message)
    }
    
    // Create correct policies
    const createPolicies = [
      `CREATE POLICY "Users can view their own profile" ON user_profiles
        FOR SELECT USING (auth.uid() = id)`,
      
      `CREATE POLICY "Users can update their own profile" ON user_profiles
        FOR UPDATE USING (auth.uid() = id)`,
      
      `CREATE POLICY "Admins can view all users" ON user_profiles
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Admins can update all users" ON user_profiles
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Admins can manage test configurations" ON test_configurations
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Admins can manage test types" ON test_types
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Admins can manage questions" ON questions
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Admins can manage question options" ON question_options
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Users can view their own assessment sessions" ON assessment_sessions
        FOR SELECT USING (auth.uid() = user_id)`,
      
      `CREATE POLICY "Users can update their own assessment sessions" ON assessment_sessions
        FOR UPDATE USING (auth.uid() = user_id)`,
      
      `CREATE POLICY "Users can insert their own assessment sessions" ON assessment_sessions
        FOR INSERT WITH CHECK (auth.uid() = user_id)`,
      
      `CREATE POLICY "Admins can view all assessment sessions" ON assessment_sessions
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        )`,
      
      `CREATE POLICY "Users can view their own responses" ON user_responses
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM assessment_sessions 
            WHERE id = user_responses.session_id AND user_id = auth.uid()
          )
        )`,
      
      `CREATE POLICY "Users can insert their own responses" ON user_responses
        FOR INSERT WITH CHECK (
          EXISTS (
            SELECT 1 FROM assessment_sessions 
            WHERE id = user_responses.session_id AND user_id = auth.uid()
          )
        )`,
      
      `CREATE POLICY "Users can view their own results" ON assessment_results
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM assessment_sessions 
            WHERE id = assessment_results.session_id AND user_id = auth.uid()
          )
        )`
    ]
    
    console.log('📝 Creating correct policies...')
    
    for (const sql of createPolicies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql })
        if (error) {
          console.warn('Warning creating policy:', error.message)
        } else {
          console.log('✅ Policy created successfully')
        }
      } catch (err) {
        console.warn('Warning creating policy:', err.message)
      }
    }
    
    console.log('🎉 RLS policies fixed!')
    
  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error)
  }
}

fixRLSPolicies()
