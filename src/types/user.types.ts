// src/types/user.types.ts
import type { BaseEntity } from './global.types'

export interface User extends BaseEntity {
  email: string
  fullName?: string
  avatarUrl?: string
  role: UserRole
  isActive: boolean
  lastLoginAt?: Date
  emailVerifiedAt?: Date
  preferences: UserPreferences
}

export type UserRole = 'user' | 'admin' | 'moderator'

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    assessmentReminders: boolean
    weeklyReports: boolean
  }
  privacy: {
    shareResults: boolean
    allowAnalytics: boolean
  }
}

export interface UserProfile {
  id: string
  fullName?: string
  avatarUrl?: string
  role: UserRole
  preferences: UserPreferences
  stats: {
    completedAssessments: number
    totalSessionTime: number
    averageScore: number
    lastAssessmentDate?: Date
  }
}

export interface UserActivity {
  id: string
  userId: string
  type: ActivityType
  description: string
  metadata?: Record<string, any>
  createdAt: Date
}

export type ActivityType = 
  | 'assessment_started'
  | 'assessment_completed'
  | 'assessment_abandoned'
  | 'profile_updated'
  | 'login'
  | 'logout'
  | 'settings_changed'

export interface UserSession {
  id: string
  userId: string
  deviceInfo: {
    userAgent: string
    ipAddress: string
    location?: string
  }
  startedAt: Date
  lastActiveAt: Date
  isActive: boolean
}

export interface AuthContext {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshSession: () => Promise<void>
}