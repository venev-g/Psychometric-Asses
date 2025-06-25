// src/lib/services/QuestionsService.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
type Question = Tables['questions']['Row']
type TestType = Tables['test_types']['Row']

export interface DatabaseQuestion {
  id: string
  question_text: string
  question_type: string
  category: string | null
  subcategory?: string | null
  weight: number | null
  order_index: number | null
  options?: any
  is_active: boolean | null
  test_type_id: string | null
  created_at: string | null
}

export interface FormattedQuestion {
  id: number
  text: string
  testType: 'dominant' | 'personality' | 'learning'
  part?: number
  category: string
  options?: string[]
}

export class QuestionsService {
  constructor(private supabase: SupabaseClient<Database>) {
    console.log('QuestionsService initialized with Supabase client')
  }

  async getTestTypes(): Promise<TestType[]> {
    console.log('Fetching test types...')
    const { data, error } = await this.supabase
      .from('test_types')
      .select('*')
      .eq('is_active', true)
      .order('created_at')

    if (error) {
      console.error('Error fetching test types:', error)
      throw error
    }
    console.log(`Retrieved ${data?.length || 0} test types`)
    return data || []
  }

  async getQuestionsByTestType(testTypeSlug: string): Promise<DatabaseQuestion[]> {
    console.log(`Fetching questions for test type: ${testTypeSlug}`)
    // First get the test type ID - use array instead of single to avoid errors
    const { data: testTypes, error: testTypeError } = await this.supabase
      .from('test_types')
      .select('id, name')
      .eq('slug', testTypeSlug)
      .eq('is_active', true)

    if (testTypeError) {
      console.error(`Error fetching test type for slug ${testTypeSlug}:`, testTypeError)
      throw testTypeError
    }
    
    if (!testTypes || testTypes.length === 0) {
      console.error(`Test type with slug '${testTypeSlug}' not found`)
      throw new Error(`Test type with slug '${testTypeSlug}' not found`)
    }

    const testType = testTypes[0]
    console.log(`Found test type: ${testType.name} (${testType.id})`)

    // Then get questions for this test type
    const { data, error } = await this.supabase
      .from('questions')
      .select('*')
      .eq('test_type_id', testType.id)
      .eq('is_active', true)
      .order('order_index')

    if (error) {
      console.error(`Error fetching questions for test type ${testType.name}:`, error)
      throw error
    }
    
    console.log(`Retrieved ${data?.length || 0} questions for ${testType.name}`)
    return data || []
  }

  async getAllQuestionsForAssessment(): Promise<{
    dominantIntelligence: FormattedQuestion[]
    personalityPattern: FormattedQuestion[]
    learningStyle: FormattedQuestion[]
  }> {
    try {
      console.log('Fetching all questions for assessment...')
      // Fetch questions for all test types
      const [dominantQuestions, personalityQuestions, learningQuestions] = await Promise.all([
        this.getQuestionsByTestType('dominant-intelligence'),
        this.getQuestionsByTestType('personality-pattern'),
        this.getQuestionsByTestType('vark')
      ])

      console.log(`Dominant questions: ${dominantQuestions.length}`)
      console.log(`Personality questions: ${personalityQuestions.length}`)
      console.log(`Learning questions: ${learningQuestions.length}`)

      const result = {
        dominantIntelligence: this.formatQuestionsForComponent(dominantQuestions, 'dominant'),
        personalityPattern: this.formatQuestionsForComponent(personalityQuestions, 'personality'),
        learningStyle: this.formatQuestionsForComponent(learningQuestions, 'learning')
      }
      
      console.log('Questions formatted and ready to return:')
      console.log(`Dominant: ${result.dominantIntelligence.length}`)
      console.log(`Personality: ${result.personalityPattern.length}`)
      console.log(`Learning: ${result.learningStyle.length}`)
      
      return result
    } catch (error) {
      console.error('Failed to fetch questions from database:', error)
      throw error
    }
  }

  private formatQuestionsForComponent(
    questions: DatabaseQuestion[], 
    testType: 'dominant' | 'personality' | 'learning'
  ): FormattedQuestion[] {
    return questions.map((q, index) => ({
      id: index + 1, // Use sequential IDs for the component
      text: q.question_text,
      testType,
      category: q.category || 'general',
      options: this.extractOptions(q.options, q.question_type),
      part: this.calculatePart(index, testType)
    }))
  }

  private extractOptions(options: any, questionType: string): string[] | undefined {
    if (!options) return undefined

    try {
      if (typeof options === 'string') {
        options = JSON.parse(options)
      }

      if (Array.isArray(options)) {
        return options.map(opt => 
          typeof opt === 'object' && opt.text ? opt.text : String(opt)
        )
      }
    } catch (error) {
      console.error('Failed to parse question options:', error)
    }

    return undefined
  }

  private calculatePart(index: number, testType: 'dominant' | 'personality' | 'learning'): number | undefined {
    // For dominant intelligence test, divide into 3 parts
    if (testType === 'dominant') {
      return Math.floor(index / 8) + 1 // 8 questions per part, 3 parts
    }
    
    // Other tests don't use parts
    return undefined
  }
}
