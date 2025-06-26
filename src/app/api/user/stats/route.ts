// src/app/api/user/stats/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

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
              // Server Component cookie setting can be ignored
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's assessment sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('assessment_sessions')
      .select('id, status, started_at, completed_at')
      .eq('user_id', user.id)

    if (sessionsError) {
      throw sessionsError
    }

    // Get user's assessment results
    const { data: results, error: resultsError } = await supabase
      .from('assessment_results')
      .select(`
        id, 
        session_id, 
        test_type_id, 
        created_at,
        test_types (name, slug)
      `)
      .in('session_id', sessions?.map(s => s.id) || [])

    if (resultsError) {
      throw resultsError
    }

    // Calculate statistics
    const totalAssessments = sessions?.length || 0
    const completedAssessments = sessions?.filter(s => s.status === 'completed').length || 0
    const inProgressAssessments = sessions?.filter(s => s.status === 'in_progress').length || 0
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentSessions = sessions?.filter(s => 
      s.started_at && new Date(s.started_at) >= thirtyDaysAgo
    ) || []

    // Assessment types completed
    const testTypesCompleted = new Set(results?.map(r => r.test_types?.slug)).size

    // Time spent (estimated from completed sessions)
    const completedSessionsWithDuration = sessions?.filter(s => 
      s.status === 'completed' && s.started_at && s.completed_at
    ) || []
    
    const totalTimeSpentMinutes = completedSessionsWithDuration.reduce((total, session) => {
      if (!session.started_at || !session.completed_at) return total
      const start = new Date(session.started_at)
      const end = new Date(session.completed_at)
      const durationMs = end.getTime() - start.getTime()
      const durationMinutes = Math.round(durationMs / (1000 * 60))
      return total + durationMinutes
    }, 0)

    // Recent assessments for dashboard display
    const recentAssessments = sessions
      ?.filter(s => s.status === 'completed')
      .sort((a, b) => {
        const aDate = a.completed_at || a.started_at
        const bDate = b.completed_at || b.started_at
        if (!aDate || !bDate) return 0
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      })
      .slice(0, 5)
      .map(session => {
        const sessionResults = results?.filter(r => r.session_id === session.id) || []
        return {
          id: session.id,
          completedAt: session.completed_at || session.started_at,
          testsCompleted: sessionResults.length,
          testTypes: sessionResults.map(r => r.test_types?.name).filter(Boolean)
        }
      }) || []

    const stats = {
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      testTypesCompleted,
      totalTimeSpentMinutes,
      recentActivity: recentSessions.length,
      recentAssessments
    }

    return NextResponse.json({ 
      success: true, 
      stats
    })
  } catch (error: any) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get user statistics' }, 
      { status: 500 }
    )
  }
}
