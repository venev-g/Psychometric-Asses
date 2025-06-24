'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import type { Question } from '@/types/assessment.types'

interface RatingScaleProps {
  question: Question
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  labels?: { min: string; max: string }
}

export function RatingScale({ 
  question, 
  value, 
  onChange, 
  min = 1, 
  max = 5,
  labels = { min: 'Strongly Disagree', max: 'Strongly Agree' }
}: RatingScaleProps) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">{question.questionText}</h3>
        
        <div className="space-y-4">
          {/* Scale Labels */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>{labels.min}</span>
            <span>{labels.max}</span>
          </div>
          
          {/* Rating Scale */}
          <div className="flex justify-between items-center">
            {scale.map((rating) => (
              <label
                key={rating}
                className="flex flex-col items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={rating}
                  checked={value === rating}
                  onChange={() => onChange(rating)}
                  className="sr-only"
                />
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  value === rating
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-600 group-hover:border-blue-300 group-hover:bg-blue-50'
                }`}>
                  {rating}
                </div>
                <span className="mt-2 text-xs text-gray-500">{rating}</span>
              </label>
            ))}
          </div>
          
          {/* Current Selection */}
          {value && (
            <div className="text-center text-sm text-gray-600">
              Selected: {value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}