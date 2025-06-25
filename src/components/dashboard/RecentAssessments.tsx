'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Eye, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

interface RecentAssessment {
  id: string
  configurationName: string
  status: 'completed' | 'in_progress' | 'abandoned'
  completedAt?: string
  startedAt: string
  duration?: number
  score?: number
}

interface RecentAssessmentsProps {
  assessments: RecentAssessment[]
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'abandoned': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in_progress': return 'In Progress'
      case 'abandoned': return 'Abandoned'
      default: return 'Unknown'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Assessments</CardTitle>
          <Link href="/results/history">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No assessments yet</p>
            <Link href="/test/start">
              <Button>Start Your First Assessment</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{assessment.configurationName}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {assessment.status === 'completed' && assessment.completedAt
                            ? formatDate(assessment.completedAt)
                            : formatDate(assessment.startedAt)
                          }
                        </span>
                      </div>
                      {assessment.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(assessment.duration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(assessment.status) as any} size="sm">
                    {getStatusText(assessment.status)}
                  </Badge>
                </div>

                {assessment.score && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Overall Score</div>
                    <div className="text-lg font-bold text-green-600">{assessment.score}%</div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {assessment.status === 'completed' && (
                    <Link href={`/results/${assessment.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Results
                      </Button>
                    </Link>
                  )}
                  {assessment.status === 'in_progress' && (
                    <Link href={`/assessment/${assessment.id}`}>
                      <Button size="sm">
                        Continue
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}