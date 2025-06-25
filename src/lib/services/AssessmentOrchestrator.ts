// src/lib/services/AssessmentOrchestrator.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ConfigurationService } from './ConfigurationService'
import { AssessmentFactory } from '../assessments/AssessmentFactory'

type Tables = Database['public']['Tables']
type AssessmentSession = Tables['assessment_sessions']['Row']
type UserResponse = Tables['user_responses']['Row']
type Question = Tables['questions']['Row']

export class AssessmentOrchestrator {
  private configService: ConfigurationService

  constructor(private supabase: SupabaseClient<Database>) {
    this.configService = new ConfigurationService(supabase)
  }

  async startAssessment(userId: string, configId: string): Promise<AssessmentSession> {
    // Get configuration to determine total tests
    const config = await this.configService.getConfigurationWithSequence(configId)
    
    const { data, error } = await this.supabase
      .from('assessment_sessions')
      .insert({
        user_id: userId,
        configuration_id: configId,
        status: 'started',
        total_tests: config.test_sequences?.length || 0,
        metadata: {
          started_timestamp: new Date().toISOString(),
          configuration_name: config.name
        }
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getAssessmentSession(sessionId: string): Promise<AssessmentSession> {
    const { data, error } = await this.supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) throw error
    return data
  }

  async getCurrentTest(sessionId: string): Promise<any> {
    const session = await this.getAssessmentSession(sessionId)
    const config = await this.configService.getConfigurationWithSequence(session.configuration_id || '')
    
    if (!config.test_sequences || !session.current_test_index) {
      throw new Error('No test sequences found or invalid session state')
    }
    
    const currentTest = config.test_sequences[session.current_test_index]
    if (!currentTest) {
      throw new Error('Current test not found')
    }
    
    const testType = currentTest.test_types
    const questions = await this.getQuestionsForTest(testType.id)
    
    return {
      testType,
      questions,
      currentIndex: session.current_test_index,
      totalTests: config.test_sequences.length
    }
  }

  async submitResponse(
    sessionId: string, 
    questionId: string, 
    response: any,
    responseTimeMs?: number
  ): Promise<void> {
    // Validate the response first
    await this.validateResponse(questionId, response)

    const { error } = await this.supabase
      .from('user_responses')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        response_value: response,
        response_time_ms: responseTimeMs
      })

    if (error) throw error

    // Update session status to in_progress if it was started
    await this.updateSessionStatus(sessionId, 'in_progress')
  }

  async getTestProgress(sessionId: string, testTypeId: string): Promise<{
    totalQuestions: number
    answeredQuestions: number
    isComplete: boolean
  }> {
    const questions = await this.getQuestionsForTest(testTypeId)
    const responses = await this.getResponsesForTest(sessionId, testTypeId)

    return {
      totalQuestions: questions.length,
      answeredQuestions: responses.length,
      isComplete: responses.length === questions.length
    }
  }

