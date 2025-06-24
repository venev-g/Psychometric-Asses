// src/lib/assessments/PersonalityPatternAssessment.ts
import { BaseAssessment } from './BaseAssessment'
import type { Question, UserResponse } from '@/types/assessment.types'
import type { PersonalityPatternScores } from '@/types/assessment.types'

export class PersonalityPatternAssessment extends BaseAssessment {
  constructor() {
    super('personality-pattern')
  }

  calculateScores(responses: UserResponse[], questions: Question[]): PersonalityPatternScores {
    const scores: PersonalityPatternScores = {
      dominance: 0,
      influence: 0,
      steadiness: 0,
      conscientiousness: 0
    }

    const questionMap = new Map(questions.map(q => [q.id, q]))

    for (const response of responses) {
      const question = questionMap.get(response.questionId)
      if (!question?.category) continue

      const category = this.mapCategoryToDISC(question.category)
      if (category && category in scores) {
        const value = this.extractNumericValue(response.responseValue)
        scores[category as keyof PersonalityPatternScores] += value * question.weight
      }
    }

    return scores
  }

  generateRecommendations(scores: PersonalityPatternScores): any {
    const sortedStyles = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)

    const primaryStyle = sortedStyles[0]
    const styleProfile = this.determineStyleProfile(scores)

