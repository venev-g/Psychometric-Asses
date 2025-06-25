'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { 
  Target, 
  CheckCircle, 
  TrendingUp, 
  BookOpen,
  Clock,
  Award,
  Star,
  Zap
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

export function StatCard({ title, value, icon, color, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className={`bg-gradient-to-br ${color} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
              <p className="text-3xl font-bold text-white mb-2">{value}</p>
              {trend && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-4 h-4 ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`} />
                  <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StatisticsGridProps {
  stats: {
    totalAssessments: number
    completedAssessments: number
    averageScore: number
    availableTests: number
    streakDays: number
    achievements: number
  }
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  const statCards = [
    {
      title: 'Total Assessments',
      value: stats.totalAssessments,
      icon: <Target className="w-6 h-6 text-white" />,
      color: 'from-blue-500 to-blue-600',
      trend: { value: 12, isPositive: true },
      delay: 0.1
    },
    {
      title: 'Completed',
      value: stats.completedAssessments,
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: 'from-green-500 to-green-600',
      trend: { value: 8, isPositive: true },
      delay: 0.2
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'from-purple-500 to-purple-600',
      trend: { value: 5, isPositive: true },
      delay: 0.3
    },
    {
      title: 'Available Tests',
      value: stats.availableTests,
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'from-orange-500 to-orange-600',
      delay: 0.4
    },
    {
      title: 'Day Streak',
      value: stats.streakDays,
      icon: <Zap className="w-6 h-6 text-white" />,
      color: 'from-yellow-500 to-yellow-600',
      trend: { value: 2, isPositive: true },
      delay: 0.5
    },
    {
      title: 'Achievements',
      value: stats.achievements,
      icon: <Award className="w-6 h-6 text-white" />,
      color: 'from-pink-500 to-pink-600',
      delay: 0.6
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          delay={stat.delay}
        />
      ))}
    </div>
  )
}

interface ProgressCardProps {
  title: string
  current: number
  total: number
  color: string
  icon: React.ReactNode
}

export function ProgressCard({ title, current, total, color, icon }: ProgressCardProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="border-2 hover:border-blue-300 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">
                {current} of {total} completed
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${color.replace('bg-', 'bg-')}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 