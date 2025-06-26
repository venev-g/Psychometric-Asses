// src/app/demo-dashboard/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
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

interface Configuration {
  id: string
  name: string
  description: string
  max_attempts: number
  time_limit_minutes: number
  test_sequences: any[]
}

export default function DemoDashboardPage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)
  const [demoSessions, setDemoSessions] = useState<any[]>([])

  useEffect(() => {
    loadConfigurations()
    loadDemoSessions()
  }, [])

  const loadConfigurations = async () => {
    try {
      const response = await fetch('/api/configurations')
      const data = await response.json()
      setConfigurations(data.configurations || [])
    } catch (error) {
      console.error('Failed to load configurations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDemoSessions = () => {
    // Load demo sessions from localStorage
    const saved = localStorage.getItem('demo-sessions')
    if (saved) {
      setDemoSessions(JSON.parse(saved))
    }
  }

  const startAssessment = async (configurationId: string) => {
    try {
      const response = await fetch('/api/demo/start-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configurationId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Save to localStorage for demo
        const newSession = data.session
        const updatedSessions = [...demoSessions, newSession]
        setDemoSessions(updatedSessions)
        localStorage.setItem('demo-sessions', JSON.stringify(updatedSessions))
        
        // Navigate to assessment
        window.location.href = `/assessment`
      }
    } catch (error) {
      console.error('Failed to start assessment:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg mr-3 flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Demo Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Demo Mode
              </Badge>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome to Demo Mode!</h2>
                  <p className="text-blue-100 text-lg">
                    Explore our psychometric assessments without creating an account. 
                    Your results will be shown at the end but won't be saved.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Brain className="w-20 h-20 text-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{configurations.length}</p>
                  <p className="text-gray-600">Available Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{demoSessions.length}</p>
                  <p className="text-gray-600">Demo Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">15-45</p>
                  <p className="text-gray-600">Minutes per Test</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">34+</p>
                  <p className="text-gray-600">Questions Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Assessments */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Start an Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {configurations.map((config, index) => (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-blue-700 mb-2">
                          {config.name}
                        </CardTitle>
                        <p className="text-gray-600">{config.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {config.test_sequences.length} tests
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {config.time_limit_minutes} minutes
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {config.max_attempts} attempts
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => startAssessment(config.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo Sessions History */}
        {demoSessions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Demo Sessions</h3>
            <div className="space-y-4">
              {demoSessions.map((session, index) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Session #{index + 1}
                        </h4>
                        <p className="text-gray-600">
                          Started: {new Date(session.started_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={session.status === 'completed' ? 'default' : 'secondary'}
                        className={session.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready for the Full Experience?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Create an account to save your results, track progress over time, 
                  get detailed insights, and access personalized recommendations.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
