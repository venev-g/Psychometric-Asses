'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Eye, Ear, BookOpen, Hand } from 'lucide-react'
import type { VarkScores } from '@/types/assessment.types'

interface VarkChartProps {
  scores: VarkScores
  maxScore?: number
}

export function VarkChart({ scores, maxScore = 100 }: VarkChartProps) {
  const learningStyles = [
    { 
      key: 'visual', 
      label: 'Visual', 
      description: 'Learn best through seeing and visualizing',
      color: 'bg-purple-500',
      icon: Eye,
      tips: ['Use diagrams and charts', 'Take visual notes', 'Watch videos', 'Use color coding']
    },
    { 
      key: 'auditory', 
      label: 'Auditory', 
      description: 'Learn best through hearing and listening',
      color: 'bg-blue-500',
      icon: Ear,
      tips: ['Listen to recordings', 'Discuss topics aloud', 'Use mnemonics', 'Study with music']
    },
    { 
      key: 'readingWriting', 
      label: 'Reading/Writing', 
      description: 'Learn best through reading and writing',
      color: 'bg-green-500',
      icon: BookOpen,
      tips: ['Take detailed notes', 'Read extensively', 'Write summaries', 'Make lists']
    },
    { 
      key: 'kinesthetic', 
      label: 'Kinesthetic', 
      description: 'Learn best through hands-on experience',
      color: 'bg-orange-500',
      icon: Hand,
      tips: ['Use hands-on activities', 'Take breaks while studying', 'Use real examples', 'Practice actively']
    }
  ]

  const getDominantStyle = () => {
    const entries = Object.entries(scores) as [keyof VarkScores, number][]
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0]
  }

  const dominantStyle = getDominantStyle()
  const dominantStyleInfo = learningStyles.find(style => style.key === dominantStyle)

  const isMultimodal = () => {
    const sortedScores = Object.values(scores).sort((a, b) => b - a)
    return sortedScores[0] - sortedScores[1] < 10 // If top 2 scores are within 10 points
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VARK Learning Style Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {learningStyles.map(style => {
              const score = scores[style.key as keyof VarkScores] || 0
              const percentage = (score / maxScore) * 100
              const Icon = style.icon

              return (
                <div key={style.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{style.label}</span>
                    </div>
                    <span className="text-sm font-medium">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${style.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{style.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {dominantStyleInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <dominantStyleInfo.icon className="w-5 h-5" />
              <span>Your Learning Style: {dominantStyleInfo.label}</span>
              {isMultimodal() && <Badge variant="secondary">Multimodal</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{dominantStyleInfo.description}</p>
            
            {isMultimodal() && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Multimodal Learner:</strong> You have balanced preferences across multiple learning styles, 
                  which means you can adapt your learning approach based on the situation.
                </p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Learning Tips:</h4>
              <div className="grid grid-cols-2 gap-2">
                {dominantStyleInfo.tips.map(tip => (
                  <div key={tip} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Score: {scores[dominantStyle]}%</h4>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${dominantStyleInfo.color}`}
                  style={{ width: `${(scores[dominantStyle] / maxScore) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Learning Style Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {learningStyles
              .map(style => ({
                ...style,
                score: scores[style.key as keyof VarkScores] || 0
              }))
              .sort((a, b) => b.score - a.score)
              .map((style, index) => {
                const Icon = style.icon
                return (
                  <div key={style.key} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{style.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{style.score}%</span>
                      {index === 0 && <Badge variant="default" size="sm">Preferred</Badge>}
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}