import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          async setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Server Component issue - ignore
            }
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 })
    }

    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch profile'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: profile || null,
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        user_metadata: user.user_metadata
      }
    })

  } catch (error: any) {
    console.error('Profile GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, date_of_birth, gender, occupation, education_level, goals } = body

    const cookieStore = await cookies()
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          async setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Server Component issue - ignore
            }
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 })
    }

    // Upsert user profile
    const profileData = {
      id: user.id,
      email: user.email!,
      full_name: full_name || user.user_metadata?.full_name || '',
      date_of_birth,
      gender,
      occupation,
      education_level,
      goals: goals || [],
      role: 'user',
      onboarding_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single()

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Failed to save profile: ' + profileError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile saved successfully'
    })

  } catch (error: any) {
    console.error('Profile POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  // Update existing profile - same logic as POST but with update-only approach
  return POST(request)
}
