// src/components/dashboard/DashboardOverview.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface DashboardOverviewProps {
  user: any
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [sessions, setSessions] = useState<any[]>([])
  const [configurations, setConfigurations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user sessions
      const sessionsResponse = await fetch('/api/assessments/sessions')
      const sessionsData = await sessionsResponse.json()
      setSessions(sessionsData.sessions || [])
      
      // Load available configurations
      const configsResponse = await fetch('/api/configurations')
      const configsData = await configsResponse.json()
      setConfigurations(configsData.configurations || [])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startNewAssessment = async (configurationId: string) => {
    try {
      const response = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configurationId })
      })
      
      const data = await response.json()
      if (data.success) {
        window.location.href = `/assessment/${data.session.id}`
      }
    } catch (error) {
      console.error('Failed to start assessment:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const completedSessions = sessions.filter((s: any) => s.status === 'completed')
  const inProgressSessions = sessions.filter((s: any) => s.status === 'in_progress' || s.status === 'started')

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome back, {user?.user_metadata?.full_name || 'User'}!
            </CardTitle>
            <p className="text-gray-600">
              Track your psychometric assessments and explore your personality insights.
            </p>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completed Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Available Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{configurations.length}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* In Progress Assessments */}
      {inProgressSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Continue Your Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressSessions.map((session: any) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{session.test_configurations?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Started: {new Date(session.started_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="default" asChild>
                        <Link href={`/assessment/${session.id}`}>
                          Continue
                        </Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{session.current_test_index} of {session.total_tests} tests</span>
                      </div>
                      <Progress 
                        value={session.current_test_index} 
                        max={session.total_tests}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Available Assessments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Start New Assessment</CardTitle>
            <p className="text-gray-600">Choose from our available psychometric tests</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {configurations.map((config: any) => (
                <div key={config.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{config.name}</h4>
                  {config.description && (
                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {config.time_limit_minutes && (
                        <span>~{config.time_limit_minutes} minutes</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => startNewAssessment(config.id)}
                    >
                      Start Assessment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Results */}
      {completedSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedSessions.slice(0, 5).map((session: any) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{session.test_configurations?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Completed: {new Date(session.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/results/${session.id}`}>
                          View Results
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {completedSessions.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/history">View All Results</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}