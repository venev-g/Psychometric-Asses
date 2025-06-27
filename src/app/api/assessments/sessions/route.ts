// src/app/api/assessments/sessions/route.ts
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import { AssessmentOrchestrator } from '@/lib/services/AssessmentOrchestrator'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Create client for authentication
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

    // Use service role client for database operations to avoid role issues
    const supabaseService = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const orchestrator = new AssessmentOrchestrator(supabaseService)
    const sessions = await orchestrator.getUserSessions(user.id)
    
    return NextResponse.json({ success: true, sessions })
  } catch (error: any) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get sessions' }, 
      { status: 500 }
    )
  }
}