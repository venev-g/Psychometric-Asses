'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Calendar, User, Briefcase, GraduationCap, Target, Edit2, Save, X, Award, CheckCircle, Star } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [assessmentStats, setAssessmentStats] = useState({
    totalAssessments: 0,
    completedCount: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)

      // Get user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      
      setProfile(profileData)

      // Get assessment statistics
      const { count: totalAssessments } = await supabase
        .from('assessment_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', currentUser.id)

      const { count: completedCount } = await supabase
        .from('assessment_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', currentUser.id)
        .eq('status', 'completed')

      const completionRate = totalAssessments ? Math.round(((completedCount || 0) / totalAssessments) * 100) : 0

      setAssessmentStats({
        totalAssessments: totalAssessments || 0,
        completedCount: completedCount || 0,
        completionRate
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Profile Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 p-8 flex items-center gap-6 shadow-lg mb-10 animate-fade-in overflow-hidden min-h-[180px]">
        <User className="w-16 h-16 text-white/40 absolute right-8 top-8 z-0" />
        <div className="z-10">
          <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight">Profile</h1>
          <p className="text-blue-100 text-lg">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 relative">
          <Card className="shadow-xl rounded-2xl border-0 bg-white/90 animate-fade-in-up">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                Profile Information
                <Link href="/profile/settings">
                  <button className="ml-2 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-1 transition">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="relative">
                  <Avatar className="w-28 h-28 border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-400">
                    <AvatarImage 
                      src={profile?.avatar_url || undefined} 
                      alt={profile?.full_name || 'User avatar'}
                    />
                    <AvatarFallback className="text-3xl font-bold text-white">
                      {profile?.full_name?.charAt(0) || profile?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {profile?.full_name || profile?.first_name || 'No name set'}
                    {profile?.role === 'admin' && <Badge variant="default" className="ml-2">Admin</Badge>}
                  </h3>
                  <p className="text-gray-600 text-lg">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">Member</Badge>
                    <span className="text-xs text-gray-400">Joined {new Date(profile?.created_at || user?.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                <div className="flex flex-col items-center">
                  <Award className="w-7 h-7 text-yellow-500 mb-1" />
                  <span className="text-lg font-bold text-gray-800">{assessmentStats.totalAssessments}</span>
                  <span className="text-xs text-gray-500">Total Assessments</span>
                </div>
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-7 h-7 text-green-500 mb-1" />
                  <span className="text-lg font-bold text-gray-800">{assessmentStats.completedCount}</span>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-7 h-7 text-purple-500 mb-1" />
                  <span className="text-lg font-bold text-gray-800">{assessmentStats.completionRate}%</span>
                  <span className="text-xs text-gray-500">Completion Rate</span>
                </div>
                <div className="flex flex-col items-center">
                  <User className="w-7 h-7 text-blue-500 mb-1" />
                  <span className="text-lg font-bold text-gray-800">{profile?.role === 'admin' ? 'Admin' : 'User'}</span>
                  <span className="text-xs text-gray-500">Role</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Statistics (Achievements) */}
        <div className="flex flex-col gap-8">
          <Card className="shadow-xl rounded-2xl border-0 bg-gradient-to-br from-yellow-50 to-orange-100 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <Award className="w-6 h-6 text-yellow-500" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-yellow-700">Coming soon: Earn badges for milestones and learning streaks!</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}