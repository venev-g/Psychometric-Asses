// src/lib/monitoring/errorTracking.ts
interface ErrorContext {
  userId?: string
  sessionId?: string
  assessmentId?: string
  url?: string
  userAgent?: string
  timestamp: Date
  metadata?: Record<string, any>
}

interface ErrorReport {
  id: string
  message: string
  stack?: string
  type: 'javascript' | 'network' | 'assessment' | 'auth' | 'database'
  severity: 'low' | 'medium' | 'high' | 'critical'
  context: ErrorContext
  resolved: boolean
  createdAt: Date
}

class ErrorTracker {
  private errorReports: ErrorReport[] = []
  private listeners: ((error: ErrorReport) => void)[] = []

  constructor() {
    this.setupGlobalErrorHandlers()
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        type: 'javascript',
        severity: 'high',
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date()
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        type: 'javascript',
        severity: 'high',
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date()
        }
      })
    })
  }

  captureError(error: Omit<ErrorReport, 'id' | 'resolved' | 'createdAt'>) {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      resolved: false,
      createdAt: new Date(),
      ...error
    }

    this.errorReports.push(errorReport)
    this.notifyListeners(errorReport)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorReport)
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorReport)
    }

    return errorReport.id
  }

  captureAssessmentError(assessmentId: string, error: Error, context?: Record<string, any>) {
    return this.captureError({
      message: error.message,
      stack: error.stack,
      type: 'assessment',
      severity: 'medium',
      context: {
        assessmentId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        metadata: context
      }
    })
  }

  captureNetworkError(url: string, status: number, statusText: string, context?: Record<string, any>) {
    return this.captureError({
      message: `Network error: ${status} ${statusText}`,
      type: 'network',
      severity: status >= 500 ? 'high' : 'medium',
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        metadata: {
          requestUrl: url,
          status,
          statusText,
          ...context
        }
      }
    })
  }

  captureAuthError(error: Error, context?: Record<string, any>) {
    return this.captureError({
      message: error.message,
      stack: error.stack,
      type: 'auth',
      severity: 'high',
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        metadata: context
      }
    })
  }

  addListener(listener: (error: ErrorReport) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (error: ErrorReport) => void) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  getErrors(filters?: {
    type?: ErrorReport['type']
    severity?: ErrorReport['severity']
    resolved?: boolean
    since?: Date
  }): ErrorReport[] {
    let filtered = this.errorReports

    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(error => error.type === filters.type)
      }
      if (filters.severity) {
        filtered = filtered.filter(error => error.severity === filters.severity)
      }
      if (filters.resolved !== undefined) {
        filtered = filtered.filter(error => error.resolved === filters.resolved)
      }
      if (filters.since) {
        filtered = filtered.filter(error => error.createdAt >= filters.since!)
      }
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  markResolved(errorId: string) {
    const error = this.errorReports.find(e => e.id === errorId)
    if (error) {
      error.resolved = true
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private notifyListeners(error: ErrorReport) {
    this.listeners.forEach(listener => {
      try {
        listener(error)
      } catch (e) {
        console.error('Error in error listener:', e)
      }
    })
  }

  private async sendToExternalService(error: ErrorReport) {
    try {
      // Example: Send to your error tracking service
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      })
    } catch (e) {
      console.error('Failed to send error to external service:', e)
    }
  }

  // Method to clear old errors (call periodically)
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000) { // 7 days default
    const cutoff = new Date(Date.now() - maxAge)
    this.errorReports = this.errorReports.filter(error => error.createdAt >= cutoff)
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker()

// Utility functions for common error patterns
export function withErrorTracking<T extends (...args: any[]) => any>(
  fn: T,
  context?: Record<string, any>
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result.catch(error => {
          errorTracker.captureError({
            message: error.message,
            stack: error.stack,
            type: 'javascript',
            severity: 'medium',
            context: {
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: new Date(),
              metadata: context
            }
          })
          throw error
        })
      }
      return result
    } catch (error) {
      errorTracker.captureError({
        message: (error as Error).message,
        stack: (error as Error).stack,
        type: 'javascript',
        severity: 'medium',
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          metadata: context
        }
      })
      throw error
    }
  }) as T
}

export type { ErrorReport, ErrorContext }