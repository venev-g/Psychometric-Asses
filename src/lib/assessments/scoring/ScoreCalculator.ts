// src/lib/assessments/scoring/ScoreCalculator.ts
import type { Question, UserResponse } from '@/types/assessment.types'

export interface ScoreCalculationConfig {
  algorithm: 'weighted_sum' | 'average_score' | 'frequency_count' | 'percentile_rank'
  weights?: Record<string, number>
  maxScore?: number
  categories?: string[]
  normalization?: 'none' | 'percentage' | 'z_score' | 'percentile'
}

export interface CalculatedScore {
  rawScore: number
  normalizedScore: number
  percentile?: number
  category: string
  subcategory?: string
  confidence?: number
}

export interface ScoreBreakdown {
  totalScore: number
  categoryScores: Record<string, CalculatedScore>
  metadata: {
    algorithm: string
    questionCount: number
    responseCount: number
    completionRate: number
    averageResponseTime?: number
  }
}

export class ScoreCalculator {
  private config: ScoreCalculationConfig
  private normData: Map<string, any> = new Map()

  constructor(config: ScoreCalculationConfig) {
    this.config = config
  }

  calculateScores(
    responses: UserResponse[], 
    questions: Question[]
  ): ScoreBreakdown {
    const questionMap = new Map(questions.map(q => [q.id, q]))
    const categoryScores: Record<string, CalculatedScore> = {}
    
    // Initialize category scores
    const categories = this.getCategories(questions)
    categories.forEach(category => {
      categoryScores[category] = {
        rawScore: 0,
        normalizedScore: 0,
        category,
        confidence: 0
      }
    })

    // Calculate raw scores by category
    for (const response of responses) {
      const question = questionMap.get(response.questionId)
      if (!question) continue

      const scoreValue = this.extractScoreValue(response, question)
      const weight = this.getQuestionWeight(question)
      const category = question.category || 'general'

      if (categoryScores[category]) {
        categoryScores[category].rawScore += scoreValue * weight
      }
    }

    // Normalize scores
    this.normalizeScores(categoryScores, questions, responses)

    // Calculate total score
    const totalScore = this.calculateTotalScore(categoryScores)

    // Calculate metadata
    const metadata = this.calculateMetadata(responses, questions)

    return {
      totalScore,
      categoryScores,
      metadata
    }
  }

  private extractScoreValue(response: UserResponse, question: Question): number {
    const value = response.responseValue

    switch (question.questionType) {
      case 'rating_scale':
        return typeof value === 'number' ? value : 0
      
      case 'yes_no':
        return typeof value === 'boolean' ? (value ? 1 : 0) : 0
      
      case 'multiple_choice':
        // For multiple choice, we need to look at the option's score value
        const option = question.options?.find(opt => opt.value === value)
        return option?.value || 0
      
      case 'multiselect':
        return Array.isArray(value) ? value.length : 0
      
      case 'ranking':
        // For ranking, higher positions get higher scores
        if (Array.isArray(value)) {
          const totalItems = question.options?.length || value.length
          return totalItems - value.indexOf(response.questionId) + 1
        }
        return 0
      
      case 'slider':
        return typeof value === 'number' ? value / 100 : 0
      
      default:
        return 0
    }
  }

  private getQuestionWeight(question: Question): number {
    if (this.config.weights && question.category) {
      return this.config.weights[question.category] || question.weight || 1
    }
    return question.weight || 1
  }

  private getCategories(questions: Question[]): string[] {
    if (this.config.categories) {
      return this.config.categories
    }
    
    const categories = new Set<string>()
    questions.forEach(q => {
      if (q.category) categories.add(q.category)
    })
    
    return Array.from(categories)
  }

  private normalizeScores(
    categoryScores: Record<string, CalculatedScore>,
    questions: Question[],
    responses: UserResponse[]
  ): void {
    const normalization = this.config.normalization || 'none'

    switch (normalization) {
      case 'percentage':
        this.normalizeToPercentage(categoryScores, questions)
        break
      
      case 'z_score':
        this.normalizeToZScore(categoryScores)
        break
      
      case 'percentile':
        this.normalizeToPercentile(categoryScores)
        break
      
      default:
        // No normalization - just copy raw scores
        Object.values(categoryScores).forEach(score => {
          score.normalizedScore = score.rawScore
        })
    }
  }

