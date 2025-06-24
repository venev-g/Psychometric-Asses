// src/components/assessment/TestQuestion.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Question } from '@/types/assessment.types'

interface TestQuestionProps {
  question: Question
  onResponse: (response: any) => void
  value?: any
  disabled?: boolean
}

export function TestQuestion({ question, onResponse, value, disabled = false }: TestQuestionProps) {
  const [selectedValue, setSelectedValue] = useState(value)

  const handleResponse = (response: any) => {
    setSelectedValue(response)
    onResponse(response)
  }

  const renderQuestionInput = () => {
    switch (question.questionType) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={(e) => handleResponse(e.target.value)}
                  disabled={disabled}
                  className="text-blue-600"
                />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
          </div>
        )

      case 'rating_scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={rating}
                    checked={selectedValue === rating}
                    onChange={(e) => handleResponse(parseInt(e.target.value))}
                    disabled={disabled}
                    className="mb-2"
                  />
                  <span className="text-xs">{rating}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'yes_no':
        return (
          <div className="flex space-x-4">
            {[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' }
            ].map((option) => (
              <label
                key={option.label}
                className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={selectedValue === option.value}
                  onChange={() => handleResponse(option.value)}
                  disabled={disabled}
                  className="text-blue-600"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(selectedValue) && selectedValue.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(selectedValue) ? selectedValue : []
                    if (e.target.checked) {
                      handleResponse([...currentValues, option.value])
                    } else {
                      handleResponse(currentValues.filter(v => v !== option.value))
                    }
                  }}
                  disabled={disabled}
                  className="text-blue-600"
                />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
          </div>
        )

      default:
        return <div>Unsupported question type</div>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {question.questionText}
        </CardTitle>
        {question.category && (
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {question.category}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderQuestionInput()}
      </CardContent>
    </Card>
  )
}