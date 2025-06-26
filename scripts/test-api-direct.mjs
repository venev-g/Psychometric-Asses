// scripts/test-api-direct.mjs
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sayftcijqhnpzlznvqcz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheWZ0Y2lqcWhucHpsem52cWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc0ODc4MiwiZXhwIjoyMDY2MzI0NzgyfQ.fhXi3wvQ1Nh8Mrc1wxcbgJkbDRE5NAUTcj1oFfAdRKQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabase() {
  console.log('🔍 Testing database connection and data...\n')
  
  try {
    // First, test basic connection
    const { data: connectionTest, error: connError } = await supabase
      .from('test_types')
      .select('count')
      .limit(1)
    
    if (connError) {
      console.error('❌ Connection failed:', connError.message)
      return
    }
    
    console.log('✅ Database connection successful\n')
    
    // Check test types
    const { data: testTypes, error: testTypeError } = await supabase
      .from('test_types')
      .select('*')
    
    console.log('📋 Test Types:')
    if (testTypeError) {
      console.error('❌ Error:', testTypeError.message)
    } else {
      console.log(`✅ Found ${testTypes?.length || 0} test types`)
      testTypes?.forEach(t => console.log(`   - ${t.name} (${t.slug}) - Active: ${t.is_active}`))
    }
    
    // Check test configurations
    const { data: configs, error: configError } = await supabase
      .from('test_configurations')
      .select('*')
    
    console.log('\n📋 Test Configurations:')
    if (configError) {
      console.error('❌ Error:', configError.message)
    } else {
      console.log(`✅ Found ${configs?.length || 0} configurations`)
      configs?.forEach(c => console.log(`   - ${c.name} - Active: ${c.is_active}`))
    }
    
    // Check test sequences
    const { data: sequences, error: seqError } = await supabase
      .from('test_sequences')
      .select(`
        *,
        test_configurations(name),
        test_types(name)
      `)
    
    console.log('\n🔗 Test Sequences:')
    if (seqError) {
      console.error('❌ Error:', seqError.message)
    } else {
      console.log(`✅ Found ${sequences?.length || 0} sequences`)
      sequences?.forEach(s => console.log(`   - Config: ${s.test_configurations?.name}, Test: ${s.test_types?.name}, Order: ${s.order_index}`))
    }
    
    // Check questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('test_type_id, count')
      .group(['test_type_id'])
    
    console.log('\n❓ Questions by Test Type:')
    if (qError) {
      console.error('❌ Error:', qError.message)
    } else {
      console.log(`✅ Question counts:`)
      // questions?.forEach(q => console.log(`   - Test ${q.test_type_id}: ${q.count} questions`))
    }
    
    // Get total question count
    const { count: totalQuestions, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact' })
    
    if (!countError) {
      console.log(`   - Total questions: ${totalQuestions}`)
    }
    
    // Check user accounts
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    console.log('\n👥 Auth Users:')
    if (authError) {
      console.error('❌ Error:', authError.message)
    } else {
      console.log(`✅ Found ${authUsers?.users?.length || 0} auth users`)
      authUsers?.users?.forEach(u => console.log(`   - ${u.email} (${u.id})`))
    }
    
    // If we have a test user, try to create an assessment session
    if (authUsers?.users?.length > 0) {
      const testUser = authUsers.users.find(u => u.email === 'test@example.com')
      if (testUser && configs?.length > 0) {
        console.log('\n🧪 Testing session creation...')
        
        const { data: newSession, error: sessionError } = await supabase
          .from('assessment_sessions')
          .insert({
            user_id: testUser.id,
            configuration_id: configs[0].id,
            status: 'started',
            current_test_index: 0
          })
          .select()
          .single()
        
        if (sessionError) {
          console.error('❌ Session creation failed:', sessionError.message)
        } else {
          console.log(`✅ Created test session: ${newSession.id}`)
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
  }
}

testDatabase()
