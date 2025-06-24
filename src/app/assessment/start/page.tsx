import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { TestInstructions } from '@/components/assessment/TestInstructions'
import { redirect } from 'next/navigation'

export default async function StartAssessmentPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get available configurations
  const { data: configurations } = await supabase
    .from('test_configurations')
    .select(`
      *,
      test_sequences (
        *,
        test_types (name, description, estimated_duration_minutes)
      )
    `)
    .eq('is_active', true)
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Choose an assessment configuration to begin your psychometric evaluation
          </p>
        </div>
        <TestInstructions configurations={configurations || []} />
      </div>
    </div>
  )
}