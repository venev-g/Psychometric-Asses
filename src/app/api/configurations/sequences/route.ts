// src/app/api/configurations/sequences/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import { ConfigurationService } from '@/lib/services/ConfigurationService'

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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { configurationId, testTypeId, sequenceOrder, isRequired } = await request.json()
    const configService = new ConfigurationService(supabase)
    
    const sequence = await configService.addTestToSequence(
      configurationId, 
      testTypeId, 
      sequenceOrder, 
      isRequired
    )
    
    return NextResponse.json({ 
      success: true, 
      sequence 
    })
  } catch (error: any) {
    console.error('Add test sequence error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add test sequence' }, 
      { status: 500 }
    )
  }
}