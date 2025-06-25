'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TestResponse } from '@/types/assessment.types'
import { Brain, Users, Lightbulb, ArrowRight } from 'lucide-react'

interface DominantIntelligenceReportProps {
  responses: TestResponse[]
  onContinue: () => void
}

const DominantIntelligenceReport = ({ responses, onContinue }: DominantIntelligenceReportProps) => {
  const calculatePartScore = (part: number) => {
    const partResponses = responses.filter(r => r.part === part && r.testType === 'dominant')
    const total = partResponses.reduce((sum, r) => sum + (r.response as number), 0)
    return Math.round((total / (partResponses.length * 5)) * 100)
  }

  const getStrongestIntelligence = () => {
    const scores = {
      1: calculatePartScore(1),
      2: calculatePartScore(2), 
      3: calculatePartScore(3)
    }
    
    const highest = Math.max(...Object.values(scores))
    let strongestPart = '1'
    
    if (scores[2] === highest) strongestPart = '2'
    if (scores[3] === highest) strongestPart = '3'
    
    const partNames = {
      '1': 'Problem Solving Intelligence',
      '2': 'Social Intelligence', 
      '3': 'Creative Intelligence'
    }
    
    return { name: partNames[strongestPart as keyof typeof partNames], score: highest }
  }

  const strongest = getStrongestIntelligence()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-roboto p-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Dominant Intelligence Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">Based on Howard Gardner's Multiple Intelligence Theory</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Strongest Intelligence Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Your Strongest Intelligence
              </h3>
              <div className="text-2xl font-bold text-purple-700">{strongest.name}</div>
              <div className="text-lg text-blue-600">{strongest.score}% Alignment</div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 text-blue-600 mr-2" />
                    <CardTitle className="text-lg text-blue-800">Problem Solving</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 mb-2">{calculatePartScore(1)}%</div>
                  <p className="text-sm text-blue-600">Logical, Linguistic & Spatial Intelligence</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-green-600 mr-2" />
                    <CardTitle className="text-lg text-green-800">Social Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700 mb-2">{calculatePartScore(2)}%</div>
                  <p className="text-sm text-green-600">Interpersonal & Communication Skills</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Lightbulb className="w-6 h-6 text-purple-600 mr-2" />
                    <CardTitle className="text-lg text-purple-800">Creative Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700 mb-2">{calculatePartScore(3)}%</div>
                  <p className="text-sm text-purple-600">Bodily, Musical & Naturalistic Intelligence</p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Button */}
            <div className="text-center pt-6">
              <Button 
                onClick={onContinue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
                size="lg"
              >
                Continue to Personality Test
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DominantIntelligenceReport 