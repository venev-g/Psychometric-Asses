// src/lib/monitoring/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(operation: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, [])
      }
      
      this.metrics.get(operation)!.push(duration)
    }
  }

  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation)
    if (!times || times.length === 0) return 0
    
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  getStats() {
    const stats: Record<string, any> = {}
    
    for (const [operation, times] of this.metrics.entries()) {
      if (times.length > 0) {
        stats[operation] = {
          count: times.length,
          average: this.getAverageTime(operation),
          min: Math.min(...times),
          max: Math.max(...times)
        }
      }
    }
    
    return stats
  }

  reset() {
    this.metrics.clear()
  }
}

// Usage example
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  operation: string,
  fn: T
): T {
  return ((...args: any[]) => {
    const monitor = PerformanceMonitor.getInstance()
    const stopTimer = monitor.startTimer(operation)
    
    try {
      const result = fn(...args)
      
      if (result instanceof Promise) {
        return result.finally(() => stopTimer())
      }
      
      stopTimer()
      return result
    } catch (error) {
      stopTimer()
      throw error
    }
  }) as T
}