'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TestResponse } from '@/types/assessment.types'
import { Brain, Users, Lightbulb, Download, RefreshCw, Trophy, TrendingUp, Target, BookOpen } from 'lucide-react'

interface TestResultsProps {
  responses: TestResponse[]
  onRestart: () => void
}

const TestResults = ({ responses, onRestart }: TestResultsProps) => {
  const [activeTab, setActiveTab] = useState('overview')

  const getPartResponses = (part: number) => responses.filter(r => r.part === part)
  
  const getPartScore = (part: number) => {
    const partResponses = getPartResponses(part)
    const total = partResponses.reduce((sum, r) => {
      const numericResponse = typeof r.response === 'number' ? r.response : parseInt(r.response) || 0
      return sum + numericResponse
    }, 0)
    const average = total / partResponses.length
    return Math.round(average * 20)
  }

  const getCategoryScore = (category: string) => {
    const categoryResponses = responses.filter(r => r.category === category)
    const total = categoryResponses.reduce((sum, r) => {
      const numericResponse = typeof r.response === 'number' ? r.response : parseInt(r.response) || 0
      return sum + numericResponse
    }, 0)
    const average = total / categoryResponses.length
    return Math.round(average * 20)
  }

  const getOverallScore = () => {
    const total = responses.reduce((sum, r) => {
      const numericResponse = typeof r.response === 'number' ? r.response : parseInt(r.response) || 0
      return sum + numericResponse
    }, 0)
    const average = total / responses.length
    return Math.round(average * 20)
  }

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: "Exceptional", color: "bg-green-500 text-white" }
    if (score >= 70) return { level: "Strong", color: "bg-blue-500 text-white" }
    if (score >= 60) return { level: "Good", color: "bg-indigo-500 text-white" }
    if (score >= 50) return { level: "Average", color: "bg-yellow-500 text-white" }
    if (score >= 40) return { level: "Developing", color: "bg-orange-500 text-white" }
    return { level: "Needs Growth", color: "bg-red-500 text-white" }
  }

  const getTopStrengths = () => {
    const categories = [
      'Logical Intelligence', 'Linguistic Intelligence', 'Spatial Intelligence',
      'Interpersonal Intelligence', 'Intrapersonal Intelligence', 'Communication Skills',
      'Bodily-Kinesthetic Intelligence', 'Musical Intelligence', 'Naturalistic Intelligence', 'Creative Intelligence'
    ]
    
    const categoryScores = categories.map(cat => ({
      category: cat,
      score: getCategoryScore(cat)
    }))
    
    return categoryScores.sort((a, b) => b.score - a.score).slice(0, 3)
  }

  const getGrowthAreas = () => {
    const categories = [
      'Logical Intelligence', 'Linguistic Intelligence', 'Spatial Intelligence',
      'Interpersonal Intelligence', 'Intrapersonal Intelligence', 'Communication Skills',
      'Bodily-Kinesthetic Intelligence', 'Musical Intelligence', 'Naturalistic Intelligence', 'Creative Intelligence'
    ]
    
    const categoryScores = categories.map(cat => ({
      category: cat,
      score: getCategoryScore(cat)
    }))
    
    return categoryScores.sort((a, b) => a.score - b.score).slice(0, 3)
  }

  const generatePDF = () => {
    // This would integrate with a PDF generation library
    alert('PDF report generation would be implemented here!')
  }

  const overallScore = getOverallScore()
  const overallLevel = getScoreLevel(overallScore)
  const topStrengths = getTopStrengths()
  const growthAreas = getGrowthAreas()

  const partInfo = [
    { id: 1, title: "Problem Solving", icon: Brain, color: "blue", description: "Logical, Linguistic & Spatial" },
    { id: 2, title: "Social Intelligence", icon: Users, color: "purple", description: "Interpersonal & Communication" },
    { id: 3, title: "Creative Intelligence", icon: Lightbulb, color: "indigo", description: "Creative, Musical & Physical" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Personality Assessment Report</h1>
          <p className="text-xl text-gray-600">Comprehensive analysis of your unique intelligence profile</p>
        </div>

        {/* Overall Score Card */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Overall Intelligence Score</h2>
                <div className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {overallScore}%
                </div>
                <Badge className={`text-lg px-4 py-2 ${overallLevel.color}`}>
                  {overallLevel.level}
                </Badge>
              </div>
              <div className="space-y-4">
                {partInfo.map((part) => {
                  const score = getPartScore(part.id)
                  const Icon = part.icon
                  return (
                    <div key={part.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${part.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${part.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{part.title}</h3>
                          <p className="text-sm text-gray-600">{part.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{score}%</div>
                        <Badge className={getScoreLevel(score).color}>
                          {getScoreLevel(score).level}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'strengths', label: 'Top Strengths', icon: TrendingUp },
            { id: 'growth', label: 'Growth Areas', icon: BookOpen },
            { id: 'detailed', label: 'Detailed Analysis', icon: Brain }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Your Intelligence Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Dominant Intelligence Type</h4>
                    <p className="text-green-700">{topStrengths[0].category}</p>
                    <p className="text-sm text-green-600 mt-1">{topStrengths[0].score}% - This is your strongest area!</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Learning Style</h4>
                    <p className="text-blue-700">
                      {topStrengths[0].category.includes('Linguistic') ? 'Verbal/Linguistic learner - You learn best through words and language.' :
                       topStrengths[0].category.includes('Spatial') ? 'Visual/Spatial learner - You learn best through images and visualization.' :
                       topStrengths[0].category.includes('Logical') ? 'Logical/Mathematical learner - You prefer structured, analytical approaches.' :
                       topStrengths[0].category.includes('Interpersonal') ? 'Social learner - You thrive in collaborative environments.' :
                       topStrengths[0].category.includes('Musical') ? 'Auditory learner - You learn well with sound and rhythm.' :
                       'Kinesthetic learner - You learn best through hands-on experience.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Recommended Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-sm">Leverage Your Strengths</h4>
                    <p className="text-purple-700 text-sm">Focus on activities and careers that utilize your {topStrengths[0].category.toLowerCase()}.</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 text-sm">Develop Growth Areas</h4>
                    <p className="text-orange-700 text-sm">Consider practicing skills in {growthAreas[0].category.toLowerCase()} to become more well-rounded.</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 text-sm">Study Tips</h4>
                    <p className="text-indigo-700 text-sm">Use your learning style preferences to optimize your study methods and academic performance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'strengths' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Your Top 3 Strengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {topStrengths.map((strength, index) => (
                  <div key={strength.category} className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">#{index + 1}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{strength.category}</h3>
                    <div className="text-2xl font-bold text-gray-700 mb-2">{strength.score}%</div>
                    <Badge className="bg-green-500 text-white">
                      {getScoreLevel(strength.score).level}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-3">
                      This is one of your strongest areas. Consider careers and activities that leverage this intelligence type.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'growth' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <span>Areas for Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {growthAreas.map((area, index) => (
                  <div key={area.category} className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">{area.category}</h3>
                    <div className="text-2xl font-bold text-gray-700 mb-2">{area.score}%</div>
                    <Badge className="bg-orange-500 text-white mb-3">
                      Growth Opportunity
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Consider focused practice in this area to develop a more well-rounded intelligence profile.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-6">
            {partInfo.map((part) => {
              const partResponses = getPartResponses(part.id)
              const categories = [...new Set(partResponses.map(r => r.category))]
              const Icon = part.icon
              
              return (
                <Card key={part.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 text-${part.color}-600`} />
                      <span>Part {part.id}: {part.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => {
                        const score = getCategoryScore(category)
                        const level = getScoreLevel(score)
                        return (
                          <div key={category} className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">{category}</h4>
                            <div className="text-xl font-bold text-gray-700 mb-1">{score}%</div>
                            <Badge className={level.color}>
                              {level.level}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button 
            onClick={generatePDF}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Button 
            onClick={onRestart}
            variant="outline"
            className="px-6 py-3 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Take Test Again
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TestResults 