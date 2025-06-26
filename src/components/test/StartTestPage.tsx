'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Brain, Users, BookOpen, ArrowRight, CheckCircle } from 'lucide-react'
import { PersonalityTest } from './PersonalityTest'
import type { FormattedQuestion } from '@/lib/services/QuestionsService'

interface StartTestPageProps {
  user: any
  questions: {
    dominantIntelligence: FormattedQuestion[]
    personalityPattern: FormattedQuestion[]
    learningStyle: FormattedQuestion[]
  }
}

export function StartTestPage({ user, questions }: StartTestPageProps) {
  const [testStarted, setTestStarted] = useState(false)

  // Check if questions are available
  const hasQuestions = questions && 
    (questions.dominantIntelligence?.length > 0 || 
     questions.personalityPattern?.length > 0 || 
     questions.learningStyle?.length > 0)

  if (!hasQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-['Roboto',sans-serif] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Questions Loading</h2>
            <p className="text-gray-600 mb-4">We're preparing your assessment questions. Please wait a moment.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (testStarted) {
    return <PersonalityTest onBack={() => setTestStarted(false)} user={user} questions={questions} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-['Roboto',sans-serif]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6 shadow-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Student Psychometric Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Discover your unique strengths, personality type, and optimal learning style through our comprehensive AI-powered assessment suite.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4 shadow-lg">
                <Brain className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-indigo-600 text-xl font-bold">Test 1: Dominant Intelligence</CardTitle>
              <p className="text-gray-600 font-medium">Howard Gardner's Multiple Intelligence Theory</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Logical & Mathematical Intelligence</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Linguistic & Spatial Intelligence</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Creative & Naturalistic Intelligence</span>
                </div>
              </div>
              <p className="text-gray-600 text-center text-sm">24 questions across 3 comprehensive parts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 shadow-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-purple-600 text-xl font-bold">Test 2: Personality Pattern</CardTitle>
              <p className="text-gray-600 font-medium">Mini MBTI-Style Assessment</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Extraversion vs Introversion</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Sensing vs Intuition</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Thinking vs Feeling</span>
                </div>
              </div>
              <p className="text-gray-600 text-center text-sm">Discover your unique personality type from 16 profiles</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-teal-100 rounded-full mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-green-600 text-xl font-bold">Test 3: Learning Style</CardTitle>
              <p className="text-gray-600 font-medium">VARK Learning Preferences Model</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Visual Learning Style</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Auditory & Kinesthetic</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Reading & Writing Preferences</span>
                </div>
              </div>
              <p className="text-gray-600 text-center text-sm">6 targeted questions to optimize your learning</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl mb-8 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-800">Complete Assessment Experience</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-4"></div>
                    <span className="font-medium">46 scientifically-designed questions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                    <span className="font-medium">Interactive chat-based interface</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-pink-500 rounded-full mr-4"></div>
                    <span className="font-medium">Checkbox responses for easy selection</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                    <span className="font-medium">Individual reports + Combined final analysis</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                    <span className="font-medium">Personalized character avatars</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  ~25
                </div>
                <p className="text-gray-600 mb-8 text-lg font-medium">Minutes to complete all tests</p>
                <Button 
                  onClick={() => setTestStarted(true)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Begin Your Journey
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500">
          <p className="font-medium">Your responses are completely confidential and used exclusively for generating your personalized insights.</p>
        </div>
      </div>
    </div>
  )
}