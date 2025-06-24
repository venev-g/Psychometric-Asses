'use client'

// src/lib/hooks/useAuth.ts
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { Session } from '@supabase/auth-helpers-nextjs'
import { AuthService, type AuthUser } from '@/lib/auth-helpers'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await AuthService.getSession()
        setSession(session)
        setUser(session?.user as AuthUser || null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user as AuthUser || null)
        setIsLoading(false)

        if (event === 'SIGNED_IN') {
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await AuthService.signIn({ email, password })
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true)
    try {
      await AuthService.signUp({ email, password, fullName })
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await AuthService.signOut()
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string }) => {
    try {
      await AuthService.updateProfile(data)
      // Refresh user data
      const updatedUser = await AuthService.getUser()
      setUser(updatedUser as AuthUser)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword({ email })
    } catch (error) {
      throw error
    }
  }

  const refreshSession = async () => {
    try {
      const { session } = await AuthService.refreshSession()
      setSession(session)
      setUser(session?.user as AuthUser || null)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    refreshSession
  }

  return React.createElement(AuthContext.Provider, { value }, children)
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
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login') // Changed from signin to login to match your routes
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}

export function useRequireRole(requiredRole: string) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.user_metadata?.role || user.app_metadata?.role
      if (userRole !== requiredRole) {
        router.push('/unauthorized')
      }
    }
  }, [user, isLoading, requiredRole, router])

  return { user, isLoading }
}