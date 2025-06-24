// src/app/assessment/[sessionId]/page.tsx
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow'
import { redirect } from 'next/navigation'

interface AssessmentPageProps {
  params: {
    sessionId: string
  }
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const supabase = createServerClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Verify session belongs to user
  const { data: session, error } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('id', params.sessionId)
    .eq('user_id', user.id)
    .single()

  if (error || !session) {
    redirect('/dashboard')
  }

  // If session is completed, redirect to results
  if (session.status === 'completed') {
    redirect(`/results/${params.sessionId}`)
  }

  return <AssessmentFlow sessionId={params.sessionId} />
}