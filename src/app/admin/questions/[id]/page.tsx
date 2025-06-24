import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { QuestionForm } from '@/components/admin/QuestionForm'
import { redirect } from 'next/navigation'

interface QuestionPageProps {
  params: {
    id: string
  }
}

export default async function QuestionPage({ params }: QuestionPageProps) {
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

  // Get question
  const { data: question, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !question) {
    redirect('/admin/questions')
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Question</h1>
        <p className="text-gray-600">Modify question details and options</p>
      </div>
      <QuestionForm 
        question={question} 
        testTypes={testTypes || []} 
      />
    </div>
  )
}