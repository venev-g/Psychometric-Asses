'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'

interface NavigationControlsProps {
  currentIndex: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onComplete: () => void
  hasResponse: boolean
  isLastQuestion: boolean
  loading?: boolean
}

export function NavigationControls({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onComplete,
  hasResponse,
  isLastQuestion,
  loading = false
}: NavigationControlsProps) {
  const isFirstQuestion = currentIndex === 0

  return (
    <div className="flex items-center justify-between p-6 border-t bg-white">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || loading}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </Button>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        
        <div className="flex space-x-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex
                  ? 'bg-blue-600'
                  : i < currentIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {isLastQuestion ? (
        <Button
          onClick={onComplete}
          disabled={!hasResponse || loading}
          className="flex items-center space-x-2"
        >
          <Flag className="w-4 h-4" />
          <span>{loading ? 'Submitting...' : 'Complete Test'}</span>
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!hasResponse || loading}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}