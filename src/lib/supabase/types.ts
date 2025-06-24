// src/lib/supabase/types.ts
import type { Database } from '@/types/database.types'

// Re-export database types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type TestConfiguration = Tables<'test_configurations'>
export type TestType = Tables<'test_types'>
export type Question = Tables<'questions'>
export type QuestionOption = Tables<'question_options'>
export type AssessmentSession = Tables<'assessment_sessions'>
export type UserResponse = Tables<'user_responses'>
export type AssessmentResult = Tables<'assessment_results'>

// Insert types
export type UserInsert = TablesInsert<'users'>
export type TestConfigurationInsert = TablesInsert<'test_configurations'>
export type TestTypeInsert = TablesInsert<'test_types'>
export type QuestionInsert = TablesInsert<'questions'>
export type QuestionOptionInsert = TablesInsert<'question_options'>
export type AssessmentSessionInsert = TablesInsert<'assessment_sessions'>
export type UserResponseInsert = TablesInsert<'user_responses'>
export type AssessmentResultInsert = TablesInsert<'assessment_results'>

// Update types
export type UserUpdate = TablesUpdate<'users'>
export type TestConfigurationUpdate = TablesUpdate<'test_configurations'>
export type TestTypeUpdate = TablesUpdate<'test_types'>
export type QuestionUpdate = TablesUpdate<'questions'>
export type QuestionOptionUpdate = TablesUpdate<'question_options'>
export type AssessmentSessionUpdate = TablesUpdate<'assessment_sessions'>
export type UserResponseUpdate = TablesUpdate<'user_responses'>
export type AssessmentResultUpdate = TablesUpdate<'assessment_results'>

// Enums
export type QuestionType = Database['public']['Enums']['question_type']
export type SessionStatus = Database['public']['Enums']['session_status']
export type UserRole = Database['public']['Enums']['user_role']

// Joined/computed types
export interface QuestionWithOptions extends Question {
  question_options: QuestionOption[]
}

export interface TestTypeWithQuestions extends TestType {
  questions: QuestionWithOptions[]
}

export interface AssessmentSessionWithResults extends AssessmentSession {
  assessment_results: AssessmentResult[]
  test_configuration: TestConfiguration
}

export interface UserWithSessions extends User {
  assessment_sessions: AssessmentSession[]
}

// Response types for API
export interface AssessmentSessionResponse {
  session: AssessmentSession
  currentTest?: {
    testType: TestType
    questions: QuestionWithOptions[]
    currentIndex: number
    totalTests: number
  }
  responses: UserResponse[]
}

export interface AssessmentResultsResponse {
  session: AssessmentSession
  results: AssessmentResult[]
  configuration: TestConfiguration
}

// Filter and sort types
export interface SessionFilters {
  userId?: string
  status?: SessionStatus
  configurationId?: string
  startDate?: string
  endDate?: string
}

export interface ResultFilters {
  userId?: string
  testTypeId?: string
  sessionId?: string
  startDate?: string
  endDate?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// API response wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Profile types
export interface UserProfile extends User {
  total_assessments: number
  completed_assessments: number
  average_score?: number
  last_assessment?: Date
}

// Statistics types
export interface AssessmentStats {
  total_sessions: number
  completed_sessions: number
  active_sessions: number
  average_completion_time: number
  completion_rate: number
  popular_assessments: Array<{
    test_type_id: string
    test_type_name: string
    count: number
  }>
}

export interface UserStats {
  total_users: number
  active_users: number
  new_users_this_month: number
  user_growth_rate: number
}