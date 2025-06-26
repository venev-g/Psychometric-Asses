// src/app/api/assessments/history/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get assessment history for the user
    const { data: sessions, error } = await supabase
      .from('assessment_sessions')
      .select(`
        *,
        test_configurations (name, description),
        assessment_results (
          id,
          test_type_id,
          processed_scores,
          test_types (name, slug, description)
        )
      `)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(50) // Limit to last 50 sessions

    if (error) {
      console.error('History fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch assessment history' }, { status: 500 })
    }

    // Transform the data for easier frontend consumption
    const transformedSessions = sessions.map(session => ({
      ...session,
      configurationName: session.test_configurations?.name || 'Unknown Configuration',
      resultsSummary: session.assessment_results?.map((result: any) => ({
        testType: result.test_types?.name || 'Unknown Test',
        slug: result.test_types?.slug,
        scores: result.processed_scores
      })) || []
    }))

    return NextResponse.json({
      sessions: transformedSessions,
      success: true
    })
  } catch (error: any) {
    console.error('Get assessment history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
