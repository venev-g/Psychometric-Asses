// src/lib/assessments/BaseAssessment.ts
import type { Question, UserResponse, AssessmentResult } from '@/types/assessment.types'

export abstract class BaseAssessment {
  protected testTypeSlug: string
  protected questions: Question[] = []

  constructor(testTypeSlug: string) {
    this.testTypeSlug = testTypeSlug
  }

  abstract calculateScores(responses: UserResponse[], questions: Question[]): any
  abstract generateRecommendations(scores: any): any
  abstract validateResponse(question: Question, response: any): boolean

  async processAssessment(
    responses: UserResponse[], 
    questions: Question[]
  ): Promise<{ rawScores: any; processedScores: any; recommendations: any }> {
    const rawScores = this.calculateScores(responses, questions)
    const processedScores = this.normalizeScores(rawScores)
    const recommendations = this.generateRecommendations(processedScores)

    return {
      rawScores,
      processedScores,
      recommendations
    }
  }

  protected normalizeScores(rawScores: any): any {
    // Default normalization - can be overridden by subclasses
    const total = Object.values(rawScores).reduce((sum: number, score: any) => sum + score, 0)
    const normalized: any = {}
    
    for (const [key, value] of Object.entries(rawScores)) {
      normalized[key] = total > 0 ? Math.round(((value as number) / total) * 100) : 0
    }
    
    return normalized
  }

  protected calculatePercentiles(scores: any, normData?: any): any {
    // Placeholder for percentile calculation
    // In a real implementation, you'd use normative data
    return scores
  }
}