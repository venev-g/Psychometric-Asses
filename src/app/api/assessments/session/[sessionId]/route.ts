// src/app/api/assessments/session/[sessionId]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.sessionId

    // Handle demo sessions
    if (sessionId.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          status: 'started',
          current_test_index: 0,
          demo_mode: true
        }
      })
    }

    // Get session from database
    const { data: session, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, session })
  } catch (error: any) {
    console.error('Get session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get session' }, 
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.sessionId
    const updates = await request.json()

    // Handle demo sessions (no database update)
    if (sessionId.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        session: { id: sessionId, ...updates, demo_mode: true }
      })
    }

    // Update session in database
    const { data: session, error } = await supabase
      .from('assessment_sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
    }

    return NextResponse.json({ success: true, session })
  } catch (error: any) {
    console.error('Update session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update session' }, 
      { status: 500 }
    )
  }
}
