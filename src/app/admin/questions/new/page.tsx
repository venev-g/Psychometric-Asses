import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { QuestionForm } from '@/components/admin/QuestionForm'
import { redirect } from 'next/navigation'

export default async function NewQuestionPage() {
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

  // Get test types for the form
  const { data: testTypes } = await supabase
    .from('test_types')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Question</h1>
        <p className="text-gray-600">Add a new question to an assessment</p>
      </div>
      <QuestionForm testTypes={testTypes || []} />
    </div>
  )
}