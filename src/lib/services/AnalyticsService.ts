// src/lib/services/AnalyticsService.ts
import type { AnalyticsQuery, AnalyticsResponse } from '@/types/api.types'

export interface AnalyticsEvent {
  name: string
  properties: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId?: string
}

export interface UserMetrics {
  totalAssessments: number
  completedAssessments: number
  averageScore: number
  totalTimeSpent: number
  lastActivityDate: Date
  streakDays: number
}

export interface SystemMetrics {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  assessmentCompletionRate: number
  averageSessionDuration: number
  errorRate: number
  responseTime: number
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private apiUrl = '/api/analytics'

  // Track user events
  async trackEvent(name: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      },
      timestamp: new Date()
    }

    // Add to local queue
    this.events.push(event)

    // Send to server
    try {
      await fetch(`${this.apiUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  // Assessment-specific tracking
  async trackAssessmentStart(assessmentType: string, sessionId: string) {
    return this.trackEvent('assessment_started', {
      assessmentType,
      sessionId
    })
  }

  async trackAssessmentComplete(
    assessmentType: string, 
    sessionId: string, 
    duration: number,
    score: number
  ) {
    return this.trackEvent('assessment_completed', {
      assessmentType,
      sessionId,
      duration,
      score
    })
  }

  async trackQuestionResponse(
    questionId: string,
    responseTime: number,
    questionType: string
  ) {
    return this.trackEvent('question_answered', {
      questionId,
      responseTime,
      questionType
    })
  }

  async trackPageView(page: string, additionalData: Record<string, any> = {}) {
    return this.trackEvent('page_view', {
      page,
      ...additionalData
    })
  }

  async trackUserAction(action: string, target: string, value?: any) {
    return this.trackEvent('user_action', {
      action,
      target,
      value
    })
  }

  async trackError(error: Error, context?: string) {
    return this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context
    })
  }

  async trackPerformance(metric: string, value: number, context?: string) {
    return this.trackEvent('performance', {
      metric,
      value,
      context
    })
  }

  // Data retrieval methods
  async getUserMetrics(userId: string): Promise<UserMetrics> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}/metrics`)
      if (!response.ok) throw new Error('Failed to fetch user metrics')
      return response.json()
    } catch (error) {
      console.error('Error fetching user metrics:', error)
      throw error
    }
  }

  async getSystemMetrics(timeRange: { start: string; end: string }): Promise<SystemMetrics> {
    try {
      const params = new URLSearchParams({
        start: timeRange.start,
        end: timeRange.end
      })
      
      const response = await fetch(`${this.apiUrl}/system/metrics?${params}`)
      if (!response.ok) throw new Error('Failed to fetch system metrics')
      return response.json()
    } catch (error) {
      console.error('Error fetching system metrics:', error)
      throw error
    }
  }

  async getAssessmentAnalytics(assessmentType?: string): Promise<any> {
    try {
      const params = assessmentType ? `?type=${assessmentType}` : ''
      const response = await fetch(`${this.apiUrl}/assessments${params}`)
      if (!response.ok) throw new Error('Failed to fetch assessment analytics')
      return response.json()
    } catch (error) {
      console.error('Error fetching assessment analytics:', error)
      throw error
    }
  }

  async executeQuery(query: AnalyticsQuery): Promise<AnalyticsResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      })
      
      if (!response.ok) throw new Error('Failed to execute analytics query')
      return response.json()
    } catch (error) {
      console.error('Error executing analytics query:', error)
      throw error
    }
  }

  // Real-time analytics
  async getDashboardData(): Promise<{
    activeUsers: number
    ongoingAssessments: number
    completedToday: number
    averageScore: number
    topAssessments: Array<{ name: string; count: number }>
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/dashboard`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      return response.json()
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }

  // Batch operations
  async flushEvents(): Promise<void> {
    if (this.events.length === 0) return

    try {
      await fetch(`${this.apiUrl}/events/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: this.events })
      })
      
      this.events = []
    } catch (error) {
      console.error('Failed to flush events:', error)
    }
  }

  // Setup automatic event flushing
  startBatchProcessing(intervalMs: number = 30000) {
    setInterval(() => {
      this.flushEvents()
    }, intervalMs)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushEvents()
      })
    }
  }

  // Conversion tracking
  async trackConversion(event: string, value?: number, currency?: string) {
    return this.trackEvent('conversion', {
      event,
      value,
      currency
    })
  }

  // A/B testing support
  async trackExperiment(experimentId: string, variant: string, metric?: string) {
    return this.trackEvent('experiment', {
      experimentId,
      variant,
      metric
    })
  }

  // Cohort analysis helpers
  async getCohortData(cohortType: 'daily' | 'weekly' | 'monthly') {
    try {
      const response = await fetch(`${this.apiUrl}/cohorts/${cohortType}`)
      if (!response.ok) throw new Error('Failed to fetch cohort data')
      return response.json()
    } catch (error) {
      console.error('Error fetching cohort data:', error)
      throw error
    }
  }

  // Funnel analysis
  async getFunnelAnalysis(steps: string[]) {
    try {
      const response = await fetch(`${this.apiUrl}/funnel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps })
      })
      
      if (!response.ok) throw new Error('Failed to fetch funnel analysis')
      return response.json()
    } catch (error) {
      console.error('Error fetching funnel analysis:', error)
      throw error
    }
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analyticsService.trackEvent.bind(analyticsService),
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    trackUserAction: analyticsService.trackUserAction.bind(analyticsService),
    trackError: analyticsService.trackError.bind(analyticsService),
    trackAssessmentStart: analyticsService.trackAssessmentStart.bind(analyticsService),
    trackAssessmentComplete: analyticsService.trackAssessmentComplete.bind(analyticsService),
    trackConversion: analyticsService.trackConversion.bind(analyticsService)
  }
}