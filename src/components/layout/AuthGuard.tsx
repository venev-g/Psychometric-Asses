'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  requiredRole?: 'admin' | 'user'
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login',
  requiredRole 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      }
      // Role-based access control would require user profile data
      // This would need to be implemented based on your user profile structure
    }
  }, [user, loading, requireAuth, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}