'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Brain, User, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  question_text: string
  question_type: string
  options?: any[]
  category: string
}

interface DemoAssessmentState {
  currentQuestionIndex: number
  questions: Question[]
  responses: Record<string, any>
  testType: string
  sessionId: string
  completed: boolean
}

const TEST_TYPES = {
  'dominant-intelligence': {
    name: 'Dominant Intelligence Assessment',
    icon: Brain,
    description: 'Discover your strongest intelligence areas based on Howard Gardner\'s Multiple Intelligence theory'
  },
  'personality-pattern': {
    name: 'Personality Pattern Assessment', 
    icon: User,
    description: 'Understand your behavioral patterns using the DISC personality model'
  },
  'vark': {
    name: 'VARK Learning Style Assessment',
    icon: BookOpen,
    description: 'Identify your preferred learning modalities'
  }
}

export default function DemoAssessmentPage() {
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null)
  const [assessmentState, setAssessmentState] = useState<DemoAssessmentState | null>(null)
  const [loading, setLoading] = useState(false)

  const startAssessment = async (testType: string) => {
    setLoading(true)
    try {
      // Start demo session
      const sessionResponse = await fetch('/api/demo/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType })
      })
      const sessionData = await sessionResponse.json()

      // Get questions for this test type
      const questionsResponse = await fetch(`/api/questions?test_type=${testType}&limit=5`)
      const questionsData = await questionsResponse.json()

      if (questionsData.questions && questionsData.questions.length > 0) {
        setAssessmentState({
          currentQuestionIndex: 0,
          questions: questionsData.questions,
          responses: {},
          testType,
          sessionId: sessionData.session.id,
          completed: false
        })
        setSelectedTestType(testType)
      } else {
        alert('No questions found for this test type')
      }
    } catch (error) {
      console.error('Failed to start assessment:', error)
      alert('Failed to start assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitResponse = (questionId: string, response: any) => {
    if (!assessmentState) return

    const newResponses = {
      ...assessmentState.responses,
      [questionId]: response
    }

    setAssessmentState({
      ...assessmentState,
      responses: newResponses
    })
  }

  const nextQuestion = () => {
    if (!assessmentState) return

    if (assessmentState.currentQuestionIndex < assessmentState.questions.length - 1) {
      setAssessmentState({
        ...assessmentState,
        currentQuestionIndex: assessmentState.currentQuestionIndex + 1
      })
    } else {
      // Complete assessment
      completeAssessment()
    }
  }

  const previousQuestion = () => {
    if (!assessmentState || assessmentState.currentQuestionIndex === 0) return

    setAssessmentState({
      ...assessmentState,
      currentQuestionIndex: assessmentState.currentQuestionIndex - 1
    })
  }

  const completeAssessment = async () => {
    if (!assessmentState) return

    setLoading(true)
    try {
      // Submit all responses
      const responses = Object.entries(assessmentState.responses).map(([questionId, response]) => ({
        questionId,
        response,
        testType: assessmentState.testType
      }))

      const resultResponse = await fetch('/api/demo/assessment/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: assessmentState.sessionId,
          testType: assessmentState.testType,
          responses
        })
      })

      const resultData = await resultResponse.json()
      
      setAssessmentState({
        ...assessmentState,
        completed: true
      })

      // Store results in localStorage for demo results page
      localStorage.setItem('demo-assessment-results', JSON.stringify({
        testType: assessmentState.testType,
        responses,
        results: resultData.results,
        sessionId: assessmentState.sessionId
      }))

    } catch (error) {
      console.error('Failed to complete assessment:', error)
      alert('Failed to complete assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = assessmentState?.questions[assessmentState.currentQuestionIndex]
  const progress = assessmentState ? ((assessmentState.currentQuestionIndex + 1) / assessmentState.questions.length) * 100 : 0
  const currentResponse = assessmentState && currentQuestion ? assessmentState.responses[currentQuestion.id] : null

  if (assessmentState?.completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-green-600">Assessment Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Congratulations! You've completed the {TEST_TYPES[assessmentState.testType as keyof typeof TEST_TYPES]?.name}.
            </p>
            <div className="space-y-3">
              <Link href="/demo/results">
                <Button className="w-full">View Your Results</Button>
              </Link>
              <Button variant="outline" onClick={() => {
                setAssessmentState(null)
                setSelectedTestType(null)
              }}>
                Take Another Assessment
              </Button>
              <Link href="/">
                <Button variant="ghost" className="w-full">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (assessmentState && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => {
                  setAssessmentState(null)
                  setSelectedTestType(null)
                }}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">
                    {TEST_TYPES[assessmentState.testType as keyof typeof TEST_TYPES]?.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Question {assessmentState.currentQuestionIndex + 1} of {assessmentState.questions.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Progress</div>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-xl font-medium mb-6 text-gray-800">
                {currentQuestion.question_text}
              </h2>

              {currentQuestion.question_type === 'rating_scale' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => submitResponse(currentQuestion.id, value)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        currentResponse === value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {value === 1 && 'Strongly Disagree'}
                          {value === 2 && 'Disagree'}
                          {value === 3 && 'Neutral'}
                          {value === 4 && 'Agree'}
                          {value === 5 && 'Strongly Agree'}
                        </span>
                        <span className="text-xl font-bold text-gray-400">{value}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => submitResponse(currentQuestion.id, option.value || option.text || option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        currentResponse === (option.value || option.text || option)
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.text || option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.question_type === 'multiselect' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: any, index: number) => {
                    const isSelected = Array.isArray(currentResponse) && 
                      currentResponse.includes(option.value || option.text || option)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const value = option.value || option.text || option
                          const current = Array.isArray(currentResponse) ? currentResponse : []
                          const newResponse = isSelected 
                            ? current.filter(item => item !== value)
                            : [...current, value]
                          submitResponse(currentQuestion.id, newResponse)
                        }}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded mr-3 border-2 ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="text-white text-xs">✓</div>}
                          </div>
                          {option.text || option}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={assessmentState.currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={nextQuestion}
              disabled={!currentResponse}
              loading={loading}
            >
              {assessmentState.currentQuestionIndex === assessmentState.questions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Test selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Assessment</h1>
          <p className="text-gray-600">
            Try our psychometric assessments without creating an account
          </p>
        </div>

        {/* Test Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(TEST_TYPES).map(([key, testType]) => {
            const Icon = testType.icon
            return (
              <Card key={key} className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-lg">{testType.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {testType.description}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => startAssessment(key)}
                    loading={loading && selectedTestType === key}
                  >
                    Start Demo
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Mode</h3>
            <p className="text-blue-800 text-sm">
              This is a shortened version with sample questions. Create an account for the full assessment experience with detailed results and progress tracking.
            </p>
            <Link href="/auth/signup">
              <Button className="mt-4" variant="outline">
                Create Account for Full Experience
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
