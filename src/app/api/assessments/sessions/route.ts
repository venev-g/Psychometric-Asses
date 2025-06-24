// src/app/api/assessments/sessions/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import { AssessmentOrchestrator } from '@/lib/services/AssessmentOrchestrator'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orchestrator = new AssessmentOrchestrator(supabase)
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