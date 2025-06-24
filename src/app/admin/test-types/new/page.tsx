import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { TestTypeForm } from '@/components/admin/TestTypeForm'
import { redirect } from 'next/navigation'

export default async function NewTestTypePage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Test Type</h1>
        <p className="text-gray-600">Define a new assessment type</p>
      </div>
      <TestTypeForm />
    </div>
  )
}