// src/app/api/admin/check-db/route.ts
import { createClient } from '@/lib/supabase/server'
import { QuestionsService } from '@/lib/services/QuestionsService'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const questionsService = new QuestionsService(supabase)

    // Check direct access to test_types table
    const { data: directTestTypes, error: directError } = await supabase
      .from('test_types')
      .select('*')

    console.log('Direct test types query:', { data: directTestTypes, error: directError })

    // Check using QuestionsService
    const serviceTestTypes = await questionsService.getTestTypes()
    console.log('Service test types:', serviceTestTypes)

    // Check individual test type lookups
    const testTypeSlugs = ['dominant-intelligence', 'personality-pattern', 'vark']
    const testTypeChecks = await Promise.allSettled(
      testTypeSlugs.map(async (slug) => {
        try {
          const questions = await questionsService.getQuestionsByTestType(slug)
          return { slug, questionCount: questions.length, success: true }
        } catch (error) {
          return { slug, error: error instanceof Error ? error.message : String(error), success: false }
        }
      })
    )

    return NextResponse.json({
      directTestTypes: directTestTypes?.length || 0,
      directError,
      serviceTestTypes: serviceTestTypes?.length || 0,
      testTypeChecks,
      rawDirectData: directTestTypes,
      rawServiceData: serviceTestTypes
    })

  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json(
      { error: 'Failed to check database', details: error },
      { status: 500 }
    )
  }
}
