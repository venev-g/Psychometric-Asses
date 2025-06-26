// scripts/seed-configurations.js
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Using the anon key for basic operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Key available:', !!supabaseAnonKey)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedConfigurations() {
  try {
    console.log('Checking existing configurations...')
    
    // Check if configurations already exist
    const { data: existingConfigs, error: checkError } = await supabase
      .from('test_configurations')
      .select('*')
    
    if (checkError) {
      console.error('Error checking configurations:', checkError)
      return
    }
    
    console.log('Existing configurations:', existingConfigs.length)
    
    if (existingConfigs.length > 0) {
      console.log('Configurations already exist:', existingConfigs.map(c => c.name))
      return
    }
    
    console.log('Seeding configurations...')
    
    // Insert configurations
    const { data: configs, error: configError } = await supabase
      .from('test_configurations')
      .insert([
        {
          name: 'Complete Psychometric Profile',
          description: 'A comprehensive assessment covering intelligence patterns, personality traits, and learning preferences. Perfect for personal development and career planning.',
          max_attempts: 3,
          time_limit_minutes: 45,
          is_active: true
        },
        {
          name: 'Quick Personality Check',
          description: 'A focused assessment on personality patterns and learning styles for quick insights.',
          max_attempts: 5,
          time_limit_minutes: 25,
          is_active: true
        }
      ])
      .select()
    
    if (configError) {
      console.error('Error inserting configurations:', configError)
      return
    }
    
    console.log('Configurations created:', configs)
    
    // Get test type IDs
    const { data: testTypes, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, slug')
    
    if (testTypeError) {
      console.error('Error getting test types:', testTypeError)
      return
    }
    
    console.log('Available test types:', testTypes)
    
    const intelligenceTest = testTypes.find(t => t.slug === 'dominant-intelligence')
    const personalityTest = testTypes.find(t => t.slug === 'personality-pattern')
    const varkTest = testTypes.find(t => t.slug === 'vark')
    
    const completeProfile = configs.find(c => c.name === 'Complete Psychometric Profile')
    const quickCheck = configs.find(c => c.name === 'Quick Personality Check')
    
    // Insert test sequences
    const sequences = []
    
    if (completeProfile && intelligenceTest && personalityTest && varkTest) {
      sequences.push(
        { configuration_id: completeProfile.id, test_type_id: intelligenceTest.id, sequence_order: 0, is_required: true },
        { configuration_id: completeProfile.id, test_type_id: personalityTest.id, sequence_order: 1, is_required: true },
        { configuration_id: completeProfile.id, test_type_id: varkTest.id, sequence_order: 2, is_required: true }
      )
    }
    
    if (quickCheck && personalityTest && varkTest) {
      sequences.push(
        { configuration_id: quickCheck.id, test_type_id: personalityTest.id, sequence_order: 0, is_required: true },
        { configuration_id: quickCheck.id, test_type_id: varkTest.id, sequence_order: 1, is_required: true }
      )
    }
    
    if (sequences.length > 0) {
      const { data: sequenceData, error: sequenceError } = await supabase
        .from('test_sequences')
        .insert(sequences)
        .select()
      
      if (sequenceError) {
        console.error('Error inserting test sequences:', sequenceError)
        return
      }
      
      console.log('Test sequences created:', sequenceData.length)
    }
    
    console.log('Seeding completed successfully!')
    
  } catch (error) {
    console.error('Seeding failed:', error)
  }
}

seedConfigurations()
