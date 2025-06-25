// src/types/assessment.types.ts
export interface TestConfiguration {
  id: string
  name: string
  description?: string
  isActive: boolean
  maxAttempts?: number
  timeLimitMinutes?: number
  createdBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface TestType {
  id: string
  name: string
  slug: string
  description?: string
  version: string
  isActive: boolean
  scoringAlgorithm: any
  instructions?: string
  estimatedDurationMinutes: number
  createdAt: Date
}

export interface Question {
  id: string
  testTypeId: string
  questionText: string
  questionType: 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect'
  options?: QuestionOption[]
  category?: string
  subcategory?: string
  weight: number
  isActive: boolean
  orderIndex?: number
  createdAt: Date
}

export interface QuestionOption {
  id: string
  text: string
  value: any
  category?: string
}

export interface AssessmentSession {
  id: string
  userId: string
  configurationId: string
  status: 'started' | 'in_progress' | 'completed' | 'abandoned'
  currentTestIndex: number
  totalTests: number
  startedAt: Date
  completedAt?: Date
  metadata: any
}

export interface UserResponse {
  id: string
  sessionId: string
  questionId: string
  responseValue: any
  responseTimeMs?: number
  createdAt: Date
}

export interface AssessmentResult {
  id: string
  sessionId: string
  testTypeId: string
  rawScores: any
  processedScores: any
  recommendations?: any
  percentileRanks?: any
  createdAt: Date
}

// Test-specific score interfaces
export interface DominantIntelligenceScores {
  linguistic: number
  logicalMathematical: number
  spatial: number
  bodilyKinesthetic: number
  musical: number
  interpersonal: number
  intrapersonal: number
  naturalistic: number
}

export interface PersonalityPatternScores {
  dominance: number
  influence: number
  steadiness: number
  conscientiousness: number
}

export interface VarkScores {
  visual: number
  auditory: number
  readingWriting: number
  kinesthetic: number
}

export interface TestResponse {
  questionId: string
  question: string
  response: number | string
  testType: string
  part?: number
  category?: string
}

export interface AssessmentFlowData {
  currentTest: {
    testType: TestType
    questions: Question[]
    currentIndex: number
    totalTests: number
  } | null
  session: AssessmentSession
  responses: Record<string, any>
}