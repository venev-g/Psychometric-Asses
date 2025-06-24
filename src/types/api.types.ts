// src/types/api.types.ts
import type { ApiResponse, PaginationParams, SortConfig, FilterConfig } from './global.types'

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  statusCode?: number
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
  timeout?: number
  retries?: number
}

export interface ListParams extends PaginationParams {
  search?: string
  sort?: SortConfig[]
  filters?: FilterConfig[]
  include?: string[]
}

// Assessment API Types
export interface CreateAssessmentSessionRequest {
  configurationId: string
  metadata?: Record<string, any>
}

export interface SubmitResponseRequest {
  sessionId: string
  questionId: string
  responseValue: any
  responseTimeMs?: number
}

export interface CompleteAssessmentRequest {
  sessionId: string
  completedAt?: string
}

export interface GetAssessmentResultsParams {
  sessionId: string
  includeRecommendations?: boolean
  includePercentiles?: boolean
}

// Configuration API Types
export interface CreateConfigurationRequest {
  name: string
  description?: string
  testTypeIds: string[]
  maxAttempts?: number
  timeLimitMinutes?: number
  isActive?: boolean
}

export interface UpdateConfigurationRequest {
  id: string
  name?: string
  description?: string
  testTypeIds?: string[]
  maxAttempts?: number
  timeLimitMinutes?: number
  isActive?: boolean
}

// User API Types
export interface UpdateUserProfileRequest {
  fullName?: string
  avatarUrl?: string
  preferences?: Record<string, any>
}

export interface UserSessionResponse {
  user: {
    id: string
    email: string
    fullName?: string
    role: 'user' | 'admin'
    avatarUrl?: string
  }
  session: {
    accessToken: string
    refreshToken: string
    expiresAt: string
  }
}

// Analytics API Types
export interface AnalyticsQuery {
  metric: string
  timeRange: {
    start: string
    end: string
  }
  groupBy?: string
  filters?: FilterConfig[]
}

export interface AnalyticsResponse {
  metric: string
  data: Array<{
    timestamp: string
    value: number
    metadata?: Record<string, any>
  }>
  summary: {
    total: number
    average: number
    min: number
    max: number
  }
}

// Report API Types
export interface GenerateReportRequest {
  type: 'assessment' | 'user' | 'configuration' | 'analytics'
  parameters: Record<string, any>
  format: 'pdf' | 'csv' | 'json'
  includeCharts?: boolean
}

export interface ReportStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  downloadUrl?: string
  error?: string
  createdAt: string
  completedAt?: string
}