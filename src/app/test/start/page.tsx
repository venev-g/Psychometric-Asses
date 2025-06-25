import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { StartTestPage } from '@/components/test/StartTestPage'
import { redirect } from 'next/navigation'
import { QuestionsService } from '@/lib/services/QuestionsService'

export default async function StartTestPageServer() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch questions from the database
  const questionsService = new QuestionsService(supabase)
  const allQuestions = await questionsService.getAllQuestionsForAssessment()

  return <StartTestPage user={user} questions={allQuestions} />
}