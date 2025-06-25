'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { ArrowLeft, Bot, User, Brain, Users, BookOpen, LogOut, Calculator, Atom, Palette, BarChart3, Eye, Sparkles, Zap, Target, Trophy, Star, Lightbulb, Heart, Music, Camera, Globe } from 'lucide-react'
import { 
  dominantIntelligenceQuestions, 
  personalityPatternQuestions, 
  learningStyleQuestions,
  TestResponse
} from '@/lib/data/testQuestions'
import TestResults from './TestResults'
import DominantIntelligenceReport from './DominantIntelligenceReport'
import PersonalityReport from './PersonalityReport'
import LearningStyleReport from './LearningStyleReport'
import PartFeedback from './PartFeedback'

interface PersonalityTestProps {
  onBack: () => void
  user: any
}

type TestType = 'dominant' | 'personality' | 'learning'
type TestPhase = 'testing' | 'partComplete' | 'testComplete' | 'dominantReport' | 'personalityReport' | 'learningReport' | 'finalReport'

type ChatMessage = {
  type: 'bot' | 'user' | 'options' | 'dynamicOptions' | 'testActions' | 'macroFeedback'
  content: string
  options?: Array<{value: number, label: string}>
  dynamicOptions?: string[]
  testType?: TestType
  completedTest?: TestType
  completedPart?: number
  feedbackType?: 'part' | 'test'
}

