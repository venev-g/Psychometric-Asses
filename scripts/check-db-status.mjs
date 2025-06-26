// scripts/check-db-status.mjs
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sayftcijqhnpzlznvqcz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheWZ0Y2lqcWhucHpsem52cWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDg3ODIsImV4cCI6MjA2NjMyNDc4Mn0.KOVN23WGHnA9PRs549-cQDVyWxlvGeriDdkwR1cLr7g'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking database status...\n')
  
  try {
    // Check test configurations
    console.log('📋 Test Configurations:')
    const { data: configs, error: configError } = await supabase
      .from('test_configurations')
      .select('id, name, description, is_active')
      .eq('is_active', true)
    
    if (configError) {
      console.error('❌ Error fetching configurations:', configError.message)
    } else {
      console.log(`✅ Found ${configs?.length || 0} active configurations`)
      configs?.forEach(c => console.log(`   - ${c.name} (${c.id}):`))
    }
    
    // Check test types
    console.log('\n🧠 Test Types:')
    const { data: testTypes, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, name, slug, description')
      .eq('is_active', true)
    
    if (testTypeError) {
      console.error('❌ Error fetching test types:', testTypeError.message)
    } else {
      console.log(`✅ Found ${testTypes?.length || 0} test types`)
      testTypes?.forEach(t => console.log(`   - ${t.name} (${t.slug})`))
    }
    
    // Check questions
    console.log('\n❓ Questions:')
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('id, test_type_id, category')
      .eq('is_active', true)
      .limit(5)
    
    if (questionError) {
      console.error('❌ Error fetching questions:', questionError.message)
    } else {
      console.log(`✅ Found questions (showing first 5 of ${questions?.length || 0})`)
      questions?.forEach(q => console.log(`   - Question ${q.id} for test ${q.test_type_id} (${q.category})`))
    }
    
    // Check users
    console.log('\n👥 Users:')
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name')
    
    if (userError) {
      console.error('❌ Error fetching users:', userError.message)
    } else {
      console.log(`✅ Found ${users?.length || 0} users`)
      users?.forEach(u => console.log(`   - ${u.email} (${u.first_name} ${u.last_name})`))
    }
    
    // Check assessment sessions
    console.log('\n📊 Assessment Sessions:')
    const { data: sessions, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('id, user_id, status, created_at')
      .limit(5)
    
    if (sessionError) {
      console.error('❌ Error fetching sessions:', sessionError.message)
    } else {
      console.log(`✅ Found ${sessions?.length || 0} assessment sessions`)
      sessions?.forEach(s => console.log(`   - Session ${s.id}: ${s.status} (${s.created_at})`))
    }
    
  } catch (error) {
    console.error('💥 Database check failed:', error.message)
  }
}

checkDatabase()
