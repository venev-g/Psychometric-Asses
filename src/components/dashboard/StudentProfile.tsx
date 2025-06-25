'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { motion } from 'framer-motion'
import { 
  User, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Trophy,
  BookOpen,
  Brain,
  Heart,
  Zap,
  CheckCircle
} from 'lucide-react'

interface StudentProfileProps {
  user: any
  stats: {
    totalAssessments: number
    completedAssessments: number
    averageScore: number
    streakDays: number
    lastAssessment: string | null
  }
}

export function StudentProfile({ user, stats }: StudentProfileProps) {
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Assessment', description: 'Completed your first test', icon: '🎯', unlocked: true },
    { id: 2, name: 'Streak Master', description: '3 days in a row', icon: '🔥', unlocked: stats.streakDays >= 3 },
    { id: 3, name: 'Perfect Score', description: 'Achieved 100% on any test', icon: '⭐', unlocked: stats.averageScore >= 100 },
    { id: 4, name: 'Test Explorer', description: 'Completed 5 different tests', icon: '🧭', unlocked: stats.completedAssessments >= 5 },
    { id: 5, name: 'Consistent Learner', description: '10 assessments completed', icon: '📚', unlocked: stats.completedAssessments >= 10 },
    { id: 6, name: 'High Achiever', description: 'Average score above 85%', icon: '🏆', unlocked: stats.averageScore >= 85 }
  ])

  const [personalityTraits, setPersonalityTraits] = useState([
    { trait: 'Analytical', score: 85, color: 'blue' },
    { trait: 'Creative', score: 72, color: 'purple' },
    { trait: 'Social', score: 68, color: 'green' },
    { trait: 'Practical', score: 91, color: 'orange' }
  ])

  const getLevel = () => {
    const level = Math.floor(stats.completedAssessments / 3) + 1
    return level
  }

  const getNextLevelProgress = () => {
    const currentLevel = getLevel()
    const assessmentsForCurrentLevel = (currentLevel - 1) * 3
    const assessmentsInCurrentLevel = stats.completedAssessments - assessmentsForCurrentLevel
    return (assessmentsInCurrentLevel / 3) * 100
  }

  const getTraitColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500'
      case 'purple': return 'bg-purple-500'
      case 'green': return 'bg-green-500'
      case 'orange': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar and Basic Info */}
              <div className="text-center lg:text-left">
                <Avatar className="w-24 h-24 mx-auto lg:mx-0 mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user?.user_metadata?.full_name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.user_metadata?.full_name || 'Student Name'}
                </h2>
                <p className="text-gray-600 mb-2">Psychometric Assessment Student</p>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Level {getLevel()}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{stats.completedAssessments}</div>
                  <div className="text-xs text-gray-600">Tests Done</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                  <div className="text-xs text-gray-600">Avg Score</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{stats.streakDays}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-xs text-gray-600">Achievements</div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress to Level {getLevel() + 1}</span>
                <span className="text-sm text-gray-500">{Math.round(getNextLevelProgress())}%</span>
              </div>
              <Progress value={getNextLevelProgress()} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {3 - (stats.completedAssessments % 3)} more assessments to level up
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personality Traits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Personality Insights
            </CardTitle>
            <p className="text-gray-600">Your assessment results reveal these key traits</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalityTraits.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{trait.trait}</span>
                    <span className="text-sm text-gray-500">{trait.score}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={trait.score} className="h-2" />
                    <div className={`absolute top-0 left-0 w-2 h-2 rounded-full ${getTraitColor(trait.color)}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              Achievements
            </CardTitle>
            <p className="text-gray-600">Track your progress and unlock new achievements</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
              {stats.lastAssessment ? (
                <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Completed Assessment</p>
                    <p className="text-xs text-gray-500">
                      {new Date(stats.lastAssessment).toLocaleDateString()} at{' '}
                      {new Date(stats.lastAssessment).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Completed
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
    </div>
  )
} 