export function PersonalityTest({ onBack, user }: PersonalityTestProps) {
  const [currentTest, setCurrentTest] = useState<TestType>('dominant')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<TestResponse[]>([])
  const [phase, setPhase] = useState<TestPhase>('testing')
  const [selectedResponse, setSelectedResponse] = useState<number | string | null>(null)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  const [completedPart, setCompletedPart] = useState<number | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      type: 'bot', 
      content: `Hey there! 👋 I'm your AI assessment companion. We're going to explore your unique strengths through 3 exciting tests:

🧠 **Test 1: Dominant Intelligence** - Discover your natural talents (24 questions)
👥 **Test 2: Personality Pattern** - Understand your character type (16 questions)
📚 **Test 3: Learning Style** - Find your optimal learning approach (6 questions)

Let's start with your Dominant Intelligence assessment. Ready to dive in?`
    }
  ])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLDivElement>(null)

  const responseOptions = [
    { value: 5, label: 'Strongly Agree' },
    { value: 4, label: 'Agree' },
    { value: 3, label: 'Neutral' },
    { value: 2, label: 'Disagree' },
    { value: 1, label: 'Strongly Disagree' }
  ]

  const getCurrentQuestions = () => {
    switch (currentTest) {
      case 'dominant': return dominantIntelligenceQuestions
      case 'personality': return personalityPatternQuestions
      case 'learning': return learningStyleQuestions
    }
  }

  const getTestIcon = (test: TestType) => {
    switch (test) {
      case 'dominant': return Brain
      case 'personality': return Users
      case 'learning': return BookOpen
    }
  }

  const getTestTitle = (test: TestType) => {
    switch (test) {
      case 'dominant': return 'Dominant Intelligence'
      case 'personality': return 'Personality Pattern'
      case 'learning': return 'Learning Style'
    }
  }

  const scrollToQuestion = () => {
    setTimeout(() => {
      questionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }, 100)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1]
    if (lastMessage?.type === 'options' || lastMessage?.type === 'dynamicOptions') {
      scrollToQuestion()
    } else {
      scrollToBottom()
    }
  }, [chatMessages])

  // Start the first question when component mounts
  useEffect(() => {
    const questions = getCurrentQuestions()
    if (questions.length > 0) {
      const firstQuestion = questions[0]
      setTimeout(() => {
        if (firstQuestion.options) {
          setChatMessages(prev => [...prev, {
            type: 'dynamicOptions',
            content: firstQuestion.text,
            dynamicOptions: firstQuestion.options,
            testType: currentTest
          }])
        } else {
          setChatMessages(prev => [...prev, {
            type: 'options',
            content: firstQuestion.text,
            options: responseOptions,
            testType: currentTest
          }])
        }
      }, 2000) // Wait 2 seconds after welcome message
    }
  }, []) // Run only once when component mounts

  const showMacroFeedback = (type: 'part' | 'test', completedPart?: number, completedTest?: TestType) => {
    let feedbackContent = ''
    let emoji = ''
    
    if (type === 'part') {
      const partNames = { 1: 'Problem Solving', 2: 'Social Intelligence', 3: 'Creative Intelligence' }
      const partName = partNames[completedPart as keyof typeof partNames]
      emoji = completedPart === 1 ? '🧠' : completedPart === 2 ? '👥' : '🎨'
      feedbackContent = `${emoji} **Amazing Progress!** ${emoji}

You've successfully completed **Part ${completedPart}: ${partName}**! 

✨ Your mind is truly fascinating - each response reveals unique patterns in how you think and process information.

🌟 **What's happening behind the scenes:**
- Your responses are being analyzed for cognitive patterns
- We're mapping your intellectual strengths
- Building your personalized intelligence profile

Keep up the fantastic work! 🚀`
    } else {
      const testNames = {
        dominant: { name: 'Dominant Intelligence', emoji: '🧠', color: 'blue' },
        personality: { name: 'Personality Pattern', emoji: '👥', color: 'purple' },
        learning: { name: 'Learning Style', emoji: '📚', color: 'green' }
      }
      const testInfo = testNames[completedTest!]
      feedbackContent = `${testInfo.emoji} **Incredible Achievement!** ${testInfo.emoji}

🎉 You've completed the **${testInfo.name}** assessment! 

🌈 **What you've accomplished:**
- Revealed deep insights about your cognitive style
- Unlocked understanding of your unique strengths  
- Added valuable data to your personal profile

💫 Your journey of self-discovery is expanding with each test! The patterns emerging will help you understand yourself better than ever before.

Ready for what's next? 🚀✨`
    }

    setChatMessages(prev => [...prev, {
      type: 'macroFeedback',
      content: feedbackContent,
      feedbackType: type,
      completedPart,
      completedTest
    }])
  }

  const handleQuit = () => {
    const completedDominantParts = [...new Set(responses.filter(r => r.testType === 'dominant').map(r => r.part))]
    const hasPersonalityResponses = responses.some(r => r.testType === 'personality')
    const hasLearningResponses = responses.some(r => r.testType === 'learning')

    if (completedDominantParts.length > 0 || hasPersonalityResponses || hasLearningResponses) {
      setPhase('finalReport')
    } else {
      onBack()
    }
  }

  const handleResponse = (value: number | string) => {
    const questions = getCurrentQuestions()
    const question = questions[currentQuestion]
    const newResponse: TestResponse = {
      questionId: question.id,
      question: question.text,
      response: value,
      testType: currentTest,
      part: question.part || undefined,
      category: question.category
    }

    setResponses([...responses, newResponse])
    setSelectedResponse(null)
    
    const responseLabel = typeof value === 'number' 
      ? responseOptions.find(opt => opt.value === value)?.label || '' 
      : value
    setChatMessages(prev => [...prev, { type: 'user', content: `Selected: ${responseLabel}` }])

    const nextQuestion = currentQuestion + 1
    
    if (currentTest === 'dominant') {
      const isPartComplete = !questions.slice(nextQuestion).some(q => q.part === question.part)

      if (isPartComplete && nextQuestion < questions.length) {
        setTimeout(() => {
          showMacroFeedback('part', question.part!)
          setTimeout(() => {
            showPartCompletionOptions(question.part!)
          }, 3000)
        }, 1000)
      } else if (nextQuestion >= questions.length) {
        setTimeout(() => {
          showMacroFeedback('test', undefined, currentTest)
          setTimeout(() => {
            showTestCompletionOptions('dominant')
          }, 3000)
        }, 1000)
      } else {
        continueToNextQuestion(nextQuestion)
      }
    } else {
      if (nextQuestion >= questions.length) {
        setTimeout(() => {
          showMacroFeedback('test', undefined, currentTest)
          setTimeout(() => {
            showTestCompletionOptions(currentTest)
          }, 3000)
        }, 1000)
      } else {
        continueToNextQuestion(nextQuestion)
      }
    }
  }

  const showPartCompletionOptions = (completedPart: number) => {
    const partNames = { 1: 'Problem Solving', 2: 'Social Intelligence', 3: 'Creative Intelligence' }
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: `🎉 Excellent work! You've completed Part ${completedPart}: ${partNames[completedPart as keyof typeof partNames]}.

What would you like to do next?`
      }, {
        type: 'testActions',
        content: '',
        completedPart: completedPart
      }])
    }, 1000)
  }

  const showTestCompletionOptions = (completedTest: TestType) => {
    const testNames = {
      dominant: 'Dominant Intelligence',
      personality: 'Personality Pattern', 
      learning: 'Learning Style'
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: `🌟 Fantastic! You've completed the ${testNames[completedTest]} test!

What would you like to do next?`
      }, {
        type: 'testActions',
        content: '',
        completedTest: completedTest
      }])
    }, 1000)
  }

  const continueToNextPart = (fromPart: number) => {
    const nextPartName = { 1: 'Social Intelligence', 2: 'Creative Intelligence' }[fromPart as 1 | 2]
    
    setChatMessages(prev => [...prev, {
      type: 'bot',
      content: `Great! Let's continue to Part ${fromPart + 1}: ${nextPartName}. Ready?`
    }])
    
    setTimeout(() => {
      const nextQuestionIndex = dominantIntelligenceQuestions.findIndex(q => q.part === fromPart + 1)
      setCurrentQuestion(nextQuestionIndex)
      const nextQ = dominantIntelligenceQuestions[nextQuestionIndex]
      setChatMessages(prev => [...prev, 
        { type: 'bot', content: nextQ.text },
        { type: 'options', content: '', options: responseOptions, testType: 'dominant' }
      ])
    }, 1500)
  }

  const continueToNextQuestion = (nextQuestionIndex: number) => {
    setCurrentQuestion(nextQuestionIndex)
    setTimeout(() => {
      const questions = getCurrentQuestions()
      const nextQ = questions[nextQuestionIndex]
      
      if (currentTest === 'learning' && nextQ.options) {
        setChatMessages(prev => [...prev, 
          { type: 'bot', content: nextQ.text },
          { type: 'dynamicOptions', content: '', dynamicOptions: nextQ.options, testType: currentTest }
        ])
      } else {
        setChatMessages(prev => [...prev, 
          { type: 'bot', content: nextQ.text },
          { type: 'options', content: '', options: responseOptions, testType: currentTest }
        ])
      }
    }, 800)
  }

  const continueFromReport = (nextTest: TestType) => {
    setCurrentTest(nextTest)
    setCurrentQuestion(0)
    setPhase('testing')
    
    setTimeout(() => {
      const testIntros = {
        dominant: `Great! Let's start with your Dominant Intelligence assessment.`,
        personality: `Excellent work! 🎉 Now let's explore your Personality Pattern with our mini-MBTI assessment.`,
        learning: `Fantastic! 🌟 Now for our final assessment - your Learning Style using the VARK model.`
      }
      
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: testIntros[nextTest]
      }])
      
      setTimeout(() => {
        const questions = nextTest === 'personality' ? personalityPatternQuestions : learningStyleQuestions
        const nextQ = questions[0]
        
        if (nextTest === 'learning' && nextQ.options) {
          setChatMessages(prev => [...prev, 
            { type: 'bot', content: nextQ.text },
            { type: 'dynamicOptions', content: '', dynamicOptions: nextQ.options, testType: nextTest }
          ])
        } else {
          setChatMessages(prev => [...prev, 
            { type: 'bot', content: nextQ.text },
            { type: 'options', content: '', options: responseOptions, testType: nextTest }
          ])
        }
      }, 1500)
    }, 1000)
  }

  const getTotalQuestions = () => {
    return getCurrentQuestions().length
  }

  const getCurrentProgress = () => {
    return ((currentQuestion + 1) / getTotalQuestions()) * 100
  }

  const getCurrentQuestionNumber = () => {
    return currentQuestion + 1
  }

  // Render different phases
  if (phase === 'dominantReport') {
    return <DominantIntelligenceReport responses={responses.filter(r => r.testType === 'dominant')} onContinue={() => continueFromReport('personality')} />
  }

  if (phase === 'personalityReport') {
    return <PersonalityReport responses={responses.filter(r => r.testType === 'personality')} onContinue={() => continueFromReport('learning')} />
  }

  if (phase === 'learningReport') {
    return <LearningStyleReport responses={responses.filter(r => r.testType === 'learning')} onContinue={() => setPhase('finalReport')} />
  }

  if (phase === 'finalReport') {
    return <TestResults responses={responses} onRestart={onBack} />
  }

  if (phase === 'partComplete') {
    return <PartFeedback part={completedPart!} responses={responses} onContinue={() => continueToNextPart(completedPart!)} />
  }

  return (
    <div className="fixed inset-0 min-h-screen min-w-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Sparkles className="absolute top-10 left-10 w-10 h-10 text-purple-200 opacity-40 animate-pulse" />
        <Star className="absolute bottom-20 right-20 w-8 h-8 text-pink-200 opacity-30 animate-bounce" />
        <Brain className="absolute top-1/2 left-1/4 w-16 h-16 text-indigo-200 opacity-20 animate-float" />
        <Users className="absolute bottom-1/3 right-1/3 w-12 h-12 text-blue-200 opacity-20 animate-float" />
        <Lightbulb className="absolute top-1/4 right-1/5 w-10 h-10 text-yellow-200 opacity-30 animate-pulse" />
        <Zap className="absolute bottom-10 left-1/2 w-8 h-8 text-orange-200 opacity-20 animate-bounce" />
      </div>

      {/* Header */}
      <div className="bg-white/80 shadow-sm border-b backdrop-blur-md z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-600">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              {React.createElement(getTestIcon(currentTest), { className: "w-6 h-6 text-indigo-600" })}
              <h1 className="text-lg font-bold text-gray-900">{getTestTitle(currentTest)}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-600">Question {getCurrentQuestionNumber()} of {getTotalQuestions()}</div>
              <Progress value={getCurrentProgress()} className="w-24" />
            </div>
            <Button variant="ghost" onClick={() => setShowQuitConfirm(true)} className="text-red-600">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] w-full z-10">
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-end">
          <div className="flex-1 overflow-y-auto px-0 py-6 space-y-4" ref={scrollAreaRef} style={{height: 'calc(100vh - 120px)'}}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}> 
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-indigo-600 text-white ml-auto' : 'bg-white/90 text-gray-900 mr-auto'} rounded-2xl px-5 py-3 shadow-md font-medium text-base break-words`}>
                  {message.type === 'bot' || message.type === 'macroFeedback' ? (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ) : message.type === 'user' ? (
                    <div>{message.content}</div>
                  ) : message.type === 'options' ? (
                    <div>
                      <div className="mb-3 font-semibold text-indigo-700">{message.content}</div>
                      <div className="space-y-2">
                        {message.options?.map((option) => (
                          <Button
                            key={option.value}
                            variant="outline"
                            className="w-full justify-start text-left bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900"
                            onClick={() => handleResponse(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : message.type === 'dynamicOptions' ? (
                    <div>
                      <div className="mb-3 font-semibold text-indigo-700">{message.content}</div>
                      <div className="space-y-2">
                        {message.dynamicOptions?.map((option, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-start text-left bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900"
                            onClick={() => handleResponse(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : message.type === 'testActions' ? (
                    <div>
                      <div className="mb-3 font-semibold text-indigo-700">{message.content}</div>
                      <div className="flex flex-wrap gap-2">
                        {message.completedPart ? (
                          <>
                            <Button onClick={() => continueToNextPart(message.completedPart!)}>
                              Continue to Next Part
                            </Button>
                            <Button variant="outline" onClick={() => setPhase('dominantReport')}>
                              View Report
                            </Button>
                          </>
                        ) : message.completedTest === 'dominant' ? (
                          <>
                            <Button onClick={() => continueFromReport('personality')}>
                              Start Personality Test
                            </Button>
                            <Button variant="outline" onClick={() => setPhase('dominantReport')}>
                              View Report
                            </Button>
                          </>
                        ) : message.completedTest === 'personality' ? (
                          <>
                            <Button onClick={() => continueFromReport('learning')}>
                              Start Learning Style Test
                            </Button>
                            <Button variant="outline" onClick={() => setPhase('personalityReport')}>
                              View Report
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => setPhase('finalReport')}>
                              View Final Results
                            </Button>
                            <Button variant="outline" onClick={() => setPhase('learningReport')}>
                              View Learning Report
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Quit Confirmation */}
      {showQuitConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="w-96">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Are you sure you want to quit?</h3>
              <p className="text-gray-600 mb-6">Your progress will be saved, but you'll need to start over to complete the assessment.</p>
              <div className="flex space-x-2">
                <Button onClick={handleQuit} className="flex-1">
                  Yes, Quit
                </Button>
                <Button variant="outline" onClick={() => setShowQuitConfirm(false)} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 