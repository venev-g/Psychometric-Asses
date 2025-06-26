// src/app/api/debug/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET() {
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
              // Server Component cookie setting can be ignored
            }
          },
        },
      }
    )

    // Test basic connection
    const { data: testTypes, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, name, slug, is_active')
      .limit(5)

    const { data: configs, error: configError } = await supabase
      .from('test_configurations')
      .select('id, name, is_active')
      .eq('is_active', true)
      .limit(5)

    const { count: questionCount, error: questionError } = await supabase
      .from('questions')
      .select('*', { count: 'exact' })

    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      success: true,
      database: {
        testTypes: {
          data: testTypes,
          error: testTypeError?.message,
          count: testTypes?.length || 0
        },
        configurations: {
          data: configs,
          error: configError?.message,
          count: configs?.length || 0
        },
        questions: {
          count: questionCount,
          error: questionError?.message
        }
      },
      auth: {
        user: user ? { id: user.id, email: user.email } : null
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
