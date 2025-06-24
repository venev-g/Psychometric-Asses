// src/components/assessment/AssessmentFlow.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TestQuestion } from './TestQuestion'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

interface AssessmentFlowProps {
  sessionId: string
}

export function AssessmentFlow({ sessionId }: AssessmentFlowProps) {
  const [currentTest, setCurrentTest] = useState<any>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const router = useRouter()

  useEffect(() => {
    loadCurrentTest()
  }, [sessionId])

  const loadCurrentTest = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/assessments/session/${sessionId}/current`)
      const data = await response.json()
      
      if (!data.test) {
        // Assessment completed
        router.push(`/results/${sessionId}`)
        return
      }
      
      setCurrentTest(data.test)
      setStartTime(Date.now())
      setCurrentQuestionIndex(0)
      setResponses({})
    } catch (error) {
      console.error('Failed to load test:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (questionId: string, response: any) => {
    try {
      const responseTime = Date.now() - startTime
      
      await fetch(`/api/assessments/session/${sessionId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId, 
          response,
          responseTimeMs: responseTime
        })
      })
      
      setResponses(prev => ({ ...prev, [questionId]: response }))
    } catch (error) {
      console.error('Failed to submit response:', error)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setStartTime(Date.now())
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setStartTime(Date.now())
    }
  }

  const completeTest = async () => {
    try {
      setSubmitting(true)
      const response = await fetch(`/api/assessments/session/${sessionId}/complete-test`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.hasNextTest) {
        loadCurrentTest()
      } else {
        router.push(`/results/${sessionId}`)
      }
    } catch (error) {
      console.error('Failed to complete test:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!currentTest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>No test available</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === currentTest.questions.length - 1
  const allQuestionsAnswered = currentTest.questions.every((q: any) => responses[q.id] !== undefined)
  const currentQuestionAnswered = responses[currentQuestion?.id] !== undefined

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentTest.testType.name}</span>
            <span className="text-sm font-normal text-gray-500">
              Test {currentTest.currentIndex + 1} of {currentTest.totalTests}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress 
              value={currentTest.currentIndex + 1} 
              max={currentTest.totalTests}
              showPercentage
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {currentTest.questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / currentTest.questions.length) * 100)}% Complete</span>
            </div>
            <Progress 
              value={currentQuestionIndex + 1} 
              max={currentTest.questions.length}
            />
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      {currentTest.testType.instructions && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700">{currentTest.testType.instructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TestQuestion
            question={currentQuestion}
            onResponse={(response) => handleResponse(currentQuestion.id, response)}
            value={responses[currentQuestion.id]}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {!isLastQuestion ? (
                <Button
                  onClick={nextQuestion}
                  disabled={!currentQuestionAnswered}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={completeTest}
                  disabled={!allQuestionsAnswered || submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Completing...' : 'Complete Test'}
                </Button>
              )}
            </div>
          </div>

          {/* Question overview */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Question Overview</h4>
            <div className="grid grid-cols-10 gap-2">
              {currentTest.questions.map((q: any, index: number) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setStartTime(Date.now())
                  }}
                  className={`
                    w-8 h-8 rounded text-xs font-medium transition-colors
                    ${index === currentQuestionIndex 
                      ? 'bg-blue-600 text-white' 
                      : responses[q.id] !== undefined
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}