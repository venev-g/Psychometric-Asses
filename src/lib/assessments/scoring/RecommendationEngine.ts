// src/lib/assessments/scoring/RecommendationEngine.ts
import type { CalculatedScore, ScoreBreakdown } from './ScoreCalculator'

export interface Recommendation {
  id: string
  type: 'career' | 'learning' | 'development' | 'strength' | 'improvement'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  actionItems: string[]
  resources?: RecommendationResource[]
  timeframe?: string
  difficulty?: 'easy' | 'moderate' | 'challenging'
}

export interface RecommendationResource {
  type: 'article' | 'book' | 'course' | 'video' | 'tool' | 'assessment'
  title: string
  url?: string
  author?: string
  description?: string
  estimatedTime?: string
}

export interface RecommendationContext {
  userProfile?: {
    age?: number
    gender?: string
    education?: string
    experience?: string
    goals?: string[]
  }
  assessmentHistory?: ScoreBreakdown[]
  preferences?: {
    learningStyle?: string
    careerFocus?: string
    timeAvailability?: string
  }
}

export class RecommendationEngine {
  private knowledgeBase: Map<string, any> = new Map()
  private ruleEngine: RecommendationRule[] = []

  constructor() {
    this.initializeKnowledgeBase()
    this.initializeRules()
  }

  generateRecommendations(
    scoreBreakdown: ScoreBreakdown,
    assessmentType: string,
    context?: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    
    // Generate strength-based recommendations
    const strengths = this.identifyStrengths(scoreBreakdown)
    strengths.forEach(strength => {
      recommendations.push(...this.generateStrengthRecommendations(strength, assessmentType, context))
    })

    // Generate development recommendations
    const developmentAreas = this.identifyDevelopmentAreas(scoreBreakdown)
    developmentAreas.forEach(area => {
      recommendations.push(...this.generateDevelopmentRecommendations(area, assessmentType, context))
    })

    // Generate learning recommendations
    recommendations.push(...this.generateLearningRecommendations(scoreBreakdown, assessmentType, context))

    // Generate career recommendations
    recommendations.push(...this.generateCareerRecommendations(scoreBreakdown, assessmentType, context))

    // Apply business rules and filters
    const filteredRecommendations = this.applyBusinessRules(recommendations, context)

    // Prioritize and limit recommendations
    return this.prioritizeRecommendations(filteredRecommendations).slice(0, 12)
  }

  private identifyStrengths(scoreBreakdown: ScoreBreakdown): CalculatedScore[] {
    const scores = Object.values(scoreBreakdown.categoryScores)
    const avgScore = scores.reduce((sum, score) => sum + score.normalizedScore, 0) / scores.length
    
    return scores
      .filter(score => score.normalizedScore >= Math.max(70, avgScore + 15))
      .sort((a, b) => b.normalizedScore - a.normalizedScore)
      .slice(0, 3)
  }

  private identifyDevelopmentAreas(scoreBreakdown: ScoreBreakdown): CalculatedScore[] {
    const scores = Object.values(scoreBreakdown.categoryScores)
    const avgScore = scores.reduce((sum, score) => sum + score.normalizedScore, 0) / scores.length
    
    return scores
      .filter(score => score.normalizedScore <= Math.min(40, avgScore - 15))
      .sort((a, b) => a.normalizedScore - b.normalizedScore)
      .slice(0, 2)
  }

  private generateStrengthRecommendations(
    strength: CalculatedScore,
    assessmentType: string,
    context?: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    const strengthData = this.knowledgeBase.get(`${assessmentType}_${strength.category}`)
    
    if (!strengthData) return recommendations

    // Career recommendations based on strengths
    if (strengthData.careers) {
      recommendations.push({
        id: `career_${strength.category}_${Date.now()}`,
        type: 'career',
        title: `Leverage Your ${this.formatCategoryName(strength.category)} Strength`,
        description: `Your high score in ${this.formatCategoryName(strength.category)} (${strength.normalizedScore}%) suggests strong potential in related career paths.`,
        priority: 'high',
        category: strength.category,
        actionItems: [
          `Explore careers in: ${strengthData.careers.slice(0, 3).join(', ')}`,
          'Network with professionals in these fields',
          'Seek projects that utilize this strength',
          'Consider specialization or advanced training'
        ],
        resources: this.getCareerResources(strengthData.careers),
        timeframe: '3-6 months',
        difficulty: 'moderate'
      })
    }

    // Strength development recommendations
    recommendations.push({
      id: `strength_${strength.category}_${Date.now()}`,
      type: 'strength',
      title: `Further Develop Your ${this.formatCategoryName(strength.category)} Excellence`,
      description: `Continue building on your natural ${this.formatCategoryName(strength.category)} abilities to achieve mastery.`,
      priority: 'medium',
      category: strength.category,
      actionItems: strengthData.advancedDevelopment || [
        'Seek leadership opportunities in this area',
        'Mentor others who want to develop this skill',
        'Take on challenging projects',
        'Pursue advanced certifications'
      ],
      resources: this.getAdvancedResources(strength.category),
      timeframe: '6-12 months',
      difficulty: 'challenging'
    })

    return recommendations
  }

