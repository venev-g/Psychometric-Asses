'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Lightbulb, Target, BookOpen, TrendingUp } from 'lucide-react'

interface Recommendation {
  type: 'strength' | 'development' | 'career' | 'learning'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[]
  userScores: any
}

export function RecommendationsPanel({ recommendations, userScores }: RecommendationsPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <TrendingUp className="w-5 h-5" />
      case 'development':
        return <Target className="w-5 h-5" />
      case 'career':
        return <Lightbulb className="w-5 h-5" />
      case 'learning':
        return <BookOpen className="w-5 h-5" />
      default:
        return <Lightbulb className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'text-green-600 bg-green-50'
      case 'development':
        return 'text-blue-600 bg-blue-50'
      case 'career':
        return 'text-purple-600 bg-purple-50'
      case 'learning':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'warning'
      case 'low':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.type]) acc[rec.type] = []
    acc[rec.type].push(rec)
    return acc
  }, {} as Record<string, Recommendation[]>)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Based on your assessment results, here are personalized recommendations to help you grow and develop.
          </p>
        </CardContent>
      </Card>

      {Object.entries(groupedRecommendations).map(([type, recs]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${getTypeColor(type)}`}>
              {getIcon(type)}
              <span className="capitalize">{type} Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recs.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(rec.priority)} size="sm">
                      {rec.priority} priority
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{rec.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Complete your assessment to receive personalized recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}