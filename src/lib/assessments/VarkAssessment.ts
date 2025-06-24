// src/lib/assessments/VarkAssessment.ts
import { BaseAssessment } from './BaseAssessment'
import type { Question, UserResponse } from '@/types/assessment.types'
import type { VarkScores } from '@/types/assessment.types'

export class VarkAssessment extends BaseAssessment {
  constructor() {
    super('vark')
  }

  calculateScores(responses: UserResponse[], questions: Question[]): VarkScores {
    const scores: VarkScores = {
      visual: 0,
      auditory: 0,
      readingWriting: 0,
      kinesthetic: 0
    }

    const questionMap = new Map(questions.map(q => [q.id, q]))

    for (const response of responses) {
      const question = questionMap.get(response.questionId)
      if (!question) continue

      // VARK typically uses multiselect responses
      if (Array.isArray(response.responseValue)) {
        for (const selectedOption of response.responseValue) {
          const option = question.options?.find(opt => opt.value === selectedOption)
          if (option?.category) {
            const category = this.mapCategoryToVark(option.category)
            if (category && category in scores) {
              scores[category as keyof VarkScores] += question.weight
            }
          }
        }
      } else {
        // Handle single selection
        const option = question.options?.find(opt => opt.value === response.responseValue)
        if (option?.category) {
          const category = this.mapCategoryToVark(option.category)
          if (category && category in scores) {
            scores[category as keyof VarkScores] += question.weight
          }
        }
      }
    }

    return scores
  }

  generateRecommendations(scores: VarkScores): any {
    const sortedStyles = Object.entries(scores)
      .filter(([, score]) => score > 0)
      .sort(([,a], [,b]) => b - a)

    const learningProfile = this.determineLearningProfile(scores)
    const preferredStyles = sortedStyles.slice(0, 2)

    return {
      learningProfile,
      preferredStyles: preferredStyles.map(([style, score]) => ({
        style,
        score,
        description: this.getStyleDescription(style),
        percentage: this.calculatePercentage(score, scores)
      })),
      studyTechniques: this.getStudyTechniques(preferredStyles),
      learningResources: this.getLearningResources(preferredStyles),
      noteInformation: this.getNoteTakingStrategies(preferredStyles),
      examStrategies: this.getExamStrategies(preferredStyles),
      weakerAreas: this.getWeakerAreas(scores)
    }
  }

  validateResponse(question: Question, response: any): boolean {
    if (question.questionType === 'multiselect') {
      return Array.isArray(response) && 
             response.every(r => question.options?.some(option => option.value === r))
    }
    if (question.questionType === 'multiple_choice') {
      return question.options?.some(option => option.value === response) ?? false
    }
    return false
  }

  private mapCategoryToVark(category: string): string {
    const mapping: Record<string, string> = {
      'v': 'visual',
      'visual': 'visual',
      'a': 'auditory',
      'auditory': 'auditory',
      'r': 'readingWriting',
      'reading': 'readingWriting',
      'reading-writing': 'readingWriting',
      'k': 'kinesthetic',
      'kinesthetic': 'kinesthetic'
    }
    return mapping[category.toLowerCase()] || category
  }

  private determineLearningProfile(scores: VarkScores): string {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    if (totalScore === 0) return "Undefined"

    const significantStyles = Object.entries(scores)
      .filter(([, score]) => score > 0)
      .sort(([,a], [,b]) => b - a)

    const highestScore = significantStyles[0][1]
    const dominant = significantStyles.filter(([, score]) => score >= highestScore * 0.8)

    if (dominant.length === 1) {
      return `Strong ${this.capitalizeFirst(dominant[0][0])} learner`
    } else if (dominant.length === 2) {
      return `Bimodal learner (${dominant.map(([style]) => this.capitalizeFirst(style)).join(' & ')})`
    } else if (dominant.length === 3) {
      return `Trimodal learner (${dominant.map(([style]) => this.capitalizeFirst(style)).join(', ')})`
    } else {
      return "Multimodal learner (All styles)"
    }
  }