  private generateDevelopmentRecommendations(
    developmentArea: CalculatedScore,
    assessmentType: string,
    context?: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    const categoryData = this.knowledgeBase.get(`${assessmentType}_${developmentArea.category}`)
    
    if (!categoryData) return recommendations

    recommendations.push({
      id: `development_${developmentArea.category}_${Date.now()}`,
      type: 'development',
      title: `Develop Your ${this.formatCategoryName(developmentArea.category)} Skills`,
      description: `Your score in ${this.formatCategoryName(developmentArea.category)} (${developmentArea.normalizedScore}%) indicates an opportunity for growth.`,
      priority: 'high',
      category: developmentArea.category,
      actionItems: categoryData.developmentActions || [
        'Start with basic skill-building exercises',
        'Practice regularly in low-stakes situations',
        'Seek feedback from others',
        'Consider taking a course or workshop'
      ],
      resources: this.getDevelopmentResources(developmentArea.category),
      timeframe: '2-4 months',
      difficulty: 'easy'
    })

    return recommendations
  }

  private generateLearningRecommendations(
    scoreBreakdown: ScoreBreakdown,
    assessmentType: string,
    context?: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    
    if (assessmentType === 'vark') {
      const topLearningStyles = Object.values(scoreBreakdown.categoryScores)
        .sort((a, b) => b.normalizedScore - a.normalizedScore)
        .slice(0, 2)

      topLearningStyles.forEach((style, index) => {
        const styleData = this.knowledgeBase.get(`vark_${style.category}`)
        if (styleData) {
          recommendations.push({
            id: `learning_${style.category}_${Date.now()}`,
            type: 'learning',
            title: `Optimize Your ${this.formatCategoryName(style.category)} Learning`,
            description: `Your ${this.formatCategoryName(style.category)} preference (${style.normalizedScore}%) suggests specific learning strategies will be most effective.`,
            priority: index === 0 ? 'high' : 'medium',
            category: style.category,
            actionItems: styleData.learningStrategies || [],
            resources: this.getLearningResources(style.category),
            timeframe: 'Immediate',
            difficulty: 'easy'
          })
        }
      })
    }

    return recommendations
  }

  private generateCareerRecommendations(
    scoreBreakdown: ScoreBreakdown,
    assessmentType: string,
    context?: RecommendationContext
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    
    if (assessmentType === 'dominant-intelligence') {
      const profile = this.createIntelligenceProfile(scoreBreakdown)
      const careerMatches = this.findCareerMatches(profile)

      if (careerMatches.length > 0) {
        recommendations.push({
          id: `career_match_${Date.now()}`,
          type: 'career',
          title: 'Careers Aligned with Your Intelligence Profile',
          description: `Based on your intelligence profile, these careers may be particularly fulfilling.`,
          priority: 'high',
          category: 'general',
          actionItems: [
            `Research: ${careerMatches.slice(0, 3).join(', ')}`,
            'Conduct informational interviews',
            'Shadow professionals in these fields',
            'Assess required qualifications and skills'
          ],
          resources: this.getCareerExplorationResources(),
          timeframe: '1-3 months',
          difficulty: 'moderate'
        })
      }
    }

    return recommendations
  }

  private createIntelligenceProfile(scoreBreakdown: ScoreBreakdown): Record<string, number> {
    const profile: Record<string, number> = {}
    Object.entries(scoreBreakdown.categoryScores).forEach(([category, score]) => {
      profile[category] = score.normalizedScore
    })
    return profile
  }

  private findCareerMatches(profile: Record<string, number>): string[] {
    const careerDatabase = this.knowledgeBase.get('career_intelligence_mapping')
    if (!careerDatabase) return []

    const matches: Array<{ career: string, score: number }> = []
    
    Object.entries(careerDatabase).forEach(([career, requirements]: [string, any]) => {
      let matchScore = 0
      let totalWeight = 0
      
      Object.entries(requirements.intelligences).forEach(([intelligence, weight]: [string, any]) => {
        if (profile[intelligence]) {
          matchScore += profile[intelligence] * weight
          totalWeight += weight
        }
      })
      
      if (totalWeight > 0) {
        matches.push({
          career,
          score: matchScore / totalWeight
        })
      }
    })

    return matches
      .filter(match => match.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(match => match.career)
  }

  private applyBusinessRules(
    recommendations: Recommendation[],
    context?: RecommendationContext
  ): Recommendation[] {
    return recommendations.filter(rec => {
      // Apply context-based filtering
      if (context?.preferences?.timeAvailability === 'limited' && rec.difficulty === 'challenging') {
        return false
      }
      
      if (context?.preferences?.careerFocus && rec.type === 'career') {
        return rec.description.toLowerCase().includes(context.preferences.careerFocus.toLowerCase())
      }
      
      return true
    })
  }

  private prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    
    return recommendations.sort((a, b) => {
      // Primary sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Secondary sort by type (career and development first)
      const typeOrder = { career: 4, development: 3, learning: 2, strength: 1, improvement: 0 }
      return (typeOrder[b.type] || 0) - (typeOrder[a.type] || 0)
    })
  }

