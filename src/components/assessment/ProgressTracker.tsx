'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Clock, CheckCircle, Circle } from 'lucide-react'

interface ProgressTrackerProps {
  currentTest: string
  currentTestIndex: number
  totalTests: number
  currentQuestionIndex: number
  totalQuestions: number
  timeRemaining?: number
  completedTests: string[]
}

export function ProgressTracker({
  currentTest,
  currentTestIndex,
  totalTests,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  completedTests
}: ProgressTrackerProps) {
  const overallProgress = ((currentTestIndex * 100) + 
    (currentQuestionIndex / totalQuestions * 100)) / totalTests

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Assessment Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Current Test Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Current Test</span>
            <span>
              {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <Progress 
            value={(currentQuestionIndex + 1) / totalQuestions * 100} 
            className="h-2"
          />
        </div>

        {/* Time Remaining */}
        {timeRemaining !== undefined && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Time remaining: {formatTime(timeRemaining)}</span>
          </div>
        )}

        {/* Test List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Tests</h4>
          {Array.from({ length: totalTests }, (_, index) => {
            const isCompleted = completedTests.includes(`test-${index}`)
            const isCurrent = index === currentTestIndex
            const isUpcoming = index > currentTestIndex

            return (
              <div
                key={index}
                className={`flex items-center space-x-2 p-2 rounded ${
                  isCurrent
                    ? 'bg-blue-50 border border-blue-200'
                    : isCompleted
                    ? 'bg-green-50'
                    : 'bg-gray-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className={`w-4 h-4 ${
                    isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                )}
                <span className={`text-sm ${
                  isCurrent ? 'font-medium text-blue-900' : 
                  isCompleted ? 'text-green-700' : 
                  'text-gray-600'
                }`}>
                  {index === currentTestIndex ? currentTest : `Test ${index + 1}`}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}