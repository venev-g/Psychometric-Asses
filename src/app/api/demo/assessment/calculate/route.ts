// src/app/api/demo/assessment/calculate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { DominantIntelligenceAssessment } from '@/lib/assessments/DominantIntelligenceAssessment'
import { PersonalityPatternAssessment } from '@/lib/assessments/PersonalityPatternAssessment'
import { VarkAssessment } from '@/lib/assessments/VarkAssessment'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, testType, responses } = await request.json()
    
    if (!testType || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    let assessment: any
    let scores: any

    // Create assessment instance based on test type
    switch (testType) {
      case 'dominant-intelligence':
        assessment = new DominantIntelligenceAssessment()
        break
      case 'personality-pattern':
        assessment = new PersonalityPatternAssessment()
        break
      case 'vark':
        assessment = new VarkAssessment()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        )
    }

    // Convert responses to the format expected by the assessment
    const formattedResponses = responses.map((r: any) => ({
      questionId: r.questionId,
      responseValue: r.response
    }))

    // For demo purposes, create mock questions with categories
    const mockQuestions = responses.map((r: any, index: number) => ({
      id: r.questionId,
      category: getDemoCategory(testType, index),
      weight: 1
    }))

    // Calculate scores
    scores = assessment.calculateScores(formattedResponses, mockQuestions)
    
    // Generate recommendations
    const recommendations = assessment.generateRecommendations(scores)
    
    const results = {
      sessionId,
      testType,
      scores,
      recommendations,
      completedAt: new Date().toISOString(),
      demo: true
    }
    
    return NextResponse.json({ 
      success: true, 
      results
    })
  } catch (error: any) {
    console.error('Demo assessment calculation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to calculate results' }, 
      { status: 500 }
    )
  }
}

function getDemoCategory(testType: string, index: number): string {
  switch (testType) {
    case 'dominant-intelligence':
      const intelligenceCategories = [
        'linguistic', 'logical-mathematical', 'spatial', 'bodily-kinesthetic',
        'musical', 'interpersonal', 'intrapersonal', 'naturalistic'
      ]
      return intelligenceCategories[index % intelligenceCategories.length]
      
    case 'personality-pattern':
      const discCategories = ['dominance', 'influence', 'steadiness', 'conscientiousness']
      return discCategories[index % discCategories.length]
      
    case 'vark':
      const varkCategories = ['visual', 'auditory', 'reading-writing', 'kinesthetic']
      return varkCategories[index % varkCategories.length]
      
    default:
      return 'general'
  }
}
