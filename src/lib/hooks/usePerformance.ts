// src/lib/hooks/usePerformance.ts
import { useState, useEffect, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  responseTime: number
  renderTime: number
  memoryUsage?: number
  networkRequests: number
  errorCount: number
  interactionCount: number
}

interface PerformanceEntry {
  id: string
  type: 'navigation' | 'interaction' | 'api_call' | 'render'
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    renderTime: 0,
    networkRequests: 0,
    errorCount: 0,
    interactionCount: 0
  })
  const [entries, setEntries] = useState<PerformanceEntry[]>([])
  const entriesRef = useRef<Map<string, PerformanceEntry>>(new Map())

  // Start tracking a performance entry
  const startTracking = useCallback((id: string, type: PerformanceEntry['type'], metadata?: Record<string, any>) => {
    const entry: PerformanceEntry = {
      id,
      type,
      startTime: performance.now(),
      metadata
    }
    
    entriesRef.current.set(id, entry)
    return id
  }, [])

  // End tracking a performance entry
  const endTracking = useCallback((id: string) => {
    const entry = entriesRef.current.get(id)
    if (entry) {
      const endTime = performance.now()
      const completedEntry: PerformanceEntry = {
        ...entry,
        endTime,
        duration: endTime - entry.startTime
      }
      
      entriesRef.current.delete(id)
      setEntries(prev => [...prev, completedEntry])
      
      // Update metrics based on entry type
      setMetrics(prev => {
        const newMetrics = { ...prev }
        
        switch (entry.type) {
          case 'api_call':
            newMetrics.networkRequests += 1
            newMetrics.responseTime = completedEntry.duration || 0
            break
          case 'render':
            newMetrics.renderTime = completedEntry.duration || 0
            break
          case 'interaction':
            newMetrics.interactionCount += 1
            break
        }
        
        return newMetrics
      })
      
      return completedEntry
    }
    return null
  }, [])

  // Track an error
  const trackError = useCallback((error: Error, context?: string) => {
    setMetrics(prev => ({ ...prev, errorCount: prev.errorCount + 1 }))
    
    const errorEntry: PerformanceEntry = {
      id: `error_${Date.now()}`,
      type: 'interaction',
      startTime: performance.now(),
      endTime: performance.now(),
      duration: 0,
      metadata: {
        error: error.message,
        context,
        stack: error.stack
      }
    }
    
    setEntries(prev => [...prev, errorEntry])
  }, [])

  // Track API calls
  const trackApiCall = useCallback(async <T>(
    promise: Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const trackingId = startTracking(`api_${endpoint}_${Date.now()}`, 'api_call', { endpoint })
    
    try {
      const result = await promise
      endTracking(trackingId)
      return result
    } catch (error) {
      endTracking(trackingId)
      trackError(error as Error, `API call to ${endpoint}`)
      throw error
    }
  }, [startTracking, endTracking, trackError])

  // Track component render time
  const trackRender = useCallback((componentName: string) => {
    const trackingId = startTracking(`render_${componentName}_${Date.now()}`, 'render', { componentName })
    
    return () => {
      endTracking(trackingId)
    }
  }, [startTracking, endTracking])

  // Get performance summary
  const getSummary = useCallback(() => {
    const apiCalls = entries.filter(e => e.type === 'api_call')
    const renders = entries.filter(e => e.type === 'render')
    const interactions = entries.filter(e => e.type === 'interaction')
    
    return {
      totalEntries: entries.length,
      averageApiResponseTime: apiCalls.length > 0 
        ? apiCalls.reduce((sum, e) => sum + (e.duration || 0), 0) / apiCalls.length 
        : 0,
      averageRenderTime: renders.length > 0
        ? renders.reduce((sum, e) => sum + (e.duration || 0), 0) / renders.length
        : 0,
      totalInteractions: interactions.length,
      slowestOperations: entries
        .filter(e => e.duration)
        .sort((a, b) => (b.duration || 0) - (a.duration || 0))
        .slice(0, 5)
    }
  }, [entries])

  // Clear metrics and entries
  const reset = useCallback(() => {
    setMetrics({
      responseTime: 0,
      renderTime: 0,
      networkRequests: 0,
      errorCount: 0,
      interactionCount: 0
    })
    setEntries([])
    entriesRef.current.clear()
  }, [])

  // Monitor memory usage (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize
        }))
      }

      const interval = setInterval(updateMemoryUsage, 5000)
      return () => clearInterval(interval)
    }
  }, [])

  return {
    metrics,
    entries,
    startTracking,
    endTracking,
    trackError,
    trackApiCall,
    trackRender,
    getSummary,
    reset
  }
}

// Hook for tracking page load performance
export function usePagePerformance() {
  const [loadMetrics, setLoadMetrics] = useState<{
    loadTime: number
    domContentLoadedTime: number
    firstContentfulPaint: number
    largestContentfulPaint: number
  } | null>(null)

  useEffect(() => {
    const measurePagePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paintEntries = performance.getEntriesByType('paint')
      
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      setLoadMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: fcp?.startTime || 0,
        largestContentfulPaint: 0 // Would need additional LCP observer
      })
    }

    if (document.readyState === 'complete') {
      measurePagePerformance()
    } else {
      window.addEventListener('load', measurePagePerformance)
      return () => window.removeEventListener('load', measurePagePerformance)
    }
  }, [])

  return loadMetrics
}

// Hook for tracking Core Web Vitals
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    lcp: number | null
    fid: number | null
    cls: number | null
  }>({
    lcp: null,
    fid: null,
    cls: null
  })

  useEffect(() => {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }))
    })

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          setVitals(prev => ({ ...prev, cls: clsValue }))
        }
      }
    })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        setVitals(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
      }
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('Performance observers not supported')
    }

    return () => {
      lcpObserver.disconnect()
      clsObserver.disconnect()
      fidObserver.disconnect()
    }
  }, [])

  return vitals
}