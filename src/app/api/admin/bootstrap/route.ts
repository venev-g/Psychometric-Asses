import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { serviceRoleKey, adminEmail, adminPassword } = await request.json()
    
    if (!serviceRoleKey || !adminEmail || !adminPassword) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: serviceRoleKey, adminEmail, adminPassword'
      }, { status: 400 })
    }

    // Update environment variables (this would need manual update in production)
    console.log('Service Role Key provided:', serviceRoleKey.substring(0, 20) + '...')
    
    // Create admin client with provided service role key
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Test the service role key by trying to create an admin user
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          full_name: 'System Administrator'
        }
      })
      
      if (authError) {
        console.error('Auth error:', authError)
        return NextResponse.json({
          success: false,
          error: 'Failed to create admin user: ' + authError.message
        }, { status: 400 })
      }

      // Insert into user_profiles table with admin role
      const { error: userError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: adminEmail,
          role: 'admin',
          full_name: 'System Administrator',
          created_at: new Date().toISOString()
        })
      
      if (userError) {
        console.error('User profile error:', userError)
        return NextResponse.json({
          success: false,
          error: 'Failed to create user profile: ' + userError.message
        }, { status: 400 })
      }

      // Now seed test configurations
      const configurations = [
        {
          id: 'config-dominant-intelligence',
          test_type_id: '7c8d2f56-3b83-4930-800a-5a50940c98ec',
          name: 'Standard Intelligence Assessment Configuration',
          description: 'Default configuration for multiple intelligence assessment',
          settings: {
            time_limit_minutes: 15,
            randomize_questions: false,
            show_progress: true,
            require_all_questions: true
          },
          question_sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'config-personality-pattern',
          test_type_id: '66dc483d-6a2c-42ec-8ce3-751b17becbfe',
          name: 'Standard Personality Assessment Configuration',
          description: 'Default configuration for DISC personality assessment',
          settings: {
            time_limit_minutes: 12,
            randomize_questions: false,
            show_progress: true,
            require_all_questions: true
          },
          question_sequence: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68],
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'config-vark',
          test_type_id: '31ec4fc1-e033-4276-bb47-cac323548f7c',
          name: 'Standard VARK Learning Style Configuration',
          description: 'Default configuration for VARK learning style assessment',
          settings: {
            time_limit_minutes: 10,
            randomize_questions: false,
            show_progress: true,
            require_all_questions: true
          },
          question_sequence: [69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]

      const { error: configError } = await supabaseAdmin
        .from('test_configurations')
        .upsert(configurations, { onConflict: 'id' })
      
      if (configError) {
        console.error('Config error:', configError)
        return NextResponse.json({
          success: false,
          error: 'Failed to seed configurations: ' + configError.message
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: 'Admin user created and configurations seeded successfully',
        data: {
          userId: authData.user.id,
          email: adminEmail,
          configurationsCount: configurations.length
        }
      })

    } catch (error: any) {
      console.error('Setup error:', error)
      return NextResponse.json({
        success: false,
        error: 'Service role key validation failed: ' + error.message
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Admin setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Admin setup endpoint. Use POST with serviceRoleKey, adminEmail, and adminPassword.',
    instructions: [
      '1. Get your service role key from Supabase Dashboard > Settings > API',
      '2. POST to this endpoint with:',
      '   - serviceRoleKey: your Supabase service role key',
      '   - adminEmail: email for the admin user',
      '   - adminPassword: password for the admin user',
      '3. This will create an admin user and seed test configurations'
    ]
  })
}
