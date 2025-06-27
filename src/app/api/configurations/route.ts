// src/app/api/configurations/route.ts
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import { ConfigurationService } from '@/lib/services/ConfigurationService'

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
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Use service role for DB operations to bypass role issues
    const supabaseService = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const configService = new ConfigurationService(supabaseService)
    
    const configurations = await configService.getAllConfigurations()
    
    // If no configurations found, use temporary ones
    if (!configurations || configurations.length === 0) {
      console.log('No configurations found in database, using temporary fallback')
      
      // Fetch temporary configurations
      const tempResponse = await fetch(new URL('/api/admin/temp-configs', request.url))
      const tempData = await tempResponse.json()
      
      return NextResponse.json({ 
        success: true, 
        configurations: tempData.configurations || [],
        source: 'temporary'
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      configurations,
      source: 'database'
    })
  } catch (error: any) {
    console.error('Get configurations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get configurations' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role for DB operations to bypass role issues
    const supabaseService = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is admin
    const { data: profile } = await supabaseService
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const configData = await request.json()
    const configService = new ConfigurationService(supabaseService)
    
    const configuration = await configService.createConfiguration({
      ...configData,
      created_by: user.id
    })
    
    return NextResponse.json({ 
      success: true, 
      configuration 
    })
  } catch (error: any) {
    console.error('Create configuration error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create configuration' }, 
      { status: 500 }
    )
  }
}