  private normalizeToPercentage(
    categoryScores: Record<string, CalculatedScore>,
    questions: Question[]
  ): void {
    const categoryQuestionCounts = this.getCategoryQuestionCounts(questions)
    
    Object.entries(categoryScores).forEach(([category, score]) => {
      const questionCount = categoryQuestionCounts[category] || 1
      const maxPossibleScore = this.getMaxPossibleScore(category, questions)
      
      score.normalizedScore = maxPossibleScore > 0 
        ? Math.round((score.rawScore / maxPossibleScore) * 100)
        : 0
    })
  }

  private normalizeToZScore(categoryScores: Record<string, CalculatedScore>): void {
    const scores = Object.values(categoryScores).map(s => s.rawScore)
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
    const stdDev = Math.sqrt(variance)

    Object.values(categoryScores).forEach(score => {
      score.normalizedScore = stdDev > 0 ? (score.rawScore - mean) / stdDev : 0
    })
  }

  private normalizeToPercentile(categoryScores: Record<string, CalculatedScore>): void {
    // This would require normative data for proper percentile calculation
    // For now, use a simplified approach
    const scores = Object.values(categoryScores).map(s => s.rawScore).sort((a, b) => a - b)
    
    Object.values(categoryScores).forEach(score => {
      const rank = scores.indexOf(score.rawScore) + 1
      score.percentile = Math.round((rank / scores.length) * 100)
      score.normalizedScore = score.percentile
    })
  }

  private getCategoryQuestionCounts(questions: Question[]): Record<string, number> {
    const counts: Record<string, number> = {}
    
    questions.forEach(question => {
      const category = question.category || 'general'
      counts[category] = (counts[category] || 0) + 1
    })
    
    return counts
  }

  private getMaxPossibleScore(category: string, questions: Question[]): number {
    const categoryQuestions = questions.filter(q => q.category === category)
    
    return categoryQuestions.reduce((max, question) => {
      const questionMax = this.getQuestionMaxScore(question)
      const weight = this.getQuestionWeight(question)
      return max + (questionMax * weight)
    }, 0)
  }

  private getQuestionMaxScore(question: Question): number {
    switch (question.questionType) {
      case 'rating_scale':
        // Assume 5-point scale if not specified
        return 5
      
      case 'yes_no':
        return 1
      
      case 'multiple_choice':
        // Return the highest option value
        const maxOption = question.options?.reduce((max, opt) => 
          Math.max(max, typeof opt.value === 'number' ? opt.value : 0), 0) || 1
        return maxOption
      
      case 'multiselect':
        return question.options?.length || 1
      
      case 'ranking':
        return question.options?.length || 1
      
      case 'slider':
        return 1 // Slider is normalized to 0-1 range
      
      default:
        return 1
    }
  }

  private calculateTotalScore(categoryScores: Record<string, CalculatedScore>): number {
    const scores = Object.values(categoryScores).map(s => s.normalizedScore)
    
    switch (this.config.algorithm) {
      case 'weighted_sum':
        return scores.reduce((sum, score) => sum + score, 0)
      
      case 'average_score':
        return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
      
      default:
        return scores.reduce((sum, score) => sum + score, 0)
    }
  }

  private calculateMetadata(responses: UserResponse[], questions: Question[]) {
    const responseCount = responses.length
    const questionCount = questions.length
    const completionRate = questionCount > 0 ? (responseCount / questionCount) * 100 : 0
    
    const responseTimes = responses
      .map(r => r.responseTimeMs)
      .filter((time): time is number => typeof time === 'number')
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : undefined

    return {
      algorithm: this.config.algorithm,
      questionCount,
      responseCount,
      completionRate: Math.round(completionRate),
      averageResponseTime: averageResponseTime ? Math.round(averageResponseTime) : undefined
    }
  }

  // Method to add normative data for percentile calculations
  setNormativeData(category: string, data: any): void {
    this.normData.set(category, data)
  }

  // Method to calculate confidence intervals
  calculateConfidence(score: CalculatedScore, responses: UserResponse[]): number {
    // Simple confidence calculation based on response consistency
    const categoryResponses = responses.filter(r => {
      // This would need to be implemented based on question-category mapping
      return true // Placeholder
    })
    
    if (categoryResponses.length < 3) return 0.5 // Low confidence for few responses
    
    // Calculate response variance as a proxy for confidence
    const responseValues = categoryResponses.map(r => 
      typeof r.responseValue === 'number' ? r.responseValue : 0
    )
    
    const mean = responseValues.reduce((sum, val) => sum + val, 0) / responseValues.length
    const variance = responseValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / responseValues.length
    
    // Convert variance to confidence (lower variance = higher confidence)
    return Math.max(0.1, Math.min(1.0, 1 - (variance / (mean + 1))))
  }
}