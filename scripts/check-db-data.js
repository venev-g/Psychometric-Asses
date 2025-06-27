// scripts/check-db-data.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkData() {
  console.log('Checking database data...')
  
  try {
    // Check test types
    const { data: testTypes, error: testTypesError } = await supabase
      .from('test_types')
      .select('*')

    if (testTypesError) {
      console.error('Error fetching test types:', testTypesError)
    } else {
      console.log(`Found ${testTypes?.length || 0} test types:`)
      testTypes?.forEach(type => {
        console.log(`  - ${type.name} (${type.slug}) - Active: ${type.is_active}`)
      })
    }

    // Check questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
    } else {
      console.log(`Found ${questions?.length || 0} questions`)
      
      // Group by test type
      const questionsByType = {}
      questions?.forEach(q => {
        const typeId = q.test_type_id
        if (!questionsByType[typeId]) {
          questionsByType[typeId] = 0
        }
        questionsByType[typeId]++
      })
      
      console.log('Questions by test type:')
      Object.entries(questionsByType).forEach(([typeId, count]) => {
        const type = testTypes?.find(t => t.id === typeId)
        console.log(`  - ${type?.name || typeId}: ${count} questions`)
      })
    }

    // Check configurations
    const { data: configs, error: configsError } = await supabase
      .from('test_configurations')
      .select('*, test_sequences(*)')

    if (configsError) {
      console.error('Error fetching configurations:', configsError)
    } else {
      console.log(`Found ${configs?.length || 0} test configurations:`)
      configs?.forEach(config => {
        console.log(`  - ${config.name}: ${config.test_sequences?.length || 0} sequences`)
      })
    }

  } catch (error) {
    console.error('Check failed:', error)
  }
}

checkData()
