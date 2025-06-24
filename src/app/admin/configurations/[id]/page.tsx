import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ConfigurationForm } from '@/components/admin/ConfigurationForm'
import { redirect } from 'next/navigation'

interface ConfigurationPageProps {
  params: {
    id: string
  }
}

export default async function ConfigurationPage({ params }: ConfigurationPageProps) {
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

  // Get configuration with sequences
  const { data: configuration, error } = await supabase
    .from('test_configurations')
    .select(`
      *,
      test_sequences (
        *,
        test_types (*)
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !configuration) {
    redirect('/admin/configurations')
  }

  // Get all test types for the form
  const { data: testTypes } = await supabase
    .from('test_types')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Configuration</h1>
        <p className="text-gray-600">Modify assessment configuration settings</p>
      </div>
      <ConfigurationForm 
        configuration={configuration} 
        testTypes={testTypes || []} 
      />
    </div>
  )
}