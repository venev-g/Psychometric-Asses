// scripts/test-questions-service.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sayftcijqhnpzlznvqcz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheWZ0Y2lqcWhucHpsem52cWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDg3ODIsImV4cCI6MjA2NjMyNDc4Mn0.KOVN23WGHnA9PRs549-cQDVyWxlvGeriDdkwR1cLr7g"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testQuestionsService() {
  console.log('Testing QuestionsService...')
  
  try {
    // Test individual test type queries
    console.log('\n1. Testing dominant-intelligence:')
    const { data: testTypes1, error: error1 } = await supabase
      .from('test_types')
      .select('id, name')
      .eq('slug', 'dominant-intelligence')
      .eq('is_active', true)

    if (error1) {
      console.error('Error:', error1)
    } else {
      console.log('Test types found:', testTypes1)
      
      if (testTypes1 && testTypes1.length > 0) {
        const { data: questions1, error: qError1 } = await supabase
          .from('questions')
          .select('*')
          .eq('test_type_id', testTypes1[0].id)
          .or('is_active.is.null,is_active.eq.true')
          .order('order_index')
        
        if (qError1) {
          console.error('Questions error:', qError1)
        } else {
          console.log(`Found ${questions1?.length || 0} questions`)
        }
      }
    }

    console.log('\n2. Testing personality-pattern:')
    const { data: testTypes2, error: error2 } = await supabase
      .from('test_types')
      .select('id, name')
      .eq('slug', 'personality-pattern')
      .eq('is_active', true)

    if (error2) {
      console.error('Error:', error2)
    } else {
      console.log('Test types found:', testTypes2)
    }

    console.log('\n3. Testing vark:')
    const { data: testTypes3, error: error3 } = await supabase
      .from('test_types')
      .select('id, name')
      .eq('slug', 'vark')
      .eq('is_active', true)

    if (error3) {
      console.error('Error:', error3)
    } else {
      console.log('Test types found:', testTypes3)
    }

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testQuestionsService()
