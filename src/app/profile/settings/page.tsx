'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Settings as SettingsIcon, User, Shield, Trash2, Mail, Lock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    full_name: ''
  })

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
      
      if (profileData) {
        setFormData({
          full_name: profileData.full_name || ''
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const supabase = createClient()
      
      // Update or insert user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Modern Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 p-8 flex items-center gap-6 shadow-lg mb-8 animate-fade-in">
        <SettingsIcon className="w-14 h-14 text-white drop-shadow-lg" />
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight">Settings</h1>
          <p className="text-blue-100 text-lg">Update your account settings and preferences</p>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card className="shadow-xl rounded-2xl border-0 bg-white/90 animate-fade-in-up">
        <CardHeader className="flex flex-row items-center gap-2 pb-0">
          <User className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-blue-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full_name" className="flex items-center gap-2">
                Full Name
              </Label>
              <div className="relative mt-1">
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50 pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-xl rounded-2xl border-0 bg-white/90 animate-fade-in-up">
        <CardHeader className="flex flex-row items-center gap-2 pb-0">
          <Shield className="w-6 h-6 text-purple-500" />
          <CardTitle className="text-purple-900">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Lock className="w-5 h-5" /> Change Password
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Shield className="w-5 h-5" /> Enable Two-Factor Authentication
          </Button>
          <p className="text-sm text-gray-500">
            Security features coming soon. Contact support for password changes.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="shadow-xl rounded-2xl border-0 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in-up">
        <CardHeader className="flex flex-row items-center gap-2 pb-0">
          <Trash2 className="w-6 h-6 text-red-500" />
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="w-full flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}