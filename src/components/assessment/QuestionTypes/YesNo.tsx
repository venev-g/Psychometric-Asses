'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Check, X } from 'lucide-react'
import type { Question } from '@/types/assessment.types'

interface YesNoProps {
  question: Question
  value: boolean | null
  onChange: (value: boolean) => void
}

export function YesNo({ question, value, onChange }: YesNoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">{question.questionText}</h3>
        
        <div className="flex justify-center space-x-8">
          <label className="cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={value === true}
              onChange={() => onChange(true)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center p-6 border-2 rounded-lg transition-all ${
              value === true
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}>
              <Check className={`w-8 h-8 mb-2 ${
                value === true ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className="text-lg font-medium">Yes</span>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={value === false}
              onChange={() => onChange(false)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center p-6 border-2 rounded-lg transition-all ${
              value === false
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}>
              <X className={`w-8 h-8 mb-2 ${
                value === false ? 'text-red-600' : 'text-gray-400'
              }`} />
              <span className="text-lg font-medium">No</span>
            </div>
          </label>
        </div>
      </CardContent>
    </Card>
  )
}