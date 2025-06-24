// src/lib/assessments/DominantIntelligenceAssessment.ts
import { BaseAssessment } from './BaseAssessment'
import type { Question, UserResponse } from '@/types/assessment.types'
import type { DominantIntelligenceScores } from '@/types/assessment.types'

export class DominantIntelligenceAssessment extends BaseAssessment {
  constructor() {
    super('dominant-intelligence')
  }

  calculateScores(responses: UserResponse[], questions: Question[]): DominantIntelligenceScores {
    const scores: DominantIntelligenceScores = {
      linguistic: 0,
      logicalMathematical: 0,
      spatial: 0,
      bodilyKinesthetic: 0,
      musical: 0,
      interpersonal: 0,
      intrapersonal: 0,
      naturalistic: 0
    }

    const questionMap = new Map(questions.map(q => [q.id, q]))

    for (const response of responses) {
      const question = questionMap.get(response.questionId)
      if (!question?.category) continue

      const category = this.mapCategoryToIntelligence(question.category)
      if (category && category in scores) {
        const value = typeof response.responseValue === 'number' 
          ? response.responseValue 
          : this.extractNumericValue(response.responseValue)
        
        scores[category as keyof DominantIntelligenceScores] += value * question.weight
      }
    }

    return scores
  }

  generateRecommendations(scores: DominantIntelligenceScores): any {
    const sortedIntelligences = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    const dominant = sortedIntelligences[0]
    const secondary = sortedIntelligences.slice(1, 3)

    return {
      dominantIntelligences: sortedIntelligences,
      primaryIntelligence: {
        type: dominant[0],
        score: dominant[1],
        description: this.getIntelligenceDescription(dominant[0])
      },
      secondaryIntelligences: secondary.map(([type, score]) => ({
        type,
        score,
        description: this.getIntelligenceDescription(type)
      })),
      careerSuggestions: this.getCareerSuggestions(dominant[0]),
      learningStrategies: this.getLearningStrategies(sortedIntelligences),
      developmentAreas: this.getDevelopmentAreas(scores)
    }
  }

  validateResponse(question: Question, response: any): boolean {
    if (question.questionType === 'rating_scale') {
      return typeof response === 'number' && response >= 1 && response <= 5
    }
    if (question.questionType === 'multiple_choice') {
      return question.options?.some(option => option.value === response) ?? false
    }
    if (question.questionType === 'yes_no') {
      return typeof response === 'boolean'
    }
    return false
  }

  private mapCategoryToIntelligence(category: string): string {
    const mapping: Record<string, string> = {
      'linguistic': 'linguistic',
      'logical-mathematical': 'logicalMathematical',
      'spatial': 'spatial',
      'bodily-kinesthetic': 'bodilyKinesthetic',
      'musical': 'musical',
      'interpersonal': 'interpersonal',
      'intrapersonal': 'intrapersonal',
      'naturalistic': 'naturalistic'
    }
    return mapping[category] || category
  }

  private extractNumericValue(responseValue: any): number {
    if (typeof responseValue === 'number') return responseValue
    if (typeof responseValue === 'boolean') return responseValue ? 1 : 0
    if (Array.isArray(responseValue)) return responseValue.length
    return 1
  }

  private getIntelligenceDescription(type: string): string {
    const descriptions: Record<string, string> = {
      linguistic: "Strong with words, language, reading, and writing. Enjoys storytelling and verbal communication.",
      logicalMathematical: "Excels at logic, numbers, reasoning, and problem-solving. Thinks in patterns and relationships.",
      spatial: "Strong visual and spatial judgment. Good at visualizing, art, design, and navigation.",
      bodilyKinesthetic: "Learns through movement and doing. Excels at sports, dance, and hands-on activities.",
      musical: "Sensitive to rhythm, pitch, melody, and tone. Learns well through music and sound.",
      interpersonal: "Understands and works well with others. Strong leadership and communication skills.",
      intrapersonal: "Self-aware with strong introspection. Understands own emotions and motivations.",
      naturalistic: "Recognizes and categorizes plants, animals, and natural phenomena. Connects with nature."
    }
    return descriptions[type] || ""
  }

