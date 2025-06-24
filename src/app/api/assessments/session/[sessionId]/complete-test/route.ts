// src/app/api/assessments/session/[sessionId]/complete-test/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import { AssessmentOrchestrator } from '@/lib/services/AssessmentOrchestrator'

export async function POST(
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
    const orchestrator = new AssessmentOrchestrator(supabase)
    
    // Verify session belongs to user
    const session = await orchestrator.getAssessmentSession(sessionId)
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await orchestrator.completeCurrentTest(sessionId)
    
    return NextResponse.json({ 
      success: true, 
      hasNextTest: result.hasNextTest,
      nextTestIndex: result.nextTestIndex,
      isAssessmentComplete: result.isAssessmentComplete
    })
  } catch (error: any) {
    console.error('Complete test error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete test' }, 
      { status: 500 }
    )
  }
}