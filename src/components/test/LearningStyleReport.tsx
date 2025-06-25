'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TestResponse } from '@/types/assessment.types'
import { Eye, Ear, BookOpen, Hand, ArrowRight } from 'lucide-react'

interface LearningStyleReportProps {
  responses: TestResponse[]
  onContinue: () => void
}

const LearningStyleReport = ({ responses, onContinue }: LearningStyleReportProps) => {
  const calculateLearningStyle = () => {
    const learningResponses = responses.filter(r => r.testType === 'learning')
    
    const styles = {
      Visual: 0,
      Auditory: 0,
      Reading: 0,
      Kinesthetic: 0
    }

    learningResponses.forEach(response => {
      const answer = response.response as string
      if (answer.includes('visual') || answer.includes('diagrams') || answer.includes('charts') || answer.includes('pictures')) {
        styles.Visual++
      } else if (answer.includes('listen') || answer.includes('audio') || answer.includes('discussion') || answer.includes('explain')) {
        styles.Auditory++
      } else if (answer.includes('read') || answer.includes('notes') || answer.includes('written') || answer.includes('articles')) {
        styles.Reading++
      } else if (answer.includes('hands-on') || answer.includes('practice') || answer.includes('experiments') || answer.includes('interactive')) {
        styles.Kinesthetic++
      }
    })

    const dominant = Object.entries(styles).reduce((a, b) => styles[a[0] as keyof typeof styles] > styles[b[0] as keyof typeof styles] ? a : b)
    return { style: dominant[0], count: dominant[1], scores: styles }
  }

  const result = calculateLearningStyle()

  const getStyleDescription = (style: string) => {
    const descriptions = {
      Visual: "You learn best through visual aids like charts, diagrams, and images. You prefer to see information to understand it.",
      Auditory: "You learn best through listening, discussions, and verbal explanations. You understand concepts better when you hear them.",
      Reading: "You learn best through reading and writing. You prefer detailed notes and written materials to process information.",
      Kinesthetic: "You learn best through hands-on experience and physical activities. You need to practice and do to truly understand."
    }
    return descriptions[style as keyof typeof descriptions]
  }

  const getStyleIcon = (style: string) => {
    const icons = {
      Visual: Eye,
      Auditory: Ear,
      Reading: BookOpen,
      Kinesthetic: Hand
    }
    return icons[style as keyof typeof icons]
  }

  const StyleIcon = getStyleIcon(result.style)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 font-roboto p-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <StyleIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Your Learning Style Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">Based on the VARK Learning Model</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Dominant Style */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Your Dominant Learning Style</h3>
              <div className="text-3xl font-bold text-blue-700 mb-2">{result.style} Learner</div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {getStyleDescription(result.style)}
              </p>
            </div>

            {/* Style Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(result.scores).map(([style, score]) => {
                const Icon = getStyleIcon(style)
                const isStrong = score >= result.count
                
                return (
                  <Card key={style} className={`${isStrong ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center">
                        <Icon className={`w-6 h-6 mr-2 ${isStrong ? 'text-green-600' : 'text-gray-500'}`} />
                        <CardTitle className={`text-lg ${isStrong ? 'text-green-800' : 'text-gray-600'}`}>{style}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold mb-2 ${isStrong ? 'text-green-700' : 'text-gray-500'}`}>
                        {score}/{Object.values(result.scores).length}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isStrong ? 'bg-green-500' : 'bg-gray-400'}`}
                          style={{ width: `${(score / Object.values(result.scores).length) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Continue Button */}
            <div className="text-center pt-6">
              <Button 
                onClick={onContinue}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
                size="lg"
              >
                View Combined Report
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LearningStyleReport 