// src/app/api/assessments/responses/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, questionId, responseValue, responseTimeMs } = await request.json()

    // Handle demo responses (store in memory/localStorage)
    if (sessionId.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        response: {
          id: `demo-response-${Date.now()}`,
          session_id: sessionId,
          question_id: questionId,
          response_value: responseValue,
          response_time_ms: responseTimeMs,
          demo_mode: true
        }
      })
    }

    // Save response to database
    const { data: response, error } = await supabase
      .from('user_responses')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        response_value: responseValue,
        response_time_ms: responseTimeMs
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
    }

    return NextResponse.json({ success: true, response })
  } catch (error: any) {
    console.error('Save response error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save response' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Handle demo responses
    if (sessionId.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        responses: [],
        demo_mode: true
      })
    }

    // Get responses from database
    const { data: responses, error } = await supabase
      .from('user_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to get responses' }, { status: 500 })
    }

    return NextResponse.json({ success: true, responses })
  } catch (error: any) {
    console.error('Get responses error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get responses' }, 
      { status: 500 }
    )
  }
}
