// src/lib/hooks/useAssessment.ts
import { useState, useEffect, useCallback } from 'react'
import type { 
  AssessmentSession, 
  Question, 
  UserResponse, 
  TestType 
} from '@/types/assessment.types'

interface AssessmentState {
  session: AssessmentSession | null
  currentTest: TestType | null
  questions: Question[]
  responses: Map<string, any>
  currentQuestionIndex: number
  isLoading: boolean
  error: string | null
  timeRemaining: number | null
  canGoBack: boolean
  canGoForward: boolean
}

interface AssessmentActions {
  startAssessment: (configurationId: string) => Promise<void>
  submitResponse: (questionId: string, response: any, timeMs?: number) => Promise<void>
  goToQuestion: (index: number) => void
  goNext: () => void
  goBack: () => void
  completeAssessment: () => Promise<void>
  pauseAssessment: () => Promise<void>
  resumeAssessment: () => Promise<void>
  abandonAssessment: () => Promise<void>
}

export function useAssessment(): AssessmentState & AssessmentActions {
  const [state, setState] = useState<AssessmentState>({
    session: null,
    currentTest: null,
    questions: [],
    responses: new Map(),
    currentQuestionIndex: 0,
    isLoading: false,
    error: null,
    timeRemaining: null,
    canGoBack: false,
    canGoForward: false
  })

  // Timer for tracking time remaining
  useEffect(() => {
    if (!state.session || !state.timeRemaining) return

    const timer = setInterval(() => {
      setState(prev => {
        const newTimeRemaining = prev.timeRemaining ? prev.timeRemaining - 1 : null
        
        if (newTimeRemaining === 0) {
          // Auto-complete when time runs out
          completeAssessment()
          return prev
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [state.session?.id, state.timeRemaining])

  // Update navigation state when question index or responses change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      canGoBack: prev.currentQuestionIndex > 0,
      canGoForward: prev.currentQuestionIndex < prev.questions.length - 1
    }))
  }, [state.currentQuestionIndex, state.questions.length])

  const startAssessment = useCallback(async (configurationId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configurationId })
      })

      if (!response.ok) {
        throw new Error('Failed to start assessment')
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        session: data.session,
        currentTest: data.currentTest,
        questions: data.questions,
        responses: new Map(),
        currentQuestionIndex: 0,
        timeRemaining: data.timeLimit ? data.timeLimit * 60 : null,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }))
    }
  }, [])

  const submitResponse = useCallback(async (
    questionId: string, 
    response: any, 
    timeMs?: number
  ) => {
    if (!state.session) return

    try {
      const apiResponse = await fetch('/api/assessments/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.session.id,
          questionId,
          responseValue: response,
          responseTimeMs: timeMs
        })
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to submit response')
      }

      // Update local responses
      setState(prev => {
        const newResponses = new Map(prev.responses)
        newResponses.set(questionId, response)
        return {
          ...prev,
          responses: newResponses,
          error: null
        }
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to submit response'
      }))
    }
  }, [state.session])

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < state.questions.length) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: index
      }))
    }
  }, [state.questions.length])

  const goNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1)
    }))
  }, [])

  const goBack = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0)
    }))
  }, [])

  const completeAssessment = useCallback(async () => {
    if (!state.session) return

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`/api/assessments/session/${state.session.id}/complete-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to complete assessment')
      }

      const _data = await response.json()
      
      setState(prev => ({
        ...prev,
        session: { ...prev.session!, status: 'completed' },
        isLoading: false
      }))

      // Redirect to results
      window.location.href = `/results/${state.session.id}`
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to complete assessment',
        isLoading: false
      }))
    }
  }, [state.session])

  const pauseAssessment = useCallback(async () => {
    if (!state.session) return

    try {
      await fetch(`/api/assessments/${state.session.id}/pause`, {
        method: 'POST'
      })

      setState(prev => ({
        ...prev,
        session: prev.session ? { ...prev.session, status: 'in_progress' } : null
      }))
    } catch (error) {
      console.error('Failed to pause assessment:', error)
    }
  }, [state.session])

  const resumeAssessment = useCallback(async () => {
    if (!state.session) return

    try {
      await fetch(`/api/assessments/${state.session.id}/resume`, {
        method: 'POST'
      })

      setState(prev => ({
        ...prev,
        session: prev.session ? { ...prev.session, status: 'in_progress' } : null
      }))
    } catch (error) {
      console.error('Failed to resume assessment:', error)
    }
  }, [state.session])

  const abandonAssessment = useCallback(async () => {
    if (!state.session) return

    try {
      await fetch(`/api/assessments/${state.session.id}/abandon`, {
        method: 'POST'
      })

      setState(prev => ({
        ...prev,
        session: prev.session ? { ...prev.session, status: 'abandoned' } : null
      }))
    } catch (error) {
      console.error('Failed to abandon assessment:', error)
    }
  }, [state.session])

  return {
    ...state,
    startAssessment,
    submitResponse,
    goToQuestion,
    goNext,
    goBack,
    completeAssessment,
    pauseAssessment,
    resumeAssessment,
    abandonAssessment
  }
}

// Additional assessment-related hooks
export function useAssessmentResults(sessionId: string) {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/assessments/session/${sessionId}/results`)
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }
        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      fetchResults()
    }
  }, [sessionId])

  return { results, isLoading, error }
}

export function useAssessmentHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/assessments/history')
        if (!response.ok) {
          throw new Error('Failed to fetch history')
        }
        const data = await response.json()
        setHistory(data.sessions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/assessments/history')
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      const data = await response.json()
      setHistory(data.sessions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { history, isLoading, error, refresh }
}