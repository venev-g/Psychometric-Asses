// src/components/assessment/ResultsDisplay.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

interface ResultsDisplayProps {
  results: any[]
  session: any
}

export function ResultsDisplay({ results, session }: ResultsDisplayProps) {
  const renderDominantIntelligenceResults = (result: any) => {
    const scores = result.processed_scores
    const recommendations = result.recommendations

    return (
      <div className="space-y-6">
        {/* Intelligence Scores */}
        <div>
          <h4 className="font-semibold mb-4">Your Intelligence Profile</h4>
          <div className="space-y-3">
            {Object.entries(scores).map(([intelligence, score]: [string, any]) => (
              <div key={intelligence} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{intelligence.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{score}%</span>
                </div>
                <Progress value={score} max={100} />
              </div>
            ))}
          </div>
        </div>

        {/* Primary Intelligence */}
        <div>
          <h4 className="font-semibold mb-2">Primary Intelligence</h4>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 capitalize">
              {recommendations.primaryIntelligence?.type?.replace(/([A-Z])/g, ' $1').trim()}
            </h5>
            <p className="text-sm text-blue-800 mt-1">
              {recommendations.primaryIntelligence?.description}
            </p>
          </div>
        </div>

        {/* Career Suggestions */}
        {recommendations.careerSuggestions?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Career Suggestions</h4>
            <div className="grid grid-cols-2 gap-2">
              {recommendations.careerSuggestions.map((career: string, index: number) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  {career}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Strategies */}
        {recommendations.learningStrategies?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Learning Strategies</h4>
            <ul className="space-y-1">
              {recommendations.learningStrategies.map((strategy: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderPersonalityPatternResults = (result: any) => {
    const scores = result.processed_scores
    const recommendations = result.recommendations

    return (
      <div className="space-y-6">
        {/* DISC Scores */}
        <div>
          <h4 className="font-semibold mb-4">Your Personality Pattern (DISC)</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(scores).map(([style, score]: [string, any]) => (
              <div key={style} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${(score / 100) * 188.5} 188.5`}
                      className="text-blue-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{score}%</span>
                  </div>
                </div>
                <div className="text-sm font-medium capitalize">
                  {style}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Style */}
        <div>
          <h4 className="font-semibold mb-2">Primary Style</h4>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-medium text-purple-900">
              {recommendations.primaryStyle?.type?.toUpperCase()}
            </h5>
            <p className="text-sm text-purple-800 mt-1">
              {recommendations.primaryStyle?.description}
            </p>
          </div>
        </div>

        {/* Working Style Tips */}
        {recommendations.workingStyleTips?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Working Style Tips</h4>
            <ul className="space-y-1">
              {recommendations.workingStyleTips.map((tip: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Communication Preferences */}
        {recommendations.communicationPreferences?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Communication Preferences</h4>
            <ul className="space-y-1">
              {recommendations.communicationPreferences.map((pref: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {pref}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderVarkResults = (result: any) => {
    const scores = result.processed_scores
    const recommendations = result.recommendations

    return (
      <div className="space-y-6">
        {/* Learning Style Scores */}
        <div>
          <h4 className="font-semibold mb-4">Your Learning Style (VARK)</h4>
          <div className="space-y-3">
            {Object.entries(scores).map(([style, score]: [string, any]) => (
              <div key={style} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {style === 'readingWriting' ? 'Reading/Writing' : style}
                  </span>
                  // src/components/assessment/ResultsDisplay.tsx (continued)
                  <span>{score}%</span>
                </div>
                <Progress value={score} max={100} />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Profile */}
        <div>
          <h4 className="font-semibold mb-2">Learning Profile</h4>
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900">
              {recommendations.learningProfile}
            </h5>
          </div>
        </div>

        {/* Preferred Styles */}
        {recommendations.preferredStyles?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Preferred Learning Styles</h4>
            <div className="space-y-3">
              {recommendations.preferredStyles.map((styleData: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium capitalize">
                      {styleData.style === 'readingWriting' ? 'Reading/Writing' : styleData.style}
                    </span>
                    <span className="text-sm text-gray-600">{styleData.percentage}%</span>
                  </div>
                  <p className="text-sm text-gray-700">{styleData.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Techniques */}
        {recommendations.studyTechniques?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recommended Study Techniques</h4>
            <ul className="space-y-1">
              {recommendations.studyTechniques.map((technique: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  {technique}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Note-taking Strategies */}
        {recommendations.noteInformation?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Note-taking Strategies</h4>
            <ul className="space-y-1">
              {recommendations.noteInformation.map((strategy: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderTestResult = (result: any, index: number) => {
    const testType = result.test_types
    let content

    switch (testType.slug) {
      case 'dominant-intelligence':
        content = renderDominantIntelligenceResults(result)
        break
      case 'personality-pattern':
        content = renderPersonalityPatternResults(result)
        break
      case 'vark':
        content = renderVarkResults(result)
        break
      default:
        content = <div>Unknown test type</div>
    }

    return (
      <motion.div
        key={result.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{testType.name}</CardTitle>
            {testType.description && (
              <p className="text-sm text-gray-600">{testType.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
            <div className="text-sm text-gray-600">
              <p>Completed on: {new Date(session.completed_at).toLocaleDateString()}</p>
              <p>Total time: {Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / (1000 * 60))} minutes</p>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Results */}
      <div className="space-y-6">
        {results.map((result, index) => renderTestResult(result, index))}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.print()}
                variant="outline"
              >
                Print Results
              </Button>
              <Button
                onClick={() => {
                  const data = JSON.stringify({ results, session }, null, 2)
                  const blob = new Blob([data], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `assessment-results-${session.id}.json`
                  a.click()
                }}
                variant="outline"
              >
                Download Results
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}