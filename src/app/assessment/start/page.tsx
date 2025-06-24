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
  const { data: dbConfigurations } = await supabase
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

  // Transform database data to match TestConfiguration interface
  const configurations = dbConfigurations?.map(config => ({
    id: config.id,
    name: config.name,
    description: config.description || '',
    isActive: config.is_active ?? false,
    maxAttempts: config.max_attempts ?? 1,
    timeLimitMinutes: config.time_limit_minutes ?? 0,
    testSequences: (config.test_sequences || []).map(sequence => ({
      testTypes: {
        name: sequence.test_types?.name || '',
        description: sequence.test_types?.description || '',
        estimatedDurationMinutes: sequence.test_types?.estimated_duration_minutes || 0
      }
    })),
    createdAt: config.created_at || new Date().toISOString(),
    updatedAt: config.updated_at || new Date().toISOString(),
    createdBy: config.created_by || ''
  })) || []

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
        <TestInstructions configurations={configurations} />
      </div>
    </div>
  )
}