  async completeCurrentTest(sessionId: string): Promise<{ 
    hasNextTest: boolean 
    nextTestIndex: number 
    isAssessmentComplete: boolean 
  }> {
    const session = await this.getAssessmentSession(sessionId)
    const config = await this.configService.getConfigurationWithSequence(session.configuration_id || '')
    
    // Process current test results
    if (config.test_sequences && session.current_test_index && session.current_test_index < config.test_sequences.length) {
      await this.processTestResults(sessionId, session.current_test_index, config)
    }
    
    // Move to next test or complete session
    const nextIndex = (session.current_test_index || 0) + 1
    const isComplete = nextIndex >= (config.test_sequences?.length || 0)
    
    const updateData: Tables['assessment_sessions']['Update'] = {
      current_test_index: nextIndex,
      status: isComplete ? 'completed' : 'in_progress'
    }

    if (isComplete) {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('assessment_sessions')
      .update(updateData)
      .eq('id', sessionId)

    if (error) throw error

    return {
      hasNextTest: !isComplete,
      nextTestIndex: nextIndex,
      isAssessmentComplete: isComplete
    }
  }

  async getAssessmentResults(sessionId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('assessment_results')
      .select(`
        *,
        test_types (name, slug, description)
      `)
      .eq('session_id', sessionId)
      .order('created_at')

    if (error) throw error
    return data
  }

  async abandonAssessment(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('assessment_sessions')
      .update({ 
        status: 'abandoned',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) throw error
  }

  async getUserSessions(userId: string): Promise<AssessmentSession[]> {
    const { data, error } = await this.supabase
      .from('assessment_sessions')
      .select(`
        *,
        test_configurations (name, description)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false })

    if (error) throw error
    return data
  }

  private async processTestResults(sessionId: string, testIndex: number, config: any): Promise<void> {
    const currentTest = config.test_sequences[testIndex]
    const testType = currentTest.test_types
    
    // Get responses for current test
    const responses = await this.getResponsesForTest(sessionId, testType.id)
    const questions = await this.getQuestionsForTest(testType.id)
    
    // Process with appropriate assessment
    const assessment = AssessmentFactory.create(testType.slug)
    
    // Map the database response to match UserResponse interface
    const mappedResponses = responses.map(r => ({
      sessionId: r.session_id || '',
      questionId: r.question_id || '',
      responseValue: r.response_value,
      responseTimeMs: r.response_time_ms ?? undefined,
      createdAt: r.created_at ? new Date(r.created_at) : new Date(),
      id: r.id
    }));
    
    // Map the database questions to match Question interface
    const mappedQuestions = questions.map(q => ({
      id: q.id,
      testTypeId: q.test_type_id || '',
      questionText: q.question_text,
      questionType: q.question_type as 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect',
      options: q.options as any || [],
      category: q.category || undefined,
      subcategory: q.subcategory || undefined,
      weight: q.weight || 1.0,
      isActive: q.is_active || false,
      orderIndex: q.order_index || undefined,
      createdAt: q.created_at ? new Date(q.created_at) : new Date()
    }));
    
    const result = await assessment.processAssessment(mappedResponses, mappedQuestions)
    
    // Save results
    const { error } = await this.supabase
      .from('assessment_results')
      .insert({
        session_id: sessionId,
        test_type_id: testType.id,
        raw_scores: result.rawScores,
        processed_scores: result.processedScores,
        recommendations: result.recommendations
      })

    if (error) throw error
  }

  private async validateResponse(questionId: string, response: any): Promise<void> {
    const { data: question, error } = await this.supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (error) throw error

    // Basic validation based on question type
    switch (question.question_type) {
      case 'multiple_choice':
        const options = question.options as any[]
        if (Array.isArray(options) && !options.some((option: any) => option.value === response)) {
          throw new Error('Invalid response for multiple choice question')
        }
        break
      case 'rating_scale':
        if (typeof response !== 'number' || response < 1 || response > 5) {
          throw new Error('Invalid response for rating scale question')
        }
        break
      case 'yes_no':
        if (typeof response !== 'boolean') {
          throw new Error('Invalid response for yes/no question')
        }
        break
      case 'multiselect':
        const multiselectOptions = question.options as any[]
        if (!Array.isArray(response) || 
            (Array.isArray(multiselectOptions) && !response.every(r => multiselectOptions.some((option: any) => option.value === r)))) {
          throw new Error('Invalid response for multiselect question')
        }
        break
    }
  }

  private async updateSessionStatus(sessionId: string, status: string): Promise<void> {
    const { error } = await this.supabase
      .from('assessment_sessions')
      .update({ status })
      .eq('id', sessionId)
      .eq('status', 'started') // Only update if currently started

    // Ignore error if status wasn't 'started' (already updated)
  }

  private async getQuestionsForTest(testTypeId: string): Promise<Question[]> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('*')
      .eq('test_type_id', testTypeId)
      .eq('is_active', true)
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }

  private async getResponsesForTest(sessionId: string, testTypeId: string): Promise<UserResponse[]> {
    const { data, error } = await this.supabase
      .from('user_responses')
      .select(`
        *,
        questions!inner(test_type_id)
      `)
      .eq('session_id', sessionId)
      .eq('questions.test_type_id', testTypeId)

    if (error) throw error
    return data
  }
}