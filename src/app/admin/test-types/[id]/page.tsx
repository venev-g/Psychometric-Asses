import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { TestTypeForm } from '@/components/admin/TestTypeForm'
import { redirect } from 'next/navigation'

interface TestTypePageProps {
  params: {
    id: string
  }
}

export default async function TestTypePage({ params }: TestTypePageProps) {
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

  // Get test type
  const { data: testType, error } = await supabase
    .from('test_types')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !testType) {
    redirect('/admin/test-types')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Test Type</h1>
        <p className="text-gray-600">Modify test type settings and configuration</p>
      </div>
      <TestTypeForm testType={testType} />
    </div>
  )
}