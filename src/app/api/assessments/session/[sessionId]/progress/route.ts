// src/app/api/assessments/session/[sessionId]/progress/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import { AssessmentOrchestrator } from '@/lib/services/AssessmentOrchestrator'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
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

    const { sessionId } = params
    const { searchParams } = new URL(request.url)
    const testTypeId = searchParams.get('testTypeId')

    if (!testTypeId) {
      return NextResponse.json(
        { error: 'Test Type ID is required' },
        { status: 400 }
      )
    }

    const orchestrator = new AssessmentOrchestrator(supabase)
    
    // Verify session belongs to user
    const session = await orchestrator.getAssessmentSession(sessionId)
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const progress = await orchestrator.getTestProgress(sessionId, testTypeId)
    
    return NextResponse.json({ 
      success: true, 
      progress
    })
  } catch (error: any) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get progress' }, 
      { status: 500 }
    )
  }
}