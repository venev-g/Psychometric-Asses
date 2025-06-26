// src/app/api/admin/setup/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function POST() {
  try {
    // Use anon key for initial setup
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('Starting admin setup...')

    // First, let's try to create an admin user via signup
    const adminEmail = 'admin@psychometric.com'
    const adminPassword = 'admin123456'

    // Check if admin already exists by trying to sign in
    const { data: existingSession, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    })

    let adminUserId = null

    if (existingSession?.user) {
      console.log('Admin user already exists')
      adminUserId = existingSession.user.id
    } else {    // Try to create admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: 'Admin User',
          role: 'admin'
        },
        emailRedirectTo: undefined // Disable email confirmation for setup
      }
    })

      if (signUpError) {
        console.error('Failed to create admin user:', signUpError)
        return NextResponse.json({ 
          error: 'Failed to create admin user', 
          details: signUpError.message 
        }, { status: 500 })
      }

      adminUserId = signUpData.user?.id
      console.log('Admin user created:', adminUserId)
    }

    if (!adminUserId) {
      return NextResponse.json({ 
        error: 'Failed to get admin user ID' 
      }, { status: 500 })
    }

    // Create user profile for admin
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: adminUserId,
        full_name: 'Admin User',
        role: 'admin'
      })

    if (profileError) {
      console.log('Profile creation error (might already exist):', profileError.message)
    }

    // Now try to sign in as admin and create configurations
    const { data: adminSession, error: adminSignInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    })

    if (adminSignInError || !adminSession.user) {
      return NextResponse.json({ 
        error: 'Failed to authenticate as admin', 
        details: adminSignInError?.message 
      }, { status: 500 })
    }

    console.log('Authenticated as admin, checking configurations...')

    // Check existing configurations
    const { data: existingConfigs, error: checkError } = await supabase
      .from('test_configurations')
      .select('*')

    if (checkError) {
      console.error('Error checking configurations:', checkError)
      return NextResponse.json({ 
        error: 'Failed to check configurations', 
        details: checkError.message 
      }, { status: 500 })
    }

    if (existingConfigs.length > 0) {
      return NextResponse.json({ 
        message: 'Setup already complete', 
        configurations: existingConfigs.length,
        adminCreated: false
      })
    }

    // Insert configurations as admin
    const { data: configs, error: configError } = await supabase
      .from('test_configurations')
      .insert([
        {
          name: 'Complete Psychometric Profile',
          description: 'A comprehensive assessment covering intelligence patterns, personality traits, and learning preferences. Perfect for personal development and career planning.',
          max_attempts: 3,
          time_limit_minutes: 45,
          is_active: true,
          created_by: adminUserId
        },
        {
          name: 'Quick Personality Check',
          description: 'A focused assessment on personality patterns and learning styles for quick insights.',
          max_attempts: 5,
          time_limit_minutes: 25,
          is_active: true,
          created_by: adminUserId
        }
      ])
      .select()

    if (configError) {
      console.error('Error inserting configurations:', configError)
      return NextResponse.json({ 
        error: 'Failed to insert configurations', 
        details: configError.message 
      }, { status: 500 })
    }

    console.log('Configurations created:', configs.length)

    // Get test types for sequences
    const { data: testTypes, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, slug')

    if (testTypeError) {
      return NextResponse.json({ 
        error: 'Failed to get test types', 
        details: testTypeError.message 
      }, { status: 500 })
    }

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
        return NextResponse.json({ 
          error: 'Failed to insert test sequences', 
          details: sequenceError.message 
        }, { status: 500 })
      }

      console.log('Test sequences created:', sequenceData.length)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Admin setup and configuration seeding completed successfully!',
      data: {
        adminUser: adminEmail,
        configurations: configs.length,
        sequences: sequences.length,
        testTypes: testTypes.length
      }
    })

  } catch (error: any) {
    console.error('Setup failed:', error)
    return NextResponse.json({ 
      error: error.message || 'Setup failed' 
    }, { status: 500 })
  }
}
