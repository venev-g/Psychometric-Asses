'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { motion } from 'framer-motion'
import { 
  Brain, 
  User, 
  BookOpen, 
  Target, 
  Clock, 
  Award,
  Play,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'

interface AssessmentCardProps {
  assessment: any
  onStart: (id: string) => void
  isInProgress?: boolean
  progress?: number
}

export function AssessmentCard({ assessment, onStart, isInProgress = false, progress = 0 }: AssessmentCardProps) {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                {getTestTypeIcon(assessment.name)}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {assessment.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {assessment.time_limit_minutes || 15} min
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(assessment.difficulty)}`}>
                    {assessment.difficulty || 'Standard'}
                  </Badge>
                </div>
              </div>
            </div>
            {isInProgress && (
              <Badge className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                In Progress
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {assessment.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {assessment.description}
            </p>
          )}
          
          {isInProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Award className="w-3 h-3 mr-1" />
                {assessment.max_attempts || 1} attempt{assessment.max_attempts !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {assessment.estimated_duration_minutes || 15} min
              </span>
            </div>
            
            <Button
              size="sm"
              onClick={() => onStart(assessment.id)}
              className={`${
                isInProgress 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isInProgress ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Continue
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AssessmentGridProps {
  assessments: any[]
  onStartAssessment: (id: string) => void
  inProgressSessions?: any[]
}

export function AssessmentGrid({ assessments, onStartAssessment, inProgressSessions = [] }: AssessmentGridProps) {
  const getProgressForAssessment = (assessmentId: string) => {
    const session = inProgressSessions.find(s => s.configuration_id === assessmentId)
    if (session) {
      return (session.current_test_index / session.total_tests) * 100
    }
    return 0
  }

  const isInProgress = (assessmentId: string) => {
    return inProgressSessions.some(s => s.configuration_id === assessmentId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assessments.map((assessment, index) => (
        <AssessmentCard
          key={assessment.id}
          assessment={assessment}
          onStart={onStartAssessment}
          isInProgress={isInProgress(assessment.id)}
          progress={getProgressForAssessment(assessment.id)}
        />
      ))}
    </div>
  )
} 