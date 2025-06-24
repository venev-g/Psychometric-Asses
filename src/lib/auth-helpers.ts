// src/lib/auth-helpers.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export const supabase = createClientComponentClient<Database>()

export interface AuthUser extends User {
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName?: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordUpdateData {
  password: string
  newPassword: string
}

export class AuthService {
  static async signIn({ email, password }: SignInCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  static async signUp({ email, password, fullName }: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  }

  static async resetPassword({ email }: PasswordResetData) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  static async updatePassword({ newPassword }: { newPassword: string }) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  static async updateProfile(updates: {
    fullName?: string
    avatarUrl?: string
  }) {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl
      }
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error(error.message)
    }

    return session
  }

  static async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }

    return user
  }

  static async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  static async verifyOtp(email: string, token: string, type: 'signup' | 'recovery' = 'signup') {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  static async resendVerification(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}

// Helper functions for role-based access control
export function hasRole(user: AuthUser | null, role: string): boolean {
  if (!user) return false
  return user.user_metadata?.role === role || user.app_metadata?.role === role
}

export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin')
}

export function isModerator(user: AuthUser | null): boolean {
  return hasRole(user, 'moderator') || isAdmin(user)
}

export function canAccessAdminPanel(user: AuthUser | null): boolean {
  return isAdmin(user) || isModerator(user)
}

// Helper functions for user profile management
export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return 'Guest'
  return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
}

export function getUserAvatarUrl(user: AuthUser | null): string | null {
  if (!user) return null
  return user.user_metadata?.avatar_url || null
}

export function getUserInitials(user: AuthUser | null): string {
  const displayName = getUserDisplayName(user)
  if (displayName === 'Guest' || displayName === 'User') return '??'
  
  const parts = displayName.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return displayName.slice(0, 2).toUpperCase()
}

// Session validation helpers
export function isSessionValid(session: any): boolean {
  if (!session) return false
  
  const now = Date.now() / 1000
  return session.expires_at > now
}

export function getSessionTimeRemaining(session: any): number {
  if (!session) return 0
  
  const now = Date.now() / 1000
  return Math.max(0, session.expires_at - now)
}

export function shouldRefreshSession(session: any): boolean {
  const timeRemaining = getSessionTimeRemaining(session)
  // Refresh if less than 5 minutes remaining
  return timeRemaining < 300
}