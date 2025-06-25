import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { QuestionForm } from '@/components/admin/QuestionForm'
import { redirect } from 'next/navigation'
import { transformTestType } from '@/lib/utils/typeTransformers'
import type { TestType } from '@/types/assessment.types'

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

  // Get all test types for the form
  const { data: testTypes } = await supabase
    .from('test_types')
    .select('*')
    .eq('is_active', true)
    .order('name')

  // Transform database types to component types
  const transformedTestTypes: TestType[] = (testTypes || []).map(transformTestType)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New Question</h1>
        <p className="text-gray-600">Create a new assessment question</p>
      </div>
      <QuestionForm testTypes={transformedTestTypes} />
    </div>
  )
}