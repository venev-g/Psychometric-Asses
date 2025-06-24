'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import type { Question, QuestionOption } from '@/types/assessment.types'

interface MultipleChoiceProps {
  question: Question
  value: any
  onChange: (value: any) => void
}

export function MultipleChoice({ question, value, onChange }: MultipleChoiceProps) {
  const handleSelect = (optionValue: any) => {
    onChange(optionValue)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">{question.questionText}</h3>
        
        <div className="space-y-3">
          {question.options?.map((option: QuestionOption, index: number) => (
            <label
              key={option.id || index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                value === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleSelect(option.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                value === option.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}