    return {
      primaryStyle: {
        type: primaryStyle[0],
        score: primaryStyle[1],
        description: this.getStyleDescription(primaryStyle[0])
      },
      styleProfile,
      workingStyleTips: this.getWorkingStyleTips(primaryStyle[0]),
      communicationPreferences: this.getCommunicationPreferences(primaryStyle[0]),
      leadershipStyle: this.getLeadershipStyle(primaryStyle[0]),
      stressManagement: this.getStressManagement(primaryStyle[0]),
      teamRole: this.getIdealTeamRole(primaryStyle[0]),
      developmentAreas: this.getDevelopmentAreas(scores)
    }
  }

  validateResponse(question: Question, response: any): boolean {
    if (question.questionType === 'rating_scale') {
      return typeof response === 'number' && response >= 1 && response <= 4
    }
    if (question.questionType === 'multiple_choice') {
      return question.options?.some(option => option.value === response) ?? false
    }
    return false
  }

  private mapCategoryToDISC(category: string): string {
    const mapping: Record<string, string> = {
      'd': 'dominance',
      'dominance': 'dominance',
      'i': 'influence',
      'influence': 'influence',
      's': 'steadiness',
      'steadiness': 'steadiness',
      'c': 'conscientiousness',
      'conscientiousness': 'conscientiousness'
    }
    return mapping[category.toLowerCase()] || category
  }

  private extractNumericValue(responseValue: any): number {
    if (typeof responseValue === 'number') return responseValue
    if (typeof responseValue === 'string') {
      const parsed = parseInt(responseValue)
      return isNaN(parsed) ? 1 : parsed
    }
    return 1
  }

  private determineStyleProfile(scores: PersonalityPatternScores): string {
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a)
    const highest = sortedScores[0][1]
    const significantStyles = sortedScores.filter(([,score]) => score >= highest * 0.8)

    if (significantStyles.length === 1) {
      return this.getSingleStyleProfile(sortedScores[0][0])
    } else {
      return this.getCombinedStyleProfile(significantStyles.map(([style]) => style))
    }
  }

  private getSingleStyleProfile(style: string): string {
    const profiles: Record<string, string> = {
      dominance: "High D - Direct, Results-oriented, Decisive",
      influence: "High I - Inspiring, Enthusiastic, People-focused",
      steadiness: "High S - Steady, Supportive, Patient",
      conscientiousness: "High C - Careful, Analytical, Quality-focused"
    }
    return profiles[style] || style
  }

  private getCombinedStyleProfile(styles: string[]): string {
    const combinations: Record<string, string> = {
      "dominance,influence": "DI - Driver/Influencer - Direct and persuasive leader",
      "dominance,conscientiousness": "DC - Driver/Careful - Results-focused perfectionist",
      "dominance,steadiness": "DS - Driver/Steady - Direct but supportive leader",
      "influence,steadiness": "IS - Influencer/Steady - People-focused team player",
      "influence,conscientiousness": "IC - Influencer/Careful - Persuasive but detail-oriented",
      "steadiness,conscientiousness": "SC - Steady/Careful - Reliable and methodical"
    }
    
    const key = styles.sort().join(',')
    return combinations[key] || `Multi-style: ${styles.join(', ')}`
  }

  private getStyleDescription(style: string): string {
    const descriptions: Record<string, string> = {
      dominance: "You are direct, decisive, and results-oriented. You like to take charge, make quick decisions, and focus on the bottom line. You prefer autonomy and dislike micromanagement.",
      influence: "You are enthusiastic, optimistic, and people-oriented. You enjoy interacting with others, building relationships, and inspiring teams. You prefer collaborative environments.",
      steadiness: "You are patient, reliable, and supportive. You value stability, prefer working in teams, and like to help others. You work well in consistent, harmonious environments.",
      conscientiousness: "You are analytical, careful, and quality-focused. You prefer accuracy, systematic approaches, and well-defined processes. You excel at detailed, technical work."
    }
    return descriptions[style] || ""
  }

  private getWorkingStyleTips(style: string): string[] {
    const tips: Record<string, string[]> = {
      dominance: [
        "Set clear, challenging goals with specific deadlines",
        "Focus on results and outcomes rather than processes",
        "Minimize meetings and keep them brief and purposeful",
        "Provide autonomy and avoid micromanagement",
        "Offer opportunities for leadership and control"
      ],
      influence: [
        "Create opportunities for social interaction and collaboration",
        "Provide public recognition and positive feedback",
        "Allow time for discussion and brainstorming",
        "Focus on the people impact of decisions",
        "Keep work environment energetic and optimistic"
      ],
      steadiness: [
        "Provide clear expectations and consistent routines",
        "Allow adequate time for planning and preparation",
        "Offer support and reassurance during changes",
        "Focus on team harmony and cooperation",
        "Recognize contributions to team success"
      ],
      conscientiousness: [
        "Provide detailed information and documentation",
        "Allow time for thorough analysis and planning",
        "Set clear quality standards and expectations",
        "Minimize interruptions and distractions",
        "Recognize accuracy and attention to detail"
      ]
    }
    return tips[style] || []
  }

  private getCommunicationPreferences(style: string): string[] {
    const preferences: Record<string, string[]> = {
      dominance: [
        "Be direct and concise",
        "Focus on results and bottom line",
        "Avoid small talk",
        "Present options and recommendations",
        "Be confident and assertive"
      ],
      influence: [
        "Be enthusiastic and energetic",
        "Allow time for social interaction",
        "Use stories and examples",
        "Focus on people and relationships",
        "Provide verbal appreciation"
      ],
      steadiness: [
        "Be patient and supportive",
        "Provide reassurance and security",
        "Listen actively and empathetically",
        "Avoid pressure and confrontation",
        "Show appreciation for loyalty"
      ],
      conscientiousness: [
        "Provide facts and detailed information",
        "Be precise and accurate",
        "Allow time for questions and analysis",
        "Use logical, systematic approaches",
        "Respect need for preparation time"
      ]
    }
    return preferences[style] || []
  }

  private getLeadershipStyle(style: string): string {
    const styles: Record<string, string> = {
      dominance: "Autocratic Leader - Makes quick decisions, takes charge, and drives results. Effective in crisis situations and when clear direction is needed.",
      influence: "Democratic Leader - Builds consensus, motivates teams, and creates positive environments. Effective when team buy-in and enthusiasm are important.",
      steadiness: "Servant Leader - Supports team members, facilitates collaboration, and maintains stability. Effective in building long-term team relationships.",
      conscientiousness: "Expert Leader - Leads through knowledge and expertise, ensures quality standards, and maintains systematic approaches. Effective in technical and quality-critical situations."
    }
    return styles[style] || ""
  }

  private getStressManagement(style: string): string[] {
    const management: Record<string, string[]> = {
      dominance: [
        "Maintain control over important decisions",
        "Focus on solutions rather than problems",
        "Take on challenging projects",
        "Avoid being micromanaged",
        "Set and achieve ambitious goals"
      ],
      influence: [
        "Maintain social connections and relationships",
        "Seek positive feedback and recognition",
        "Express feelings and concerns openly",
        "Engage in team activities and collaboration",
        "Focus on optimistic outcomes"
      ],
      steadiness: [
        "Maintain stable routines and environments",
        "Seek support from trusted colleagues",
        "Avoid sudden changes when possible",
        "Focus on helping others",
        "Take time for personal relationships"
      ],
      conscientiousness: [
        "Maintain high standards and quality",
        "Have adequate time for planning",
        "Access to detailed information",
        "Work in organized environments",
        "Focus on accuracy and precision"
      ]
    }
    return management[style] || []
  }

  private getIdealTeamRole(style: string): string {
    const roles: Record<string, string> = {
      dominance: "Team Leader/Decision Maker - Takes charge of projects, makes tough decisions, and drives team toward goals.",
      influence: "Team Motivator/Communicator - Builds team morale, facilitates communication, and represents the team externally.",
      steadiness: "Team Supporter/Facilitator - Provides stability, supports team members, and ensures everyone is heard and included.",
      conscientiousness: "Team Analyst/Quality Controller - Ensures accuracy, maintains standards, and provides detailed analysis."
    }
    return roles[style] || ""
  }

  private getDevelopmentAreas(scores: PersonalityPatternScores): any[] {
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => a - b)
    const lowest = sortedScores.slice(0, 2)

    return lowest.map(([style, score]) => ({
      style,
      currentScore: score,
      description: this.getStyleDescription(style),
      developmentSuggestions: this.getDevelopmentSuggestions(style)
    }))
  }

  private getDevelopmentSuggestions(style: string): string[] {
    const suggestions: Record<string, string[]> = {
      dominance: [
        "Practice assertiveness training",
        "Take on leadership roles in projects",
        "Set challenging personal goals",
        "Practice making quick decisions",
        "Develop delegation skills"
      ],
      influence: [
        "Join social groups or networking events",
        "Practice public speaking",
        "Develop presentation skills",
        "Work on team collaboration projects",
        "Practice giving positive feedback"
      ],
      steadiness: [
        "Practice active listening skills",
        "Volunteer for supportive roles",
        "Develop conflict resolution skills",
        "Practice patience and empathy",
        "Build long-term relationships"
      ],
      conscientiousness: [
        "Develop analytical and research skills",
        "Practice attention to detail",
        "Learn quality control methods",
        "Develop systematic thinking",
        "Practice careful planning"
      ]
    }
    return suggestions[style] || []
  }
}