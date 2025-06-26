// src/app/assessment/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Brain, Clock, Target, CheckCircle } from 'lucide-react'

interface TestType {
  id: string
  name: string
  slug: string
  description: string
  estimated_duration_minutes: number
  instructions: string
}

interface Question {
  id: string
  question_text: string
  question_type: string
  category: string
  options?: any
  order_index: number
}

export default function AssessmentPage() {
  const [testTypes, setTestTypes] = useState<TestType[]>([])
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(true)
  const [testMode, setTestMode] = useState<'selection' | 'instructions' | 'questions' | 'results'>('selection')

  useEffect(() => {
    loadTestTypes()
  }, [])

  const loadTestTypes = async () => {
    try {
      const response = await fetch('/api/test-types')
      const data = await response.json()
      setTestTypes(data.testTypes || [])
    } catch (error) {
      console.error('Failed to load test types:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadQuestions = async (testTypeId: string) => {
    try {
      const response = await fetch(`/api/questions?testTypeId=${testTypeId}`)
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  const selectTest = async (test: TestType) => {
    setSelectedTest(test)
    setTestMode('instructions')
    await loadQuestions(test.id)
  }

  const startTest = () => {
    setTestMode('questions')
    setCurrentQuestionIndex(0)
    setResponses({})
  }

  const handleResponse = async (response: any) => {
    const currentQuestion = questions[currentQuestionIndex]
    const newResponses = {
      ...responses,
      [currentQuestion.id]: response
    }
    setResponses(newResponses)

    // Save response if we have a session
    try {
      const responseData = {
        sessionId: selectedTest?.id || 'demo-session',
        questionId: currentQuestion.id,
        responseValue: response,
        responseTimeMs: 2000 // Could track actual time
      }

      await fetch('/api/assessments/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      })
    } catch (error) {
      console.error('Failed to save response:', error)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Test completed - calculate results
      await calculateResults(newResponses)
    }
  }

  const calculateResults = async (finalResponses: any) => {
    try {
      const responsesArray = Object.entries(finalResponses).map(([questionId, responseValue]) => ({
        question_id: questionId,
        response_value: responseValue
      }))

      const response = await fetch('/api/assessments/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedTest?.id || 'demo-session',
          testTypeId: selectedTest?.id,
          responses: responsesArray
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Store results for display
        localStorage.setItem('assessment-results', JSON.stringify(data.results))
        setTestMode('results')
      }
    } catch (error) {
      console.error('Failed to calculate results:', error)
      setTestMode('results')
    }
  }

  const resetTest = () => {
    setSelectedTest(null)
    setTestMode('selection')
    setCurrentQuestionIndex(0)
    setResponses({})
    setQuestions([])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    )
  }

  const renderTestSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            Demo Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose an assessment to experience our platform. No login required for demo mode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testTypes.map(test => (
            <Card key={test.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => selectTest(test)}>
              <CardHeader>
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">
                      {test.name}
                    </CardTitle>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {test.estimated_duration_minutes} minutes
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{test.description}</p>
                <Button className="w-full group-hover:bg-blue-700">
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {testTypes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No assessments available</p>
            <p className="text-gray-400">Please check back later or contact support</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderInstructions = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-700">{selectedTest?.name}</CardTitle>
            <p className="text-gray-600 mt-2">{selectedTest?.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Instructions</h3>
              <p className="text-blue-700">{selectedTest?.instructions}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>Estimated time: {selectedTest?.estimated_duration_minutes} minutes</span>
              </div>
              <Badge variant="secondary">
                {questions.length} questions
              </Badge>
            </div>

            <div className="flex gap-4 pt-6">
              <Button variant="outline" onClick={resetTest} className="flex-1">
                Choose Different Test
              </Button>
              <Button onClick={startTest} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderQuestions = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{selectedTest?.name}</h1>
              <Badge variant="secondary">
                {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion?.question_text}
              </CardTitle>
              {currentQuestion?.category && (
                <Badge variant="outline" className="w-fit mt-2">
                  {currentQuestion.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {currentQuestion?.question_type === 'rating_scale' && (
                <div className="space-y-3">
                  <p className="text-gray-600 mb-4">Rate from 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Button
                        key={rating}
                        variant="outline"
                        className="flex-1 h-16 text-lg hover:bg-blue-50"
                        onClick={() => handleResponse(rating)}
                      >
                        {rating}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Strongly Disagree</span>
                    <span>Neutral</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              )}

              {currentQuestion?.question_type === 'multiple_choice' && currentQuestion?.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: any, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto py-4 px-6 hover:bg-blue-50"
                      onClick={() => handleResponse(option.value || option)}
                    >
                      {option.text || option}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderResults = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Assessment Complete!</CardTitle>
            <p className="text-gray-600 mt-2">You have successfully completed the {selectedTest?.name}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Demo Results</h3>
              <p className="text-blue-700 mb-4">
                This is a demo assessment. In the full version, you would receive:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li>• Detailed score breakdown by category</li>
                <li>• Personalized insights and recommendations</li>
                <li>• Comparison with peers and benchmarks</li>
                <li>• Action plans for improvement</li>
                <li>• Progress tracking over time</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Your Responses</h4>
              <p className="text-gray-600">Answered {Object.keys(responses).length} out of {questions.length} questions</p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button variant="outline" onClick={resetTest} className="flex-1">
                Try Another Assessment
              </Button>
              <Button onClick={() => window.location.href = '/auth/signup'} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Create Account for Full Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  switch (testMode) {
    case 'selection':
      return renderTestSelection()
    case 'instructions':
      return renderInstructions()
    case 'questions':
      return renderQuestions()
    case 'results':
      return renderResults()
    default:
      return renderTestSelection()
  }
}
