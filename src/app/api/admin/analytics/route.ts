import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication and admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    const daysAgo = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 7
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get total assessments
    const { count: totalAssessments } = await supabase
      .from('assessment_sessions')
      .select('*', { count: 'exact', head: true })

    // Get completed assessments for completion rate
    const { count: completedAssessments } = await supabase
      .from('assessment_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('assessment_sessions')
      .select(`
        id,
        created_at,
        status,
        user_profiles!inner(
          full_name,
          avatar_url
        ),
        test_configurations!inner(
          name
        )
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    // Get user growth data (daily signups in the selected range)
    const { data: userGrowthData } = await supabase
      .from('user_profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Process user growth data into daily counts
    const userGrowth = []
    const currentDate = new Date(startDate)
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const daySignups = userGrowthData?.filter(user => 
        user.created_at?.startsWith(dateStr)
      ).length || 0
      
      userGrowth.push({
        date: dateStr,
        count: daySignups
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate completion rate
    const completionRate = totalAssessments ? 
      Math.round((completedAssessments || 0) / totalAssessments * 100) : 0

    // Calculate average score from assessment results
    const { data: results } = await supabase
      .from('assessment_results')
      .select('processed_scores')
      .not('processed_scores', 'is', null)

    let averageScore = 0
    if (results && results.length > 0) {
      const totalScores = results.reduce((sum, result) => {
        const scores = result.processed_scores as any
        // Try to extract a meaningful score from the processed scores
        if (scores && typeof scores === 'object') {
          const scoreValue = scores.overall_score || scores.total_score || scores.score
          if (typeof scoreValue === 'number') {
            return sum + scoreValue
          }
        }
        return sum
      }, 0)
      averageScore = Math.round(totalScores / results.length)
    }

    const analyticsData = {
      totalUsers: totalUsers || 0,
      totalAssessments: totalAssessments || 0,
      completionRate,
      averageScore,
      recentActivity: recentActivity || [],
      userGrowth
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
