'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Brain, User, BookOpen, ArrowLeft, Share2, Download } from 'lucide-react'
import Link from 'next/link'

const TEST_TYPE_INFO = {
  'dominant-intelligence': {
    name: 'Dominant Intelligence Assessment',
    icon: Brain,
    description: 'Based on Howard Gardner\'s Multiple Intelligence Theory'
  },
  'personality-pattern': {
    name: 'Personality Pattern Assessment',
    icon: User,
    description: 'DISC Personality Model Analysis'
  },
  'vark': {
    name: 'VARK Learning Style Assessment',
    icon: BookOpen,
    description: 'Learning Modality Preferences'
  }
}

export default function DemoResultsPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load results from localStorage
    const savedResults = localStorage.getItem('demo-assessment-results')
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setResults(parsedResults)
      } catch (error) {
        console.error('Failed to parse saved results:', error)
      }
    }
    setLoading(false)
  }, [])

  const getTopScores = (scores: any) => {
    if (!scores) return []
    
    return Object.entries(scores)
      .map(([key, value]) => ({ key, value: value as number }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }

  const formatCategoryName = (category: string) => {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Logical Mathematical', 'Logical-Mathematical')
      .replace('Bodily Kinesthetic', 'Bodily-Kinesthetic')
      .replace('Reading Writing', 'Reading/Writing')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Dominant', color: 'green' }
    if (score >= 60) return { level: 'Strong', color: 'blue' }
    if (score >= 40) return { level: 'Moderate', color: 'yellow' }
    return { level: 'Developing', color: 'gray' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-6">
              You need to complete an assessment first to view results.
            </p>
            <Link href="/demo/assessment">
              <Button>Take Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const testInfo = TEST_TYPE_INFO[results.testType as keyof typeof TEST_TYPE_INFO]
  const Icon = testInfo?.icon || Brain
  const topScores = getTopScores(results.results?.scores)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/demo/assessment">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Take Another Assessment
            </Button>
          </Link>
          <div className="flex justify-center items-center mb-4">
            <Icon className="w-12 h-12 text-blue-600 mr-3" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">{testInfo?.name}</h1>
              <p className="text-gray-600">{testInfo?.description}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Demo Results ✨
          </Badge>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center">Your Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{Object.keys(results.results?.scores || {}).length}</div>
                <div className="text-sm text-gray-600">Categories Assessed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(Object.values(results.results?.scores || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0) / Object.keys(results.results?.scores || {}).length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{topScores[0]?.key ? formatCategoryName(topScores[0].key) : 'N/A'}</div>
                <div className="text-sm text-gray-600">Top Strength</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scores Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Your Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.results?.scores || {}).map(([category, score]: [string, any]) => {
                  const percentage = Math.round(score)
                  const scoreInfo = getScoreLevel(percentage)
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formatCategoryName(category)}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{percentage}%</span>
                          <Badge 
                            variant="outline" 
                            className={`text-${scoreInfo.color}-800 bg-${scoreInfo.color}-100`}
                          >
                            {scoreInfo.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {results.results?.recommendations ? (
                <div className="space-y-4">
                  {results.results.recommendations.overview && (
                    <div>
                      <h4 className="font-medium mb-2">Overview</h4>
                      <p className="text-gray-600 text-sm">{results.results.recommendations.overview}</p>
                    </div>
                  )}
                  
                  {results.results.recommendations.strengths && (
                    <div>
                      <h4 className="font-medium mb-2 text-green-700">Key Strengths</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {results.results.recommendations.strengths.slice(0, 3).map((strength: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.results.recommendations.suggestions && (
                    <div>
                      <h4 className="font-medium mb-2 text-blue-700">Development Areas</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {results.results.recommendations.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Detailed recommendations will be available in the full version.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-yellow-900 mb-2">Want the Full Experience?</h3>
            <p className="text-yellow-800 text-sm mb-4">
              Create an account to get detailed analysis, track your progress, and access personalized learning recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/signup">
                <Button>Create Free Account</Button>
              </Link>
              <Link href="/demo/assessment">
                <Button variant="outline">Try Another Assessment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
