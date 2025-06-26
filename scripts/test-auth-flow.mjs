// scripts/test-auth-flow.mjs
// Test the authentication and assessment flow

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sayftcijqhnpzlznvqcz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheWZ0Y2lqcWhucHpsem52cWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDg3ODIsImV4cCI6MjA2NjMyNDc4Mn0.KOVN23WGHnA9PRs549-cQDVyWxlvGeriDdkwR1cLr7g'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthFlow() {
  console.log('🔐 Testing authentication flow...\n')
  
  try {
    // Test login with our test user
    console.log('Attempting login...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123456'
    })
    
    if (authError) {
      console.error('❌ Login failed:', authError.message)
      return
    }
    
    console.log('✅ Login successful!')
    console.log(`User ID: ${authData.user.id}`)
    console.log(`Email: ${authData.user.email}`)
    
    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (profileError) {
      console.log('⚠️ No user profile found, this is expected for new users')
    } else {
      console.log('✅ User profile found:', profile.first_name, profile.last_name)
    }
    
    // Get active configurations
    console.log('\n📋 Checking configurations...')
    const { data: configs, error: configError } = await supabase
      .from('test_configurations')
      .select(`
        *,
        test_sequences (
          *,
          test_types (name, description, estimated_duration_minutes)
        )
      `)
      .eq('is_active', true)
    
    if (configError) {
      console.error('❌ Failed to get configurations:', configError.message)
      return
    }
    
    console.log(`✅ Found ${configs.length} active configurations`)
    configs.forEach(config => {
      console.log(`   - ${config.name}: ${config.test_sequences?.length || 0} tests`)
    })
    
    // Test session creation
    if (configs.length > 0) {
      console.log('\n🧪 Testing session creation...')
      const { data: session, error: sessionError } = await supabase
        .from('assessment_sessions')
        .insert({
          user_id: authData.user.id,
          configuration_id: configs[0].id,
          status: 'started',
          current_test_index: 0
        })
        .select()
        .single()
      
      if (sessionError) {
        console.error('❌ Session creation failed:', sessionError.message)
      } else {
        console.log(`✅ Created session: ${session.id}`)
        
        // Test getting current test for the session
        console.log('\n📝 Testing current test retrieval...')
        
        // This should use the same logic as the AssessmentOrchestrator
        const config = configs[0]
        if (config.test_sequences && config.test_sequences.length > 0) {
          const currentSequence = config.test_sequences[0] // First test
          const testTypeId = currentSequence.test_type_id
          
          // Get questions for this test type
          const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .eq('test_type_id', testTypeId)
            .eq('is_active', true)
            .order('order_index', { ascending: true })
          
          if (questionsError) {
            console.error('❌ Failed to get questions:', questionsError.message)
          } else {
            console.log(`✅ Found ${questions.length} questions for current test`)
          }
        }
      }
    }
    
    // Sign out
    await supabase.auth.signOut()
    console.log('\n✅ Signed out successfully')
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
  }
}

testAuthFlow()
