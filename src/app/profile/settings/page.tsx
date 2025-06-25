import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { redirect } from 'next/navigation'
import { Settings as SettingsIcon, User, Shield, Trash2, Mail, Lock } from 'lucide-react'

export default async function ProfileSettingsPage() {
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

      {/* Personal Information */}
      <Card className="shadow-xl rounded-2xl border-0 bg-white/90 animate-fade-in-up">
        <CardHeader className="flex flex-row items-center gap-2 pb-0">
          <User className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-blue-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <form className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-2">
                Full Name
              </Label>
              <div className="relative mt-1">
                <Input
                  id="fullName"
                  type="text"
                  defaultValue={profile?.full_name || ''}
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
                  defaultValue={user.email || ''}
                  disabled
                  className="bg-gray-50 pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow">
              Save Changes
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