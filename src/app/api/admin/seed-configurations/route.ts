// src/app/api/admin/seed-configurations/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function POST() {
  try {
    // Use the anon key but with admin bypass for seeding
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('Checking existing configurations...')
    
    // Check if configurations already exist
    const { data: existingConfigs, error: checkError } = await supabase
      .from('test_configurations')
      .select('*')
    
    if (checkError) {
      console.error('Error checking configurations:', checkError)
      return NextResponse.json({ error: 'Failed to check configurations', details: checkError }, { status: 500 })
    }
    
    console.log('Existing configurations:', existingConfigs.length)
    
    if (existingConfigs.length > 0) {
      return NextResponse.json({ message: 'Configurations already exist', count: existingConfigs.length, configurations: existingConfigs })
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
      return NextResponse.json({ error: 'Failed to insert configurations', details: configError }, { status: 500 })
    }
    
    console.log('Configurations created:', configs)
    
    // Get test type IDs
    const { data: testTypes, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, slug')
    
    if (testTypeError) {
      console.error('Error getting test types:', testTypeError)
      return NextResponse.json({ error: 'Failed to get test types' }, { status: 500 })
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
        return NextResponse.json({ error: 'Failed to insert test sequences', details: sequenceError }, { status: 500 })
      }
      
      console.log('Test sequences created:', sequenceData.length)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Configurations seeded successfully!',
        configurations: configs.length,
        sequences: sequenceData.length,
        data: {
          configurations: configs,
          sequences: sequenceData
        }
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'Configurations created but no sequences (missing test types)',
        configurations: configs.length,
        sequences: 0,
        data: { configurations: configs }
      })
    }
    
  } catch (error: any) {
    console.error('Configuration seeding failed:', error)
    return NextResponse.json({ error: error.message || 'Configuration seeding failed' }, { status: 500 })
  }
}
