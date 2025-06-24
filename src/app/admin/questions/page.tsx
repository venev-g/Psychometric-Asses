import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { QuestionManager } from '@/components/admin/QuestionManager'
import { redirect } from 'next/navigation'

export default async function QuestionsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Question Management</h1>
        <p className="text-gray-600">Manage assessment questions and options</p>
      </div>
      <QuestionManager />
    </div>
  )
}