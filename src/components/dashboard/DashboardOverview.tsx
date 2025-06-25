// src/components/dashboard/DashboardOverview.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, 
  User, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  BarChart3,
  Play,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'

interface DashboardOverviewProps {
  user: any
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [sessions, setSessions] = useState<any[]>([])
  const [configurations, setConfigurations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    totalAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
    streakDays: 0,
    lastAssessment: null
  })

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
      
      // Calculate user stats
      const completedSessions = sessionsData.sessions?.filter((s: any) => s.status === 'completed') || []
      const totalAssessments = sessionsData.sessions?.length || 0
      const averageScore = completedSessions.length > 0 
        ? completedSessions.reduce((acc: number, session: any) => acc + (session.average_score || 0), 0) / completedSessions.length
        : 0
      
      setUserStats({
        totalAssessments,
        completedAssessments: completedSessions.length,
        averageScore: Math.round(averageScore),
        streakDays: 3, // Mock data - would calculate from actual data
        lastAssessment: completedSessions.length > 0 ? completedSessions[0].completed_at : null
      })
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

  const getTestTypeIcon = (testType: string) => {
    switch (testType.toLowerCase()) {
      case 'intelligence':
        return <Brain className="w-5 h-5" />
      case 'personality':
        return <User className="w-5 h-5" />
      case 'vark':
        return <BookOpen className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>
      case 'started':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Started</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
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
      {/* Welcome Header with Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg font-semibold">
                  {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.user_metadata?.full_name || 'Student'}
                </h2>
                <p className="text-gray-600">Psychometric Assessment Student</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">Level {Math.floor(userStats.completedAssessments / 3) + 1}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.completedAssessments}</div>
                <div className="text-xs text-gray-600">Tests Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.streakDays}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 mb-4">
              Ready to discover more about yourself? Take a new assessment or continue where you left off.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Start New Test
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Assessments</p>
                <p className="text-2xl font-bold text-blue-900">{userStats.totalAssessments}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{userStats.completedAssessments}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Average Score</p>
                <p className="text-2xl font-bold text-purple-900">{userStats.averageScore}%</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Available Tests</p>
                <p className="text-2xl font-bold text-orange-900">{configurations.length}</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - In Progress & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* In Progress Assessments */}
          {inProgressSessions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Continue Your Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inProgressSessions.map((session: any) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            {getTestTypeIcon(session.test_configurations?.name)}
                            <div>
                              <h4 className="font-semibold text-gray-900">{session.test_configurations?.name}</h4>
                              <p className="text-sm text-gray-600">
                                Started {new Date(session.started_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{session.current_test_index} of {session.total_tests} tests</span>
                          </div>
                          <Progress 
                            value={(session.current_test_index / session.total_tests) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div className="mt-3">
                          <Button size="sm" className="w-full" asChild>
                            <Link href={`/assessment/${session.id}`}>
                              Continue Assessment
                            </Link>
                          </Button>
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
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                  Available Assessments
                </CardTitle>
                <p className="text-gray-600">Choose from our comprehensive psychometric tests</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {configurations.map((config: any) => (
                    <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getTestTypeIcon(config.name)}
                          <h4 className="font-semibold text-gray-900">{config.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {config.time_limit_minutes || 15} min
                        </Badge>
                      </div>
                      {config.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{config.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <span className="flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            {config.max_attempts || 1} attempt{config.max_attempts !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => startNewAssessment(config.id)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Recent Activity & Quick Stats */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedSessions.slice(0, 3).map((session: any) => (
                    <div key={session.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Completed {session.test_configurations?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {completedSessions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/results/history">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View All Results
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Update Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile/settings">
                      <Target className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{userStats.totalAssessments > 0 ? Math.round((userStats.completedAssessments / userStats.totalAssessments) * 100) : 0}%</span>
                    </div>
                    <Progress 
                      value={userStats.totalAssessments > 0 ? (userStats.completedAssessments / userStats.totalAssessments) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Performance</span>
                      <span>{userStats.averageScore}%</span>
                    </div>
                    <Progress 
                      value={userStats.averageScore} 
                      className="h-2 bg-gray-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}