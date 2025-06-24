'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import type { Question, QuestionOption } from '@/types/assessment.types'

interface MultiselectProps {
  question: Question
  value: any[]
  onChange: (value: any[]) => void
}

export function Multiselect({ question, value = [], onChange }: MultiselectProps) {
  const handleToggle = (optionValue: any) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">{question.questionText}</h3>
        <p className="text-sm text-gray-600 mb-6">Select all that apply</p>
        
        <div className="space-y-3">
          {question.options?.map((option: QuestionOption, index: number) => (
            <label
              key={option.id || index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                value.includes(option.value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                value.includes(option.value)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {value.includes(option.value) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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