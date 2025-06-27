// src/app/input/behavioral/[studentId]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { Checkbox } from '@/components/ui/Checkbox'
import { ArrowLeft, ArrowRight, Save, User, Brain, Users, BookOpen } from 'lucide-react'

interface Student {
  id: string
  name: string
  email?: string
  created_at: string
}

interface Question {
  id: string
  question_text: string
  question_type: string
  category: string | null
  options?: any
  order_index?: number | null
}

interface AssessmentSession {
  id: string
  user_id: string | null
  configuration_id: string | null
  status: string | null
  current_test_index: number | null
  total_tests: number | null
  started_at: string | null
  metadata: any
}

interface Response {
  questionId: string
  responseValue: any
  testType: string
}

export default function StudentBehavioralInputPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.studentId as string

  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [assessmentSession, setAssessmentSession] = useState<AssessmentSession | null>(null)
  
  // Assessment state
  const [currentAssessment, setCurrentAssessment] = useState<'intelligence' | 'personality' | 'vark'>('intelligence')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Response[]>([])
  const [currentResponse, setCurrentResponse] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (studentId) {
      fetchStudent()
      initializeAssessment()
    }
  }, [studentId])

  const fetchStudent = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, created_at')
        .eq('id', studentId)
        .single()

      if (error) throw error

      setStudent({
        id: data.id,
        name: data.full_name || 'Unknown User',
        created_at: data.created_at || ''
      })
    } catch (err) {
      console.error('Error fetching student:', err)
      setError('Failed to load student information')
    } finally {
      setLoading(false)
    }
  }

  const initializeAssessment = async () => {
    try {
      const supabase = createClient()
      
      // Check if there's an existing session for this student
      const { data: existingSession, error: sessionError } = await supabase
        .from('assessment_sessions')
        .select('*')
        .eq('user_id', studentId)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)

      if (sessionError) throw sessionError

      if (existingSession && existingSession.length > 0) {
        setAssessmentSession(existingSession[0])
        // Resume from where we left off
        const metadata = existingSession[0].metadata as any || {}
        if (metadata.currentAssessment) {
          setCurrentAssessment(metadata.currentAssessment)
        }
        if (typeof metadata.currentQuestionIndex === 'number') {
          setCurrentQuestionIndex(metadata.currentQuestionIndex)
        }
        if (Array.isArray(metadata.responses)) {
          setResponses(metadata.responses)
        }
      } else {
        // Create new session
        await createNewSession()
      }

      await loadQuestions()
    } catch (err) {
      console.error('Error initializing assessment:', err)
      setError('Failed to initialize assessment')
    }
  }

  const createNewSession = async () => {
    try {
      const supabase = createClient()
      
      // Get a default configuration
      const { data: config, error: configError } = await supabase
        .from('test_configurations')
        .select('id')
        .eq('is_active', true)
        .limit(1)

      if (configError) throw configError

      const configId = config && config.length > 0 ? config[0].id : null

      const { data: session, error: sessionError } = await supabase
        .from('assessment_sessions')
        .insert({
          user_id: studentId,
          configuration_id: configId,
          status: 'in_progress',
          current_test_index: 0,
          total_tests: 3,
          metadata: {
            currentAssessment: 'intelligence',
            currentQuestionIndex: 0,
            responses: []
          }
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      setAssessmentSession(session)
    } catch (err) {
      console.error('Error creating session:', err)
      throw err
    }
  }

  const loadQuestions = async () => {
    try {
      const supabase = createClient()
      
      // Get test type ID based on current assessment
      const testTypeSlugs = {
        intelligence: 'dominant-intelligence',
        personality: 'personality-pattern',
        vark: 'vark'
      }

      const { data: testType, error: testTypeError } = await supabase
        .from('test_types')
        .select('id')
        .eq('slug', testTypeSlugs[currentAssessment])
        .single()

      if (testTypeError) throw testTypeError

      // Get questions for this test type
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('test_type_id', testType.id)
        .eq('is_active', true)
        .order('order_index')

      if (questionsError) throw questionsError

      setQuestions(questionsData || [])
    } catch (err) {
      console.error('Error loading questions:', err)
      setError('Failed to load questions')
    }
  }

  const handleResponse = async (value: any) => {
    if (!questions[currentQuestionIndex]) return

    const currentQuestion = questions[currentQuestionIndex]
    const newResponse: Response = {
      questionId: currentQuestion.id,
      responseValue: value,
      testType: currentAssessment
    }

    const updatedResponses = [...responses.filter(r => r.questionId !== currentQuestion.id), newResponse]
    setResponses(updatedResponses)
    setCurrentResponse(value)

    // Save response to database
    await saveResponse(newResponse)

    // Auto advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setCurrentResponse(null)
      } else {
        handleAssessmentComplete()
      }
    }, 500)
  }

  const saveResponse = async (response: Response) => {
    try {
      setSaving(true)
      const supabase = createClient()

      // Save individual response
      await supabase
        .from('user_responses')
        .insert({
          session_id: assessmentSession?.id,
          question_id: response.questionId,
          response_value: response.responseValue,
          response_time_ms: 0
        })

      // Update session metadata
      if (assessmentSession) {
        await supabase
          .from('assessment_sessions')
          .update({
            metadata: {
              ...assessmentSession.metadata,
              currentAssessment,
              currentQuestionIndex,
              responses: responses
            }
          })
          .eq('id', assessmentSession.id)
      }
    } catch (err) {
      console.error('Error saving response:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAssessmentComplete = () => {
    // Move to next assessment or complete
    if (currentAssessment === 'intelligence') {
      setCurrentAssessment('personality')
      setCurrentQuestionIndex(0)
      setCurrentResponse(null)
      loadQuestions()
    } else if (currentAssessment === 'personality') {
      setCurrentAssessment('vark')
      setCurrentQuestionIndex(0)
      setCurrentResponse(null)
      loadQuestions()
    } else {
      // All assessments complete
      completeSession()
    }
  }

  const completeSession = async () => {
    try {
      const supabase = createClient()
      
      if (assessmentSession) {
        await supabase
          .from('assessment_sessions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', assessmentSession.id)
      }

      router.push(`/input/behavioral?completed=${studentId}`)
    } catch (err) {
      console.error('Error completing session:', err)
      setError('Failed to complete assessment')
    }
  }

  const renderQuestion = () => {
    if (!questions[currentQuestionIndex]) return null

    const question = questions[currentQuestionIndex]
    const existingResponse = responses.find(r => r.questionId === question.id)

    switch (question.question_type) {
      case 'rating_scale':
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={currentResponse?.toString() || existingResponse?.responseValue?.toString() || ''}
              onValueChange={(value) => setCurrentResponse(parseInt(value))}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                  <Label htmlFor={`option-${value}`} className="cursor-pointer">
                    {value === 1 && 'Strongly Disagree'}
                    {value === 2 && 'Disagree'}
                    {value === 3 && 'Neutral'}
                    {value === 4 && 'Agree'}
                    {value === 5 && 'Strongly Agree'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => handleResponse(currentResponse)}
              disabled={currentResponse === null || saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Next Question'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={currentResponse?.toString() || existingResponse?.responseValue?.toString() || ''}
              onValueChange={(value) => setCurrentResponse(value)}
            >
              {question.options?.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => handleResponse(currentResponse)}
              disabled={currentResponse === null || saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Next Question'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      case 'multiselect':
        const multiResponse = currentResponse || existingResponse?.responseValue || []
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.options?.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${index}`}
                    checked={multiResponse.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCurrentResponse([...multiResponse, option.value])
                      } else {
                        setCurrentResponse(multiResponse.filter((v: any) => v !== option.value))
                      }
                    }}
                  />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => handleResponse(currentResponse || [])}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Next Question'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      default:
        return <div>Unsupported question type: {question.question_type}</div>
    }
  }

  const getAssessmentIcon = () => {
    switch (currentAssessment) {
      case 'intelligence': return Brain
      case 'personality': return Users
      case 'vark': return BookOpen
    }
  }

  const getAssessmentTitle = () => {
    switch (currentAssessment) {
      case 'intelligence': return 'Dominant Intelligence Assessment'
      case 'personality': return 'Personality Pattern Assessment'
      case 'vark': return 'VARK Learning Style Assessment'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading student information...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-4">
          <AlertDescription>Student not found</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const AssessmentIcon = getAssessmentIcon()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Badge variant="outline">Assessment in Progress</Badge>
      </div>

      {/* Student Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Student Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <p className="text-gray-600">Student ID: {student.id.slice(0, 8)}...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AssessmentIcon className="h-5 w-5" />
            <span>{getAssessmentTitle()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          {questions[currentQuestionIndex] && (
            <div className="space-y-6">
              <div className="text-lg font-medium">
                {questions[currentQuestionIndex].question_text}
              </div>
              {renderQuestion()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Navigation */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Badge variant={currentAssessment === 'intelligence' ? 'default' : 'outline'}>
            Intelligence
          </Badge>
          <Badge variant={currentAssessment === 'personality' ? 'default' : 'outline'}>
            Personality
          </Badge>
          <Badge variant={currentAssessment === 'vark' ? 'default' : 'outline'}>
            Learning Style
          </Badge>
        </div>
        <Button
          onClick={completeSession}
          variant="outline"
          disabled={responses.length === 0}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Progress
        </Button>
      </div>
    </div>
  )
}
