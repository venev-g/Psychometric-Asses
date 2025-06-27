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

  // Fetch questions from the database with error handling
  let allQuestions
  try {
    const questionsService = new QuestionsService(supabase)
    allQuestions = await questionsService.getAllQuestionsForAssessment()
  } catch (error) {
    console.error('Error fetching questions:', error)
    // Provide empty questions structure if there's an error
    allQuestions = {
      dominantIntelligence: [],
      personalityPattern: [],
      learningStyle: []
    }
  }

  return <StartTestPage user={user} questions={allQuestions} />
}