'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { TestResponse } from '@/types/assessment.types'
import { Brain, Users, Lightbulb, ArrowRight, TrendingUp, Target, Star } from 'lucide-react'

interface PartFeedbackProps {
  part: number
  responses: TestResponse[]
  onContinue: () => void
}

const PartFeedback = ({ part, responses, onContinue }: PartFeedbackProps) => {
  const [showDetailed, setShowDetailed] = useState(false)

  const partResponses = responses.filter(r => r.part === part)
  const categories = [...new Set(partResponses.map(r => r.category))]
  
  const getPartInfo = (partNum: number) => {
    const partInfo = {
      1: {
        title: "Problem Solving Intelligence",
        icon: Brain,
        color: "blue",
        description: "Your logical, linguistic, and spatial reasoning abilities"
      },
      2: {
        title: "Social Intelligence", 
        icon: Users,
        color: "purple",
        description: "Your interpersonal skills, self-awareness, and communication abilities"
      },
      3: {
        title: "Creative Intelligence",
        icon: Lightbulb,
        color: "indigo", 
        description: "Your creative, musical, physical, and naturalistic intelligence"
      }
    }
    return partInfo[partNum as keyof typeof partInfo]
  }

  const getCategoryScore = (category: string) => {
    const categoryResponses = partResponses.filter(r => r.category === category)
    const total = categoryResponses.reduce((sum, r) => {
      const numericResponse = typeof r.response === 'number' ? r.response : parseInt(r.response) || 0
      return sum + numericResponse
    }, 0)
    const average = total / categoryResponses.length
    return Math.round(average * 20) // Convert to percentage
  }

  const getOverallPartScore = () => {
    const total = partResponses.reduce((sum, r) => {
      const numericResponse = typeof r.response === 'number' ? r.response : parseInt(r.response) || 0
      return sum + numericResponse
    }, 0)
    const average = total / partResponses.length
    return Math.round(average * 20)
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return { level: "Very Strong", color: "text-green-600", bg: "bg-green-100" }
    if (score >= 60) return { level: "Strong", color: "text-blue-600", bg: "bg-blue-100" }
    if (score >= 40) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" }
    if (score >= 20) return { level: "Developing", color: "text-orange-600", bg: "bg-orange-100" }
    return { level: "Needs Focus", color: "text-red-600", bg: "bg-red-100" }
  }

  const partInfo = getPartInfo(part)
  const Icon = partInfo.icon
  const overallScore = getOverallPartScore()
  const interpretation = getScoreInterpretation(overallScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-${partInfo.color}-500 to-${partInfo.color}-600 rounded-full mb-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Part {part} Complete!</h1>
          <p className="text-xl text-gray-600">{partInfo.title}</p>
          <p className="text-gray-500 mt-2">{partInfo.description}</p>
        </div>

        {/* Overall Score */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span>Your Overall Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {overallScore}%
              </div>
              <div className={`inline-block px-4 py-2 rounded-full ${interpretation.bg}`}>
                <span className={`font-semibold ${interpretation.color}`}>{interpretation.level}</span>
              </div>
            </div>
            <Progress value={overallScore} className="h-4 mb-4" />
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Category Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const score = getCategoryScore(category)
                const categoryInterpretation = getScoreInterpretation(score)
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-800">{score}%</span>
                        <div className={`px-2 py-1 rounded-full text-xs ${categoryInterpretation.bg}`}>
                          <span className={categoryInterpretation.color}>{categoryInterpretation.level}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overallScore >= 80 && (
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-green-800">Excellent performance! You show strong capabilities in this area. Consider exploring advanced opportunities that leverage these strengths.</p>
                </div>
              )}
              {overallScore >= 60 && overallScore < 80 && (
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800">Good performance! You have solid foundations in this area. Focus on building upon your existing strengths while addressing any gaps.</p>
                </div>
              )}
              {overallScore >= 40 && overallScore < 60 && (
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-yellow-800">Moderate performance. There's room for growth in this area. Consider seeking additional practice and resources to develop these skills further.</p>
                </div>
              )}
              {overallScore < 40 && (
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <p className="text-orange-800">This area shows potential for significant improvement. Consider focused learning and practice to develop these important skills.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          {part < 3 ? (
            <Button 
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue to Part {part + 1}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button 
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Final Report
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartFeedback 