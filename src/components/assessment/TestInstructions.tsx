'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Clock, Users, FileText, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TestConfiguration {
  id: string
  name: string
  description: string
  maxAttempts: number
  timeLimitMinutes?: number
  testSequences: Array<{
    testTypes: {
      name: string
      description: string
      estimatedDurationMinutes: number
    }
  }>
}

interface TestInstructionsProps {
  configurations: TestConfiguration[]
}

export function TestInstructions({ configurations }: TestInstructionsProps) {
  const router = useRouter()
  const [selectedConfig, setSelectedConfig] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const startAssessment = async () => {
    if (!selectedConfig) return

    try {
      setLoading(true)
      
      const response = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configurationId: selectedConfig })
      })

      if (!response.ok) {
        throw new Error('Failed to start assessment')
      }

      const { sessionId } = await response.json()
      router.push(`/assessment/${sessionId}`)
    } catch (error) {
      console.error('Error starting assessment:', error)
      alert('Failed to start assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedConfiguration = configurations.find(c => c.id === selectedConfig)
  const totalDuration = selectedConfiguration?.testSequences.reduce(
    (total, seq) => total + seq.testTypes.estimatedDurationMinutes, 0
  ) || 0

  return (
    <div className="space-y-6">
      {/* Configuration Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {configurations.map(config => (
            <label
              key={config.id}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedConfig === config.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="configuration"
                value={config.id}
                checked={selectedConfig === config.id}
                onChange={(e) => setSelectedConfig(e.target.value)}
                className="sr-only"
              />
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{config.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {config.testSequences.reduce((total, seq) => 
                      total + seq.testTypes.estimatedDurationMinutes, 0
                    )} min
                  </Badge>
                  <Badge variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    {config.testSequences.length} tests
                  </Badge>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{config.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Included Assessments:</h4>
                {config.testSequences.map((seq, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>• {seq.testTypes.name}</span>
                    <span>{seq.testTypes.estimatedDurationMinutes} min</span>
                  </div>
                ))}
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Instructions */}
      {selectedConfiguration && (
        <Card>
          <CardHeader>
            <CardTitle>Important Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium">Time Limit</div>
                  <div className="text-sm text-gray-600">
                    {selectedConfiguration.timeLimitMinutes 
                      ? `${selectedConfiguration.timeLimitMinutes} minutes total`
                      : 'No time limit'
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium">Attempts</div>
                  <div className="text-sm text-gray-600">
                    {selectedConfiguration.maxAttempts} maximum
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
                <div>
                  <div className="font-medium">Duration</div>
                  <div className="text-sm text-gray-600">
                    ~{totalDuration} minutes
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Before you begin:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Find a quiet environment where you won't be interrupted</li>
                <li>Answer honestly - there are no right or wrong answers</li>
                <li>Go with your first instinct rather than overthinking</li>
                <li>Complete all questions for accurate results</li>
                <li>You can pause and resume later if needed</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Your responses will be saved automatically as you progress. 
                You can safely close your browser and return to complete the assessment later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          onClick={startAssessment}
          disabled={!selectedConfig || loading}
          size="lg"
          className="flex items-center space-x-2"
        >
          <span>{loading ? 'Starting Assessment...' : 'Start Assessment'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}