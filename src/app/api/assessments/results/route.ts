// src/app/api/assessments/results/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ScoringEngine } from '@/lib/assessments/ScoringEngine'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, testTypeId, responses } = await request.json()

    if (!sessionId || !testTypeId || !responses) {
      return NextResponse.json({ 
        error: 'Session ID, test type ID, and responses are required' 
      }, { status: 400 })
    }

    // Get test type configuration
    const { data: testType, error: testTypeError } = await supabase
      .from('test_types')
      .select('*')
      .eq('id', testTypeId)
      .single()

    if (testTypeError || !testType) {
      return NextResponse.json({ error: 'Test type not found' }, { status: 404 })
    }

    // Get questions for this test type
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_type_id', testTypeId)
      .eq('is_active', true)

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to get questions' }, { status: 500 })
    }

    // Calculate scores using the scoring engine
    const scoringConfig = (testType.scoring_algorithm as any) || {
      categories: ['general'],
      scoring_method: 'weighted_sum',
      normalization: 'percentage'
    }

    const { rawScores, processedScores, recommendations } = ScoringEngine.calculateScores(
      responses,
      scoringConfig,
      questions
    )

    // Handle demo mode
    if (sessionId.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        results: {
          id: `demo-result-${Date.now()}`,
          session_id: sessionId,
          test_type_id: testTypeId,
          raw_scores: rawScores,
          processed_scores: processedScores,
          recommendations,
          demo_mode: true,
          created_at: new Date().toISOString()
        }
      })
    }

    // Save results to database
    const { data: result, error: resultError } = await supabase
      .from('assessment_results')
      .insert({
        session_id: sessionId,
        test_type_id: testTypeId,
        raw_scores: rawScores,
        processed_scores: processedScores,
        recommendations
      })
      .select()
      .single()

    if (resultError) {
      return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
    }

    return NextResponse.json({ success: true, results: result })
  } catch (error: any) {
    console.error('Calculate results error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to calculate results' }, 
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

    // Handle demo mode
    if (sessionId.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        results: [],
        demo_mode: true
      })
    }

    // Get results from database
    const { data: results, error } = await supabase
      .from('assessment_results')
      .select(`
        *,
        test_types (name, slug, description)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to get results' }, { status: 500 })
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('Get results error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get results' }, 
      { status: 500 }
    )
  }
}
