// src/app/results/[sessionId]/page.tsx
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { ResultsDisplay } from '@/components/assessment/ResultsDisplay'
import { redirect } from 'next/navigation'

interface ResultsPageProps {
  params: {
    sessionId: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const supabase = createServerClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get session and verify ownership
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('id', params.sessionId)
    .eq('user_id', user.id)
    .single()

  if (sessionError || !session) {
    redirect('/dashboard')
  }

  // If session is not completed, redirect back to assessment
  if (session.status !== 'completed') {
    redirect(`/assessment/${params.sessionId}`)
  }

  // Get results
  const { data: results, error: resultsError } = await supabase
    .from('assessment_results')
    .select(`
      *,
      test_types (name, slug, description)
    `)
    .eq('session_id', params.sessionId)
    .order('created_at')

  if (resultsError) {
    redirect('/dashboard')
  }

  return <ResultsDisplay results={results || []} session={session} />
}