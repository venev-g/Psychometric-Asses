'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

interface AuthUser extends User {
  user_metadata: {
    full_name?: string
    avatar_url?: string
    role?: string
  } & Record<string, any>
  app_metadata: {
    role?: string
  } & Record<string, any>
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshSession: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user as AuthUser ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user as AuthUser ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
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
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          avatar_url: data.avatarUrl
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      // Refresh user data
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user as AuthUser)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      throw error
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        throw new Error(error.message)
      }

      setSession(data.session)
      setUser(data.session?.user as AuthUser || null)
      return data
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    refreshSession
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Additional auth hooks
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  return { isAuthenticated, loading }
}

export function useRequireRole(requiredRole: string) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      const userRole = user.user_metadata?.role || user.app_metadata?.role
      if (userRole !== requiredRole) {
        router.push('/unauthorized')
      }
    }
  }, [user, loading, requiredRole, router])

  return { user, loading }
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