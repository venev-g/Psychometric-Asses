// src/lib/supabase/types.ts
import type { Database } from '@/types/database.types'

// Re-export database types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type UserProfile = Tables<'user_profiles'>
export type TestConfiguration = Tables<'test_configurations'>
export type TestType = Tables<'test_types'>
export type TestSequence = Tables<'test_sequences'>
export type Question = Tables<'questions'>
export type AssessmentSession = Tables<'assessment_sessions'>
export type UserResponse = Tables<'user_responses'>
export type AssessmentResult = Tables<'assessment_results'>

// Insert types
export type UserProfileInsert = TablesInsert<'user_profiles'>
export type TestConfigurationInsert = TablesInsert<'test_configurations'>
export type TestTypeInsert = TablesInsert<'test_types'>
export type TestSequenceInsert = TablesInsert<'test_sequences'>
export type QuestionInsert = TablesInsert<'questions'>
export type AssessmentSessionInsert = TablesInsert<'assessment_sessions'>
export type UserResponseInsert = TablesInsert<'user_responses'>
export type AssessmentResultInsert = TablesInsert<'assessment_results'>

// Update types
export type UserProfileUpdate = TablesUpdate<'user_profiles'>
export type TestConfigurationUpdate = TablesUpdate<'test_configurations'>
export type TestTypeUpdate = TablesUpdate<'test_types'>
export type TestSequenceUpdate = TablesUpdate<'test_sequences'>
export type QuestionUpdate = TablesUpdate<'questions'>
export type AssessmentSessionUpdate = TablesUpdate<'assessment_sessions'>
export type UserResponseUpdate = TablesUpdate<'user_responses'>
export type AssessmentResultUpdate = TablesUpdate<'assessment_results'>

// Enums
export type QuestionType = 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect'
export type SessionStatus = 'started' | 'in_progress' | 'completed' | 'abandoned'
export type UserRole = 'user' | 'admin'

// Joined/computed types
export interface QuestionWithOptions extends Question {
  options: any // The options are stored directly in the questions table
}

export interface TestTypeWithQuestions extends TestType {
  questions: QuestionWithOptions[]
}

export interface AssessmentSessionWithResults extends AssessmentSession {
  assessment_results: AssessmentResult[]
  test_configuration: TestConfiguration
}

export interface UserWithSessions {
  profile: UserProfile
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
export interface UserProfileWithStats extends Tables<'user_profiles'> {
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