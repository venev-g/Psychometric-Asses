import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { TestTypeManager } from '@/components/admin/TestTypeManager'
import { redirect } from 'next/navigation'

export default async function TestTypesPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Test Types</h1>
        <p className="text-gray-600">Manage assessment types and their configurations</p>
      </div>
      <TestTypeManager />
    </div>
  )
}