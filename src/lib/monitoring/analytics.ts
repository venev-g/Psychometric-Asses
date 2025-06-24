// src/lib/monitoring/analytics.ts
import { analyticsService } from '../services/AnalyticsService'

export interface PageViewData {
  page: string
  title: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export interface ConversionGoal {
  name: string
  value?: number
  currency?: string
  category?: string
}

export class Analytics {
  private initialized = false
  private userId?: string
  private sessionId: string
  private pageLoadTime: number
  private customDimensions: Record<string, string> = {}

  constructor() {
    this.sessionId = this.generateSessionId()
    this.pageLoadTime = Date.now()
    this.init()
  }

  private init(): void {
    if (typeof window === 'undefined' || this.initialized) return

    // Track initial page load
    if (document.readyState === 'complete') {
      this.trackPageLoad()
    } else {
      window.addEventListener('load', () => this.trackPageLoad())
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', { sessionDuration: Date.now() - this.pageLoadTime })
      } else {
        this.trackEvent('page_visible')
      }
    })

    // Track beforeunload for session duration
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', { sessionDuration: Date.now() - this.pageLoadTime })
    })

    this.initialized = true
  }

  // Set user identity
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId
    analyticsService.trackEvent('user_identified', {
      userId,
      ...traits,
      sessionId: this.sessionId
    })
  }

  // Track page views
  page(data: PageViewData): void {
    const pageData = {
      ...data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...this.customDimensions,
      ...this.getUrlParameters()
    }

    analyticsService.trackPageView(data.page, pageData)
  }

  // Track events
  track(eventName: string, properties: Record<string, any> = {}): void {
    const eventData = {
      ...properties,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      ...this.customDimensions
    }

    analyticsService.trackEvent(eventName, eventData)
  }

  // Convenience method for tracking events
  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    this.track(eventName, properties)
  }

  // Track conversions/goals
  trackGoal(goal: ConversionGoal): void {
    this.track('goal_completed', {
      goalName: goal.name,
      goalValue: goal.value,
      goalCurrency: goal.currency,
      goalCategory: goal.category
    })

    analyticsService.trackConversion(goal.name, goal.value, goal.currency)
  }

  // Assessment-specific tracking
  trackAssessmentStarted(assessmentType: string, sessionId: string): void {
    this.track('assessment_started', {
      assessmentType,
      assessmentSessionId: sessionId
    })
    analyticsService.trackAssessmentStart(assessmentType, sessionId)
  }

  trackAssessmentCompleted(
    assessmentType: string, 
    sessionId: string, 
    duration: number,
    score: number
  ): void {
    this.track('assessment_completed', {
      assessmentType,
      assessmentSessionId: sessionId,
      duration,
      score
    })
    analyticsService.trackAssessmentComplete(assessmentType, sessionId, duration, score)
  }

  trackQuestionAnswered(
    questionId: string,
    questionType: string,
    responseTime: number,
    assessmentType: string
  ): void {
    this.track('question_answered', {
      questionId,
      questionType,
      responseTime,
      assessmentType
    })
    analyticsService.trackQuestionResponse(questionId, responseTime, questionType)
  }

  trackAssessmentAbandoned(
    assessmentType: string,
    sessionId: string,
    questionsCompleted: number,
    totalQuestions: number
  ): void {
    this.track('assessment_abandoned', {
      assessmentType,
      assessmentSessionId: sessionId,
      questionsCompleted,
      totalQuestions,
      completionRate: (questionsCompleted / totalQuestions) * 100
    })
  }

  // User engagement tracking
  trackButtonClick(buttonName: string, context?: string): void {
    this.track('button_clicked', {
      buttonName,
      context,
      page: window.location.pathname
    })
  }

  trackFormSubmission(formName: string, success: boolean, errors?: string[]): void {
    this.track('form_submitted', {
      formName,
      success,
      errors,
      page: window.location.pathname
    })
  }

  trackDownload(fileName: string, fileType: string, fileSize?: number): void {
    this.track('file_downloaded', {
      fileName,
      fileType,
      fileSize
    })
  }

  trackSearch(query: string, resultsCount: number, filters?: Record<string, any>): void {
    this.track('search_performed', {
      query,
      resultsCount,
      filters
    })
  }

  trackError(error: Error, context?: string): void {
    this.track('error_occurred', {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      context,
      page: window.location.pathname
    })
    analyticsService.trackError(error, context)
  }

  // Performance tracking
  trackPageLoad(): void {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paintEntries = performance.getEntriesByType('paint')

    const metrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      timeToInteractive: navigation.domInteractive - navigation.startTime,
      page: window.location.pathname
    }

    this.track('page_load', metrics)
  }

  trackPerformanceMetric(metricName: string, value: number, unit: string): void {
    this.track('performance_metric', {
      metricName,
      value,
      unit,
      page: window.location.pathname
    })
    analyticsService.trackPerformance(metricName, value)
  }

  // A/B testing support
  trackExperiment(experimentId: string, variant: string): void {
    this.track('experiment_viewed', {
      experimentId,
      variant
    })
    analyticsService.trackExperiment(experimentId, variant)
  }

  trackExperimentConversion(experimentId: string, variant: string, goal: string): void {
    this.track('experiment_converted', {
      experimentId,
      variant,
      goal
    })
    analyticsService.trackExperiment(experimentId, variant, goal)
  }

  // Custom dimensions
  setCustomDimension(key: string, value: string): void {
    this.customDimensions[key] = value
  }

  removeCustomDimension(key: string): void {
    delete this.customDimensions[key]
  }

  // Session management
  startNewSession(): void {
    this.sessionId = this.generateSessionId()
    this.pageLoadTime = Date.now()
    this.track('session_started')
  }

  // Helper methods
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getUrlParameters(): Record<string, string> {
    if (typeof window === 'undefined') return {}

    const params = new URLSearchParams(window.location.search)
    const urlParams: Record<string, string> = {}

    // Track UTM parameters
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    utmParams.forEach(param => {
      const value = params.get(param)
      if (value) {
        urlParams[param] = value
      }
    })

    return urlParams
  }

  // Get current session data
  getSessionInfo(): {
    sessionId: string
    userId?: string
    customDimensions: Record<string, string>
    sessionDuration: number
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      customDimensions: { ...this.customDimensions },
      sessionDuration: Date.now() - this.pageLoadTime
    }
  }
}

// Create singleton instance
export const analytics = new Analytics()

// Convenience exports
export const {
  identify,
  page,
  track,
  trackEvent,
  trackGoal,
  trackAssessmentStarted,
  trackAssessmentCompleted,
  trackQuestionAnswered,
  trackButtonClick,
  trackFormSubmission,
  trackError,
  setCustomDimension
} = analytics

// React hook for analytics
export function useAnalytics() {
  return {
    identify: analytics.identify.bind(analytics),
    page: analytics.page.bind(analytics),
    track: analytics.track.bind(analytics),
    trackGoal: analytics.trackGoal.bind(analytics),
    trackAssessmentStarted: analytics.trackAssessmentStarted.bind(analytics),
    trackAssessmentCompleted: analytics.trackAssessmentCompleted.bind(analytics),
    trackQuestionAnswered: analytics.trackQuestionAnswered.bind(analytics),
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setCustomDimension: analytics.setCustomDimension.bind(analytics)
  }
}