  private formatCategoryName(category: string): string {
    return category
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private getCareerResources(careers: string[]): RecommendationResource[] {
    return [
      {
        type: 'tool',
        title: 'O*NET Interest Profiler',
        url: 'https://www.mynextmove.org/explore/ip',
        description: 'Explore careers based on your interests',
        estimatedTime: '15 minutes'
      },
      {
        type: 'article',
        title: 'Career Exploration Guide',
        description: 'Comprehensive guide to researching careers',
        estimatedTime: '30 minutes'
      }
    ]
  }

  private getAdvancedResources(category: string): RecommendationResource[] {
    const resources: Record<string, RecommendationResource[]> = {
      linguistic: [
        {
          type: 'book',
          title: 'The Elements of Style',
          author: 'Strunk & White',
          description: 'Classic guide to writing and communication'
        },
        {
          type: 'course',
          title: 'Advanced Writing Techniques',
          description: 'Online course for professional writing skills',
          estimatedTime: '6 weeks'
        }
      ],
      // Add more category-specific resources...
    }
    
    return resources[category] || []
  }

  private getDevelopmentResources(category: string): RecommendationResource[] {
    const resources: Record<string, RecommendationResource[]> = {
      logical-mathematical: [
        {
          type: 'tool',
          title: 'Khan Academy Math',
          url: 'https://www.khanacademy.org/math',
          description: 'Free math courses from basic to advanced',
          estimatedTime: 'Self-paced'
        },
        {
          type: 'book',
          title: 'How to Solve It',
          author: 'George Polya',
          description: 'Classic book on mathematical problem solving'
        }
      ],
      // Add more category-specific resources...
    }
    
    return resources[category] || []
  }

  private getLearningResources(category: string): RecommendationResource[] {
    const resources: Record<string, RecommendationResource[]> = {
      visual: [
        {
          type: 'tool',
          title: 'MindMeister',
          url: 'https://www.mindmeister.com',
          description: 'Online mind mapping tool',
          estimatedTime: 'Ongoing'
        }
      ],
      auditory: [
        {
          type: 'tool',
          title: 'Audible',
          url: 'https://www.audible.com',
          description: 'Audiobook platform for learning',
          estimatedTime: 'Ongoing'
        }
      ],
      // Add more category-specific resources...
    }
    
    return resources[category] || []
  }

  private getCareerExplorationResources(): RecommendationResource[] {
    return [
      {
        type: 'assessment',
        title: 'Career Values Card Sort',
        description: 'Identify your core work values',
        estimatedTime: '20 minutes'
      },
      {
        type: 'tool',
        title: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning',
        description: 'Professional development courses',
        estimatedTime: 'Ongoing'
      }
    ]
  }

  private initializeKnowledgeBase(): void {
    // Initialize assessment-specific data
    this.initializeDominantIntelligenceData()
    this.initializeVarkData()
    this.initializePersonalityData()
    this.initializeCareerMappings()
  }

  private initializeDominantIntelligenceData(): void {
    this.knowledgeBase.set('dominant-intelligence_linguistic', {
      careers: ['Writer', 'Journalist', 'Teacher', 'Lawyer', 'Editor', 'Translator'],
      advancedDevelopment: [
        'Write for publication in your field',
        'Develop a professional blog or newsletter',
        'Speak at conferences or events',
        'Mentor others in communication skills'
      ],
      developmentActions: [
        'Read diverse literature daily',
        'Practice writing in different formats',
        'Join a debate or toastmasters club',
        'Take a creative writing course'
      ]
    })

    // Add more intelligence types...
  }

  private initializeVarkData(): void {
    this.knowledgeBase.set('vark_visual', {
      learningStrategies: [
        'Use mind maps and concept diagrams',
        'Create colorful charts and graphs',
        'Use highlighting and color coding',
        'Draw pictures and sketches to represent ideas'
      ]
    })

    // Add more VARK styles...
  }

  private initializePersonalityData(): void {
    // Initialize DISC and other personality assessment data
  }

  private initializeCareerMappings(): void {
    this.knowledgeBase.set('career_intelligence_mapping', {
      'Software Engineer': {
        intelligences: {
          'logical-mathematical': 0.8,
          'spatial': 0.6,
          'linguistic': 0.4
        }
      },
      'Graphic Designer': {
        intelligences: {
          'spatial': 0.9,
          'artistic': 0.8,
          'interpersonal': 0.3
        }
      }
      // Add more career mappings...
    })
  }

  private initializeRules(): void {
    // Initialize business rules for recommendations
    this.ruleEngine = [
      {
        condition: (scores: ScoreBreakdown) => scores.metadata.completionRate < 80,
        action: 'recommend_completion',
        message: 'Complete more questions for better recommendations'
      }
      // Add more rules...
    ]
  }
}

interface RecommendationRule {
  condition: (scores: ScoreBreakdown, context?: RecommendationContext) => boolean
  action: string
  message: string
}