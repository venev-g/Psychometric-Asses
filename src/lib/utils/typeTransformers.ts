import type { Tables } from '@/types/database.types'
import type { TestType, Question, TestConfiguration, AssessmentSession, UserResponse } from '@/types/assessment.types'

// Transform database TestType to component TestType
export function transformTestType(dbTestType: Tables<'test_types'>): TestType {
  return {
    id: dbTestType.id,
    name: dbTestType.name,
    slug: dbTestType.slug,
    description: dbTestType.description || undefined,
    version: dbTestType.version || '1.0',
    isActive: dbTestType.is_active || false,
    scoringAlgorithm: dbTestType.scoring_algorithm || {},
    instructions: dbTestType.instructions || undefined,
    estimatedDurationMinutes: dbTestType.estimated_duration_minutes || 15,
    createdAt: dbTestType.created_at ? new Date(dbTestType.created_at) : new Date()
  }
}

// Transform database Question to component Question
export function transformQuestion(dbQuestion: Tables<'questions'>): Question {
  return {
    id: dbQuestion.id,
    testTypeId: dbQuestion.test_type_id || '',
    questionText: dbQuestion.question_text,
    questionType: dbQuestion.question_type as 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect',
    options: dbQuestion.options as any || [],
    category: dbQuestion.category || undefined,
    subcategory: dbQuestion.subcategory || undefined,
    weight: dbQuestion.weight || 1.0,
    isActive: dbQuestion.is_active || false,
    orderIndex: dbQuestion.order_index || undefined,
    createdAt: dbQuestion.created_at ? new Date(dbQuestion.created_at) : new Date()
  }
}

// Transform database TestConfiguration to component TestConfiguration
export function transformTestConfiguration(dbConfig: Tables<'test_configurations'>): TestConfiguration {
  return {
    id: dbConfig.id,
    name: dbConfig.name,
    description: dbConfig.description || undefined,
    isActive: dbConfig.is_active || false,
    maxAttempts: dbConfig.max_attempts || undefined,
    timeLimitMinutes: dbConfig.time_limit_minutes || undefined,
    createdBy: dbConfig.created_by || undefined,
    createdAt: dbConfig.created_at ? new Date(dbConfig.created_at) : new Date(),
    updatedAt: dbConfig.updated_at ? new Date(dbConfig.updated_at) : new Date()
  }
}

// Transform database AssessmentSession to component AssessmentSession
export function transformAssessmentSession(dbSession: Tables<'assessment_sessions'>): AssessmentSession {
  return {
    id: dbSession.id,
    userId: dbSession.user_id || '',
    configurationId: dbSession.configuration_id || '',
    status: (dbSession.status as 'started' | 'in_progress' | 'completed' | 'abandoned') || 'started',
    currentTestIndex: dbSession.current_test_index || 0,
    totalTests: dbSession.total_tests || 0,
    startedAt: dbSession.started_at ? new Date(dbSession.started_at) : new Date(),
    completedAt: dbSession.completed_at ? new Date(dbSession.completed_at) : undefined,
    metadata: dbSession.metadata || {}
  }
}

// Transform database UserResponse to component UserResponse
export function transformUserResponse(dbResponse: Tables<'user_responses'>): UserResponse {
  return {
    id: dbResponse.id,
    sessionId: dbResponse.session_id || '',
    questionId: dbResponse.question_id || '',
    responseValue: dbResponse.response_value,
    responseTimeMs: dbResponse.response_time_ms || undefined,
    createdAt: dbResponse.created_at ? new Date(dbResponse.created_at) : new Date()
  }
}

// Transform component TestType to database TestType (for inserts/updates)
export function transformTestTypeToDb(testType: Partial<TestType>): Partial<Tables<'test_types'>> {
  return {
    id: testType.id,
    name: testType.name,
    slug: testType.slug,
    description: testType.description || null,
    version: testType.version || null,
    is_active: testType.isActive,
    scoring_algorithm: testType.scoringAlgorithm || null,
    instructions: testType.instructions || null,
    estimated_duration_minutes: testType.estimatedDurationMinutes || null,
    created_at: testType.createdAt?.toISOString() || null
  }
}

// Transform component Question to database Question (for inserts/updates)
export function transformQuestionToDb(question: Partial<Question>): Partial<Tables<'questions'>> {
  return {
    id: question.id,
    test_type_id: question.testTypeId || null,
    question_text: question.questionText,
    question_type: question.questionType,
    options: question.options as any || null,
    category: question.category || null,
    subcategory: question.subcategory || null,
    weight: question.weight || null,
    is_active: question.isActive,
    order_index: question.orderIndex || null,
    created_at: question.createdAt?.toISOString() || null
  }
}

// Transform component TestConfiguration to database TestConfiguration (for inserts/updates)
export function transformTestConfigurationToDb(config: Partial<TestConfiguration>): Partial<Tables<'test_configurations'>> {
  return {
    id: config.id,
    name: config.name,
    description: config.description || null,
    is_active: config.isActive,
    max_attempts: config.maxAttempts || null,
    time_limit_minutes: config.timeLimitMinutes || null,
    created_by: config.createdBy || null,
    created_at: config.createdAt?.toISOString() || null,
    updated_at: config.updatedAt?.toISOString() || null
  }
}

// Transform component AssessmentSession to database AssessmentSession (for inserts/updates)
export function transformAssessmentSessionToDb(session: Partial<AssessmentSession>): Partial<Tables<'assessment_sessions'>> {
  return {
    id: session.id,
    user_id: session.userId || null,
    configuration_id: session.configurationId || null,
    status: session.status || null,
    current_test_index: session.currentTestIndex || null,
    total_tests: session.totalTests || null,
    started_at: session.startedAt?.toISOString() || null,
    completed_at: session.completedAt?.toISOString() || null,
    metadata: session.metadata || null
  }
}

// Transform component UserResponse to database UserResponse (for inserts/updates)
export function transformUserResponseToDb(response: Partial<UserResponse>): Partial<Tables<'user_responses'>> {
  return {
    id: response.id,
    session_id: response.sessionId || null,
    question_id: response.questionId || null,
    response_value: response.responseValue,
    response_time_ms: response.responseTimeMs || null,
    created_at: response.createdAt?.toISOString() || null
  }
} 