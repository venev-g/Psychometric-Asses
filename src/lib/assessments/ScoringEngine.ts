// src/lib/assessments/ScoringEngine.ts
interface ResponseData {
  question_id: string
  response_value: any
  question_category?: string
}

interface ScoringConfig {
  categories: string[]
  scoring_method: 'weighted_sum' | 'forced_choice' | 'multiselect_count'
  normalization: 'percentage' | 'raw' | 'standardized'
}

export class ScoringEngine {
  static calculateScores(
    responses: ResponseData[],
    config: ScoringConfig,
    questions: any[]
  ): { rawScores: any; processedScores: any; recommendations: string[] } {
    
    const rawScores: { [key: string]: number } = {}
    const processedScores: { [key: string]: number } = {}
    
    // Initialize scores for all categories
    config.categories.forEach(category => {
      rawScores[category] = 0
      processedScores[category] = 0
    })

    // Calculate raw scores by category
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.question_id)
      if (!question) return

      const category = question.category
      const weight = question.weight || 1.0
      const value = response.response_value

      if (category && config.categories.includes(category)) {
        switch (config.scoring_method) {
          case 'weighted_sum':
            rawScores[category] += (typeof value === 'number' ? value : 1) * weight
            break
          case 'forced_choice':
            rawScores[category] += weight
            break
          case 'multiselect_count':
            rawScores[category] += Array.isArray(value) ? value.length * weight : weight
            break
        }
      }
    })

    // Calculate processed scores based on normalization
    const totalResponses = responses.length
    const categoryQuestionCounts: { [key: string]: number } = {}
    
    // Count questions per category
    config.categories.forEach(category => {
      categoryQuestionCounts[category] = questions.filter(q => q.category === category).length
    })

    config.categories.forEach(category => {
      const rawScore = rawScores[category]
      const questionCount = categoryQuestionCounts[category] || 1

      switch (config.normalization) {
        case 'percentage':
          // For rating scale (1-5), max possible = questionCount * 5
          const maxPossible = config.scoring_method === 'weighted_sum' ? questionCount * 5 : questionCount
          processedScores[category] = Math.round((rawScore / maxPossible) * 100)
          break
        case 'raw':
          processedScores[category] = rawScore
          break
        case 'standardized':
          // Simple standardization (could be improved with population data)
          processedScores[category] = Math.round(rawScore / questionCount * 10) / 10
          break
      }
    })

    // Generate basic recommendations
    const recommendations = this.generateRecommendations(processedScores, config)

    return {
      rawScores,
      processedScores,
      recommendations
    }
  }

  private static generateRecommendations(
    scores: { [key: string]: number },
    config: ScoringConfig
  ): string[] {
    const recommendations: string[] = []
    
    // Find top categories
    const sortedCategories = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category)

    const topCategory = sortedCategories[0]
    const topScore = scores[topCategory]

    // Generate category-specific recommendations
    switch (topCategory) {
      case 'linguistic':
        recommendations.push('Your linguistic intelligence is strong. Consider careers in writing, teaching, or communication.')
        recommendations.push('Practice explaining complex topics to improve this strength further.')
        break
      case 'logical-mathematical':
        recommendations.push('Your logical-mathematical intelligence excels. Engineering, data science, or research might suit you.')
        recommendations.push('Challenge yourself with puzzles and analytical problems.')
        break
      case 'spatial':
        recommendations.push('Your spatial intelligence is well-developed. Architecture, design, or visual arts could be great fits.')
        recommendations.push('Engage with 3D modeling or drawing to enhance this ability.')
        break
      case 'dominance':
        recommendations.push('You show strong leadership qualities. Consider roles with decision-making responsibility.')
        recommendations.push('Focus on developing emotional intelligence to complement your directive style.')
        break
      case 'influence':
        recommendations.push('You excel at persuasion and motivation. Sales, marketing, or coaching could be ideal.')
        recommendations.push('Practice active listening to enhance your influence even more.')
        break
      case 'visual':
        recommendations.push('You learn best through visual aids. Use diagrams, charts, and images in your studies.')
        recommendations.push('Consider mind mapping and visual note-taking techniques.')
        break
      case 'auditory':
        recommendations.push('You excel with auditory learning. Try podcasts, lectures, and discussion groups.')
        recommendations.push('Read aloud and use verbal repetition to enhance retention.')
        break
      default:
        recommendations.push(`Your strongest area is ${topCategory}. Focus on developing this further.`)
    }

    // Add general improvement suggestions
    const lowestCategory = sortedCategories[sortedCategories.length - 1]
    const lowestScore = scores[lowestCategory]
    
    if (topScore - lowestScore > 30) {
      recommendations.push(`Consider developing your ${lowestCategory} skills for a more balanced profile.`)
    }

    return recommendations
  }
}
