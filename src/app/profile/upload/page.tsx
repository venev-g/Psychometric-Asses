'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Calendar, User, Briefcase, GraduationCap, Target, Edit2, Save, X, CheckCircle, Star, Award, Upload } from 'lucide-react'

export default function ProfileWithUploadPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    occupation: '',
    education_level: '',
    goals: [] as string[]
  })

  const goalOptions = [
    'Career Development',
    'Personal Growth', 
    'Academic Planning',
    'Skill Assessment',
    'Team Building',
    'Leadership Development'
  ]

  const educationLevels = [
    'High School',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Other'
  ]

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    setLoading(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const response = await fetch('/api/profile')
      const data = await response.json()
      
      if (data.success && data.profile) {
        setProfile(data.profile)
        setProfileImageUrl(data.profile.avatar_url || '')
        setFormData({
          full_name: data.profile.full_name || user.user_metadata?.full_name || '',
          date_of_birth: data.profile.date_of_birth || '',
          gender: data.profile.gender || '',
          occupation: data.profile.occupation || '',
          education_level: data.profile.education_level || '',
          goals: data.profile.goals || []
        })
      } else {
        setFormData(prev => ({
          ...prev,
          full_name: user.user_metadata?.full_name || ''
        }))
      }
    } catch (err: any) {
      setError('Failed to load profile: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/profile-picture', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setProfileImageUrl(data.data.publicUrl)
        setSuccess('Profile picture uploaded successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to upload profile picture')
      }
    } catch (err: any) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Profile saved successfully!')
        setProfile(data.profile)
        setEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to save profile')
      }
    } catch (err: any) {
      setError('Network error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
          <p className="text-gray-600 mt-2">Manage your account information and profile picture</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Profile Information
              </span>
              {!editing && (
                <Button onClick={() => setEditing(true)} size="sm">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profileImageUrl} alt={formData.full_name} />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">
                    {getInitials(formData.full_name || user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{formData.full_name || 'Name not set'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {profile?.role || 'user'}
                </Badge>
              </div>
            </div>

            {editing ? (
              /* Edit Form */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gender</Label>
                  <div className="flex flex-wrap gap-4">
                    {['male', 'female', 'other', 'prefer_not_to_say'].map(gender => (
                      <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        />
                        <span className="text-sm capitalize">{gender.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education_level">Education Level</Label>
                    <select
                      id="education_level"
                      value={formData.education_level}
                      onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select education level</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Assessment Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalOptions.map(goal => (
                      <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.goals.includes(goal)}
                          onChange={() => handleGoalToggle(goal)}
                        />
                        <span className="text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Personal Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Date of Birth:</span> {formData.date_of_birth || 'Not set'}</p>
                      <p><span className="text-gray-500">Gender:</span> {formData.gender ? formData.gender.replace('_', ' ') : 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Professional Info</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Occupation:</span> {formData.occupation || 'Not set'}</p>
                      <p><span className="text-gray-500">Education:</span> {formData.education_level || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {formData.goals.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Assessment Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.goals.map(goal => (
                        <Badge key={goal} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
            View Dashboard
          </Button>
          <Button onClick={() => router.push('/assessment')} variant="outline" className="w-full">
            Take Assessment
          </Button>
          <Button onClick={() => router.push('/results')} variant="outline" className="w-full">
            View Results
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
