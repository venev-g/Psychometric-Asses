import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get assessment statistics
  const { data: assessments, count: totalAssessments } = await supabase
    .from('assessment_sessions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)

  const { data: completedAssessments, count: completedCount } = await supabase
    .from('assessment_sessions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={profile?.avatar_url || undefined} 
                    alt={profile?.full_name || 'User avatar'}
                  />
                  <AvatarFallback className="text-2xl font-semibold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {profile?.full_name || 'No name set'}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                    {profile?.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-semibold">
                    {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last updated</p>
                  <p className="font-semibold">
                    {new Date(profile?.updated_at || user.updated_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Statistics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Assessment Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold">{totalAssessments || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {totalAssessments ? Math.round(((completedCount || 0) / totalAssessments) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}