  private getCareerSuggestions(dominantType: string): string[] {
    const careerMap: Record<string, string[]> = {
      linguistic: [
        "Writer/Author", "Journalist", "Teacher/Professor", "Lawyer", 
        "Editor", "Translator", "Librarian", "Speech Therapist"
      ],
      logicalMathematical: [
        "Engineer", "Data Scientist", "Mathematician", "Accountant",
        "Computer Programmer", "Researcher", "Financial Analyst", "Architect"
      ],
      spatial: [
        "Graphic Designer", "Architect", "Pilot", "Photographer",
        "Interior Designer", "Surgeon", "Artist", "Video Game Designer"
      ],
      bodilyKinesthetic: [
        "Athlete", "Physical Therapist", "Dancer", "Surgeon",
        "Craftsperson", "Mechanic", "Actor", "Personal Trainer"
      ],
      musical: [
        "Musician", "Music Teacher", "Sound Engineer", "Music Therapist",
        "Composer", "Audio Producer", "Music Critic", "DJ"
      ],
      interpersonal: [
        "Teacher", "Counselor", "Salesperson", "Manager",
        "Social Worker", "Human Resources", "Politician", "Coach"
      ],
      intrapersonal: [
        "Psychologist", "Writer", "Philosopher", "Researcher",
        "Entrepreneur", "Therapist", "Artist", "Consultant"
      ],
      naturalistic: [
        "Biologist", "Environmental Scientist", "Veterinarian", "Farmer",
        "Park Ranger", "Botanist", "Geologist", "Wildlife Photographer"
      ]
    }
    return careerMap[dominantType] || []
  }

  private getLearningStrategies(topIntelligences: [string, number][]): string[] {
    const strategies: Record<string, string[]> = {
      linguistic: [
        "Read extensively and take detailed notes",
        "Discuss topics with others",
        "Write summaries and essays",
        "Use word games and vocabulary building"
      ],
      logicalMathematical: [
        "Break down complex problems into steps",
        "Use charts, graphs, and diagrams",
        "Look for patterns and relationships",
        "Practice with logical puzzles"
      ],
      spatial: [
        "Use visual aids and mind maps",
        "Draw diagrams and sketches",
        "Use color coding and highlighting",
        "Visualize concepts and processes"
      ],
      bodilyKinesthetic: [
        "Take frequent breaks for movement",
        "Use hands-on activities and experiments",
        "Walk while studying or thinking",
        "Use gestures and role-playing"
      ],
      musical: [
        "Study with background music",
        "Create songs or rhymes to remember facts",
        "Use rhythm and beat for memorization",
        "Listen to audio recordings"
      ],
      interpersonal: [
        "Form study groups",
        "Teach others what you've learned",
        "Engage in discussions and debates",
        "Seek feedback from peers"
      ],
      intrapersonal: [
        "Set personal learning goals",
        "Keep a learning journal",
        "Study in quiet, private spaces",
        "Reflect on your learning process"
      ],
      naturalistic: [
        "Study outdoors when possible",
        "Use real-world examples",
        "Organize information into categories",
        "Connect learning to environmental issues"
      ]
    }

    const allStrategies: string[] = []
    topIntelligences.slice(0, 2).forEach(([type]) => {
      allStrategies.push(...(strategies[type] || []))
    })
    
    return [...new Set(allStrategies)] // Remove duplicates
  }

  private getDevelopmentAreas(scores: DominantIntelligenceScores): any[] {
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => a - b)
    const lowest = sortedScores.slice(0, 2)

    return lowest.map(([type, score]) => ({
      type,
      currentScore: score,
      description: this.getIntelligenceDescription(type),
      improvementSuggestions: this.getImprovementSuggestions(type)
    }))
  }

  private getImprovementSuggestions(type: string): string[] {
    const suggestions: Record<string, string[]> = {
      linguistic: [
        "Read diverse genres of books",
        "Keep a daily journal",
        "Join a book club or writing group",
        "Practice storytelling"
      ],
      logicalMathematical: [
        "Solve puzzles and brain teasers",
        "Learn basic programming",
        "Practice mental math",
        "Study logic and reasoning"
      ],
      spatial: [
        "Practice drawing or sketching",
        "Play visual puzzle games",
        "Learn to read maps and navigate",
        "Try 3D modeling or design"
      ],
      bodilyKinesthetic: [
        "Engage in regular physical exercise",
        "Try new sports or activities",
        "Practice fine motor skills",
        "Learn a musical instrument"
      ],
      musical: [
        "Listen to various music genres",
        "Learn basic music theory",
        "Try singing or humming",
        "Attend concerts and performances"
      ],
      interpersonal: [
        "Practice active listening",
        "Join social groups or clubs",
        "Volunteer for team projects",
        "Develop empathy and communication skills"
      ],
      intrapersonal: [
        "Practice mindfulness and meditation",
        "Keep a reflection journal",
        "Set personal goals and track progress",
        "Explore your values and beliefs"
      ],
      naturalistic: [
        "Spend more time in nature",
        "Learn about local flora and fauna",
        "Start a garden or care for plants",
        "Study environmental science"
      ]
    }
    return suggestions[type] || []
  }
}