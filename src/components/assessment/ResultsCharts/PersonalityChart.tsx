'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { PersonalityPatternScores } from '@/types/assessment.types'

interface PersonalityChartProps {
  scores: PersonalityPatternScores
  maxScore?: number
}

export function PersonalityChart({ scores, maxScore = 100 }: PersonalityChartProps) {
  const personalityTypes = [
    { 
      key: 'dominance', 
      label: 'Dominance (D)', 
      description: 'Direct, decisive, and competitive',
      color: 'bg-red-500',
      traits: ['Direct', 'Results-oriented', 'Competitive', 'Quick decision-maker']
    },
    { 
      key: 'influence', 
      label: 'Influence (I)', 
      description: 'Optimistic, outgoing, and people-focused',
      color: 'bg-yellow-500',
      traits: ['Optimistic', 'Persuasive', 'Social', 'Enthusiastic']
    },
    { 
      key: 'steadiness', 
      label: 'Steadiness (S)', 
      description: 'Patient, reliable, and team-oriented',
      color: 'bg-green-500',
      traits: ['Patient', 'Reliable', 'Team player', 'Good listener']
    },
    { 
      key: 'conscientiousness', 
      label: 'Conscientiousness (C)', 
      description: 'Analytical, careful, and detail-oriented',
      color: 'bg-blue-500',
      traits: ['Analytical', 'Systematic', 'Quality-focused', 'Careful']
    }
  ]

  const getDominantType = () => {
    const entries = Object.entries(scores) as [keyof PersonalityPatternScores, number][]
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0]
  }

  const dominantType = getDominantType()
  const dominantTypeInfo = personalityTypes.find(type => type.key === dominantType)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DISC Personality Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {personalityTypes.map(type => {
              const score = scores[type.key as keyof PersonalityPatternScores] || 0
              const percentage = (score / maxScore) * 100

              return (
                <div key={type.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-sm font-medium">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${type.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {dominantTypeInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Your Dominant Style: {dominantTypeInfo.label}</span>
              <Badge variant="primary">Primary</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{dominantTypeInfo.description}</p>
            
            <div>
              <h4 className="font-medium mb-2">Key Traits:</h4>
              <div className="flex flex-wrap gap-2">
                {dominantTypeInfo.traits.map(trait => (
                  <Badge key={trait} variant="outline" size="sm">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Score Breakdown:</h4>
              <div className="text-2xl font-bold">
                {scores[dominantType]}% {dominantTypeInfo.label}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personality Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalityTypes
              .map(type => ({
                ...type,
                score: scores[type.key as keyof PersonalityPatternScores] || 0
              }))
              .sort((a, b) => b.score - a.score)
              .map((type, index) => (
                <div key={type.key} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{type.score}%</span>
                    {index === 0 && <Badge variant="primary" size="sm">Primary</Badge>}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}