  private calculatePercentage(score: number, allScores: VarkScores): number {
    const total = Object.values(allScores).reduce((sum, s) => sum + s, 0)
    return total > 0 ? Math.round((score / total) * 100) : 0
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  private getStyleDescription(style: string): string {
    const descriptions: Record<string, string> = {
      visual: "You prefer to see information through charts, graphs, diagrams, and visual aids. You learn best when information is presented visually.",
      auditory: "You prefer to hear information through lectures, discussions, and audio. You learn best through listening and verbal explanations.",
      readingWriting: "You prefer text-based information through reading and writing. You learn best through written words and taking notes.",
      kinesthetic: "You prefer hands-on experiences and learning through doing. You learn best through practical activities and movement."
    }
    return descriptions[style] || ""
  }

  private getStudyTechniques(preferredStyles: [string, number][]): string[] {
    const techniques: Record<string, string[]> = {
      visual: [
        "Use mind maps and concept diagrams",
        "Create colorful charts and graphs",
        "Use highlighting and color coding",
        "Draw pictures and sketches to represent ideas",
        "Use flashcards with visual elements",
        "Watch educational videos and documentaries"
      ],
      auditory: [
        "Read notes and textbooks aloud",
        "Form study groups for discussion",
        "Listen to recorded lectures and podcasts",
        "Explain concepts to others verbally",
        "Use mnemonics and rhymes",
        "Study with background music if helpful"
      ],
      readingWriting: [
        "Take detailed written notes",
        "Read extensively from multiple sources",
        "Write summaries and outlines",
        "Create lists and bullet points",
        "Use textbooks and written materials",
        "Write practice essays and responses"
      ],
      kinesthetic: [
        "Use hands-on activities and experiments",
        "Take frequent study breaks for movement",
        "Use physical objects and manipulatives",
        "Practice with real-world applications",
        "Study while walking or moving",
        "Use role-playing and simulations"
      ]
    }

    const allTechniques: string[] = []
    preferredStyles.forEach(([style]) => {
      allTechniques.push(...(techniques[style] || []))
    })
    
    return [...new Set(allTechniques)].slice(0, 8) // Remove duplicates and limit
  }

  private getLearningResources(preferredStyles: [string, number][]): string[] {
    const resources: Record<string, string[]> = {
      visual: [
        "Infographics and visual summaries",
        "Educational videos and animations",
        "Interactive diagrams and simulations",
        "Photo-rich textbooks and materials",
        "Mind mapping software",
        "Visual learning apps and games"
      ],
      auditory: [
        "Podcasts and audio lectures",
        "Discussion forums and study groups",
        "Audio books and recordings",
        "Verbal explanations and tutorials",
        "Music and audio mnemonics",
        "Voice recording apps for notes"
      ],
      readingWriting: [
        "Traditional textbooks and articles",
        "Online reading materials and blogs",
        "Written assignments and essays",
        "Note-taking apps and tools",
        "Research databases and libraries",
        "Written study guides and summaries"
      ],
      kinesthetic: [
        "Laboratory experiments and practicals",
        "Field trips and real-world experiences",
        "Interactive simulations and games",
        "Building models and prototypes",
        "Physical activity during learning",
        "Hands-on workshops and demonstrations"
      ]
    }

    const allResources: string[] = []
    preferredStyles.forEach(([style]) => {
      allResources.push(...(resources[style] || []))
    })
    
    return [...new Set(allResources)].slice(0, 6)
  }

  private getNoteTakingStrategies(preferredStyles: [string, number][]): string[] {
    const strategies: Record<string, string[]> = {
      visual: [
        "Use diagrams, charts, and visual organizers",
        "Include drawings and sketches in notes",
        "Use different colors for different topics",
        "Create visual hierarchies with indentation",
        "Use symbols and icons to represent ideas"
      ],
      auditory: [
        "Record lectures and discussions",
        "Read notes aloud while reviewing",
        "Discuss notes with study partners",
        "Use verbal summaries and explanations",
        "Create audio recordings of key concepts"
      ],
      readingWriting: [
        "Write detailed, comprehensive notes",
        "Use traditional outline formats",
        "Include quotes and specific details",
        "Rewrite notes in different formats",
        "Create written summaries and reviews"
      ],
      kinesthetic: [
        "Take notes while standing or moving",
        "Use different physical formats (cards, boards)",
        "Include action words and practical examples",
        "Practice writing key concepts repeatedly",
        "Use physical gestures while note-taking"
      ]
    }

    const allStrategies: string[] = []
    preferredStyles.forEach(([style]) => {
      allStrategies.push(...(strategies[style] || []))
    })
    
    return [...new Set(allStrategies)].slice(0, 5)
  }

  private getExamStrategies(preferredStyles: [string, number][]): string[] {
    const strategies: Record<string, string[]> = {
      visual: [
        "Create visual study aids before exams",
        "Use diagrams to answer essay questions",
        "Visualize concepts during the exam",
        "Use space and layout effectively in answers",
        "Draw quick sketches to aid memory"
      ],
      auditory: [
        "Read questions aloud (silently)",
        "Talk through answers mentally",
        "Use auditory memory techniques",
        "Study with background sounds if allowed",
        "Discuss potential exam topics beforehand"
      ],
      readingWriting: [
        "Read all questions carefully before starting",
        "Write detailed, well-organized answers",
        "Use proper spelling and grammar",
        "Include specific examples and details",
        "Review written answers thoroughly"
      ],
      kinesthetic: [
        "Use physical movement during study breaks",
        "Practice writing answers under timed conditions",
        "Use stress balls or fidget tools if allowed",
        "Take short breaks during long exams",
        "Apply knowledge to practical scenarios"
      ]
    }

    const allStrategies: string[] = []
    preferredStyles.forEach(([style]) => {
      allStrategies.push(...(strategies[style] || []))
    })
    
    return [...new Set(allStrategies)].slice(0, 5)
  }

  private getWeakerAreas(scores: VarkScores): any[] {
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => a - b)
    const weakest = sortedScores.slice(0, 2)

    return weakest.map(([style, score]) => ({
      style,
      currentScore: score,
      description: this.getStyleDescription(style),
      developmentSuggestions: this.getDevelopmentSuggestions(style)
    }))
  }

  private getDevelopmentSuggestions(style: string): string[] {
    const suggestions: Record<string, string[]> = {
      visual: [
        "Try creating simple diagrams for complex concepts",
        "Use highlighters and colored pens in notes",
        "Watch educational videos on topics of interest",
        "Practice converting text information to visual formats"
      ],
      auditory: [
        "Join discussion groups or study circles",
        "Try explaining concepts out loud to yourself",
        "Listen to educational podcasts during commutes",
        "Practice verbal presentations and explanations"
      ],
      readingWriting: [
        "Keep a learning journal or diary",
        "Practice writing summaries of verbal information",
        "Read more extensively on subjects of interest",
        "Try different note-taking formats and styles"
      ],
      kinesthetic: [
        "Include more hands-on activities in learning",
        "Take regular breaks for physical movement",
        "Try building or creating things related to your studies",
        "Look for practical applications of theoretical concepts"
      ]
    }
    return suggestions[style] || []
  }
}