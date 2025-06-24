'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, Clock, Target } from 'lucide-react'

interface AssessmentProgress {
  id: string
  name: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  lastActivity?: string
  estimatedTimeRemaining?: number
}

interface ProgressSummaryProps {
  assessments: AssessmentProgress[]
  overallProgress: number
}

export function ProgressSummary({ assessments, overallProgress }: ProgressSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'not_started': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in_progress': return 'In Progress'
      case 'not_started': return 'Not Started'
      default: return 'Unknown'
    }
  }

  const totalAssessments = assessments.length
  const completedAssessments = assessments.filter(a => a.status === 'completed').length
  const inProgressAssessments = assessments.filter(a => a.status === 'in_progress').length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Assessment Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedAssessments}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{inProgressAssessments}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{totalAssessments}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{assessment.name}</span>
                    <Badge variant={getStatusColor(assessment.status) as any} size="sm">
                      {getStatusText(assessment.status)}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{assessment.progress}%</span>
                </div>
                
                <Progress value={assessment.progress} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {assessment.lastActivity && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last activity: {assessment.lastActivity}</span>
                    </div>
                  )}
                  {assessment.estimatedTimeRemaining && (
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3" />
                      <span>{assessment.estimatedTimeRemaining} min remaining</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}