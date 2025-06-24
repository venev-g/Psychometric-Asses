// src/lib/services/UserService.ts
import type { User, UserProfile, UserActivity } from '@/types/user.types'
import type { UserSearchParams, BulkUserActionData } from '@/lib/validations/user'
import { useState, useEffect, useCallback } from 'react' 

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  averageAssessmentsPerUser: number
  topPerformers: Array<{
    userId: string
    name: string
    score: number
    assessmentCount: number
  }>
}

export interface UserEngagement {
  dailyActiveUsers: number[]
  weeklyActiveUsers: number[]
  monthlyActiveUsers: number[]
  retentionRate: number
  averageSessionDuration: number
  bounceRate: number
}

export class UserService {
  private apiUrl = '/api/users'

  // Get user profile
  async getProfile(userId?: string): Promise<UserProfile> {
    try {
      const url = userId ? `${this.apiUrl}/${userId}/profile` : `${this.apiUrl}/profile`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch user profile')
      return response.json()
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.apiUrl}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to update user profile')
      return response.json()
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Get user preferences
  async getPreferences(userId?: string): Promise<any> {
    try {
      const url = userId ? `${this.apiUrl}/${userId}/preferences` : `${this.apiUrl}/preferences`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch user preferences')
      return response.json()
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      throw error
    }
  }

  // Update user preferences
  async updatePreferences(preferences: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })
      
      if (!response.ok) throw new Error('Failed to update user preferences')
      return response.json()
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }
  }

  // Search users (admin only)
  async searchUsers(params: UserSearchParams): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
  }> {
    try {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
      
      const response = await fetch(`${this.apiUrl}/search?${searchParams}`)
      if (!response.ok) throw new Error('Failed to search users')
      return response.json()
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

  // Get user details (admin only)
  async getUserDetails(userId: string): Promise<User & {
    assessmentHistory: any[]
    activityLog: UserActivity[]
    stats: any
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user details')
      return response.json()
    } catch (error) {
      console.error('Error fetching user details:', error)
      throw error
    }
  }

  // Update user role (admin only)
  async updateUserRole(userId: string, role: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      
      if (!response.ok) throw new Error('Failed to update user role')
      return response.json()
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  // Deactivate user (admin only)
  async deactivateUser(userId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      
      if (!response.ok) throw new Error('Failed to deactivate user')
    } catch (error) {
      console.error('Error deactivating user:', error)
      throw error
    }
  }

  // Reactivate user (admin only)
  async reactivateUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}/reactivate`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to reactivate user')
    } catch (error) {
      console.error('Error reactivating user:', error)
      throw error
    }
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete user')
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Bulk user actions (admin only)
  async bulkAction(data: BulkUserActionData): Promise<{
    success: number
    failed: number
    errors: Array<{ userId: string; error: string }>
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to perform bulk action')
      return response.json()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      throw error
    }
  }

  // Get user activity
  async getUserActivity(userId: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}/activity?limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch user activity')
      return response.json()
    } catch (error) {
      console.error('Error fetching user activity:', error)
      throw error
    }
  }

  // Get user stats (admin only)
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await fetch(`${this.apiUrl}/stats`)
      if (!response.ok) throw new Error('Failed to fetch user stats')
      return response.json()
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  }

  // Get user engagement metrics (admin only)
  async getUserEngagement(timeRange: { start: string; end: string }): Promise<UserEngagement> {
    try {
      const params = new URLSearchParams({
        start: timeRange.start,
        end: timeRange.end
      })
      
      const response = await fetch(`${this.apiUrl}/engagement?${params}`)
      if (!response.ok) throw new Error('Failed to fetch user engagement')
      return response.json()
    } catch (error) {
      console.error('Error fetching user engagement:', error)
      throw error
    }
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await fetch(`${this.apiUrl}/avatar`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Failed to upload avatar')
      return response.json()
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  // Delete avatar
  async deleteAvatar(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/avatar`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete avatar')
    } catch (error) {
      console.error('Error deleting avatar:', error)
      throw error
    }
  }

  // Export user data
  async exportUserData(userId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}/export?format=${format}`)
      if (!response.ok) throw new Error('Failed to export user data')
      return response.blob()
    } catch (error) {
      console.error('Error exporting user data:', error)
      throw error
    }
  }

  // Request account deletion
  async requestAccountDeletion(reason?: string): Promise<{ requestId: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/delete-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      
      if (!response.ok) throw new Error('Failed to request account deletion')
      return response.json()
    } catch (error) {
      console.error('Error requesting account deletion:', error)
      throw error
    }
  }

  // Cancel account deletion request
  async cancelAccountDeletion(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/delete-request`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to cancel account deletion')
    } catch (error) {
      console.error('Error canceling account deletion:', error)
      throw error
    }
  }

  // Send verification email
  async sendVerificationEmail(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/verify-email`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to send verification email')
    } catch (error) {
      console.error('Error sending verification email:', error)
      throw error
    }
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/verify-email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      if (!response.ok) throw new Error('Failed to verify email')
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  }

  // Get user sessions
  async getUserSessions(): Promise<Array<{
    id: string
    deviceInfo: any
    location?: string
    isActive: boolean
    createdAt: Date
    lastActiveAt: Date
  }>> {
    try {
      const response = await fetch(`${this.apiUrl}/sessions`)
      if (!response.ok) throw new Error('Failed to fetch user sessions')
      return response.json()
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      throw error
    }
  }

  // Revoke user session
  async revokeSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to revoke session')
    } catch (error) {
      console.error('Error revoking session:', error)
      throw error
    }
  }

  // Revoke all sessions except current
  async revokeAllSessions(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/sessions`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to revoke sessions')
    } catch (error) {
      console.error('Error revoking sessions:', error)
      throw error
    }
  }
}

// Singleton instance
export const userService = new UserService()

// React hook for user management
export function useUser(userId?: string) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const userData = await userService.getProfile(userId)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      const updatedUser = await userService.updateProfile(data)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }, [])

  return {
    user,
    loading,
    error,
    updateProfile,
    refresh: loadUser
  }
}