'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { DominantIntelligenceScores } from '@/types/assessment.types'

interface IntelligenceChartProps {
  scores: DominantIntelligenceScores
  maxScore?: number
}

export function IntelligenceChart({ scores, maxScore = 100 }: IntelligenceChartProps) {
  const intelligenceTypes = [
    { key: 'linguistic', label: 'Linguistic', description: 'Word smart - good with language and words' },
    { key: 'logicalMathematical', label: 'Logical-Mathematical', description: 'Number smart - good with logic, numbers, and reasoning' },
    { key: 'spatial', label: 'Spatial', description: 'Picture smart - good with images and space' },
    { key: 'bodilyKinesthetic', label: 'Bodily-Kinesthetic', description: 'Body smart - good with movement and physical activity' },
    { key: 'musical', label: 'Musical', description: 'Music smart - good with rhythm, music, and hearing' },
    { key: 'interpersonal', label: 'Interpersonal', description: 'People smart - good with understanding others' },
    { key: 'intrapersonal', label: 'Intrapersonal', description: 'Self smart - good with understanding yourself' },
    { key: 'naturalistic', label: 'Naturalistic', description: 'Nature smart - good with nature and environment' }
  ]

  const getBarColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getScoreLevel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return { level: 'Dominant', color: 'success' }
    if (percentage >= 60) return { level: 'Strong', color: 'primary' }
    if (percentage >= 40) return { level: 'Moderate', color: 'warning' }
    return { level: 'Developing', color: 'secondary' }
  }

  const topIntelligences = intelligenceTypes
    .map(type => ({
      ...type,
      score: scores[type.key as keyof DominantIntelligenceScores] || 0
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multiple Intelligence Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intelligenceTypes.map(type => {
              const score = scores[type.key as keyof DominantIntelligenceScores] || 0
              const percentage = (score / maxScore) * 100
              const scoreLevel = getScoreLevel(score, maxScore)

              return (
                <div key={type.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{type.label}</span>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={scoreLevel.color as any}>
                        {scoreLevel.level}
                      </Badge>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getBarColor(score, maxScore)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Top 3 Intelligences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topIntelligences.map((intelligence, index) => (
              <div key={intelligence.key} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{intelligence.label}</h4>
                  <p className="text-sm text-gray-600">{intelligence.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{intelligence.score}%</div>
                  <Badge variant={getScoreLevel(intelligence.score, maxScore).color as any} size="sm">
                    {getScoreLevel(intelligence.score, maxScore).level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}