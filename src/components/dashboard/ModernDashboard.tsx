'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage, EnhancedAvatar } from '@/components/ui/Avatar'
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
  Star,
  Calendar,
  Settings,
  Trophy,
  Zap,
  Heart,
  Sparkles
} from 'lucide-react'
import { StudentProfile } from './StudentProfile'
import { AssessmentGrid } from './AssessmentCards'
import { StatisticsGrid } from './StatisticsCards'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import { MentorForm } from './MentorForm'

interface ModernDashboardProps {
  user: any
}

export function ModernDashboard({ user }: ModernDashboardProps) {
  const [sessions, setSessions] = useState<any[]>([])
  const [configurations, setConfigurations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    totalAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
    streakDays: 0,
    lastAssessment: null,
    achievements: 0
  })
  const [mentorDialogOpen, setMentorDialogOpen] = useState(false)

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
      
      // Calculate achievements (mock data for now)
      const achievements = Math.min(completedSessions.length, 6)
      
      setUserStats({
        totalAssessments,
        completedAssessments: completedSessions.length,
        averageScore: Math.round(averageScore),
        streakDays: 3, // Mock data - would calculate from actual data
        lastAssessment: completedSessions.length > 0 ? completedSessions[0].completed_at : null,
        achievements
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

  const inProgressSessions = sessions.filter((s: any) => s.status === 'in_progress' || s.status === 'started')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
        >
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-xl text-blue-100 mb-6">
                  Ready to discover more about yourself? Your psychometric journey continues here.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                    <Link href="/test/start">
                      <Play className="w-5 h-5 mr-2" />
                      Start New Assessment
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                    <Link href="/results/history">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Results
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                    {user?.user_metadata?.full_name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="text-3xl font-bold">{userStats.completedAssessments}</div>
                  <div className="text-sm text-blue-100">Tests Completed</div>
                </div>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatisticsGrid 
            stats={{
              totalAssessments: userStats.totalAssessments,
              completedAssessments: userStats.completedAssessments,
              averageScore: userStats.averageScore,
              availableTests: configurations.length,
              streakDays: userStats.streakDays,
              achievements: userStats.achievements
            }}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Left Column - Assessments */}
          <div className="lg:col-span-2 space-y-6 h-full">
            {/* In Progress Section */}
            {inProgressSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-2 border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-900">
                      <Clock className="w-5 h-5 mr-2" />
                      Continue Your Journey
                    </CardTitle>
                    <p className="text-blue-700">Pick up where you left off</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inProgressSessions.map((session: any) => (
                        <div key={session.id} className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Brain className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{session.test_configurations?.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Started {new Date(session.started_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Progress</span>
                              <span>{session.current_test_index} of {session.total_tests} tests</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(session.current_test_index / session.total_tests) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
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
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                    Available Assessments
                  </CardTitle>
                  <p className="text-gray-600">Choose from our comprehensive psychometric tests</p>
                </CardHeader>
                <CardContent className="h-full flex-1 flex flex-col">
                  <AssessmentGrid 
                    assessments={configurations}
                    onStartAssessment={startNewAssessment}
                    inProgressSessions={inProgressSessions}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Profile & Quick Actions */}
          <div className="space-y-6 h-full">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-900">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50" asChild>
                      <Link href="/results/history">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View All Results
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50" asChild>
                      <Link href="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Update Profile
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50" asChild>
                      <Link href="/profile/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.lastAssessment ? (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Completed Assessment</p>
                          <p className="text-xs text-gray-500">
                            {new Date(userStats.lastAssessment).toLocaleDateString()} at{' '}
                            {new Date(userStats.lastAssessment).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No recent activity</p>
                        <p className="text-sm text-gray-400">Start your first assessment to see activity here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-900">
                    <Trophy className="w-5 h-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full flex-1 flex flex-col">
                  <div className="text-center flex flex-col flex-1 justify-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{userStats.achievements}</div>
                    <p className="text-sm text-yellow-700 mb-3">Achievements Unlocked</p>
                    <Button size="sm" variant="outline" className="bg-white hover:bg-yellow-100">
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Student Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <StudentProfile user={user} stats={userStats} />
        </motion.div>
      </div>
      {/* Mentor Avatar Floating Button with Dialog */}
      <Dialog open={mentorDialogOpen} onOpenChange={setMentorDialogOpen}>
        <DialogTrigger asChild>
          <div
            className="fixed bottom-8 right-8 z-50 group flex flex-col items-end"
            style={{ cursor: 'pointer' }}
            onClick={() => setMentorDialogOpen(true)}
          >
            {/* Chat bubble - only visible on hover */}
            <div className="mb-2 mr-2 px-4 py-2 rounded-2xl bg-white text-gray-900 shadow-lg text-base font-semibold relative opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                 style={{ maxWidth: '180px' }}>
              Ask your mentor!
              <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md"></span>
            </div>
            <img
              src="/images/mentor.png"
              alt="Mentor"
              className="mentor-avatar shadow-2xl transition-transform group-hover:scale-105"
              style={{ display: 'block' }}
            />
          </div>
        </DialogTrigger>
        <DialogContent fullscreen className="bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <DialogTitle asChild>
            <h2 className="sr-only">Mentor Request</h2>
          </DialogTitle>
          <MentorForm onClose={() => setMentorDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 