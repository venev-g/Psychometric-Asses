// src/types/global.types.ts
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId?: string
  }
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
  lastUpdated?: Date
}

export interface PerformanceMetrics {
  startTime: number
  endTime?: number
  duration?: number
  memoryUsage?: number
}

export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: string
  order: SortOrder
}

export interface FilterConfig {
  field: string
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between'
  value: any
}

export interface SearchConfig {
  query: string
  fields?: string[]
  fuzzy?: boolean
}

export type ThemeMode = 'light' | 'dark' | 'system'

export interface UserPreferences {
  theme: ThemeMode
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    assessmentReminders: boolean
  }
}