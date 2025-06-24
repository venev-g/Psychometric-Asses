import { useMemo as reactUseMemo } from 'react';

// src/lib/monitoring/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  context?: string
  metadata?: Record<string, any>
  userId?: string
  sessionId?: string
  requestId?: string
  stack?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteEndpoint?: string
  bufferSize: number
  flushInterval: number
  includeStackTrace: boolean
}

export class Logger {
  private config: LoggerConfig
  private buffer: LogEntry[] = []
  private flushTimer?: NodeJS.Timeout

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      bufferSize: 100,
      flushInterval: 30000, // 30 seconds
      includeStackTrace: false,
      ...config
    }

    if (this.config.enableRemote) {
      this.startAutoFlush()
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context, metadata)
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context, metadata)
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context, metadata)
  }

  error(message: string, error?: Error, context?: string, metadata?: Record<string, any>) {
    const logMetadata = {
      ...metadata,
      ...(error && {
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack
      })
    }
    
    this.log(LogLevel.ERROR, message, context, logMetadata)
  }

  fatal(message: string, error?: Error, context?: string, metadata?: Record<string, any>) {
    const logMetadata = {
      ...metadata,
      ...(error && {
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack
      })
    }
    
    this.log(LogLevel.FATAL, message, context, logMetadata)
    
    // Immediately flush fatal errors
    if (this.config.enableRemote) {
      this.flush()
    }
  }

  private log(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>) {
    if (level < this.config.level) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      metadata,
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      requestId: this.getCurrentRequestId()
    }

    if (this.config.includeStackTrace && level >= LogLevel.ERROR) {
      entry.stack = new Error().stack
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry)
    }

    // Buffer for remote logging
    if (this.config.enableRemote) {
      this.buffer.push(entry)
      
      if (this.buffer.length >= this.config.bufferSize) {
        this.flush()
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    const timestamp = entry.timestamp.toISOString()
    const levelName = LogLevel[entry.level]
    const context = entry.context ? `[${entry.context}]` : ''
    const logMessage = `${timestamp} ${levelName} ${context} ${entry.message}`
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.metadata)
        break
      case LogLevel.INFO:
        console.info(logMessage, entry.metadata)
        break
      case LogLevel.WARN:
        console.warn(logMessage, entry.metadata)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, entry.metadata)
        if (entry.stack) {
          console.error(entry.stack)
        }
        break
    }
  }

  private async flush() {
    if (this.buffer.length === 0 || !this.config.remoteEndpoint) {
      return
    }

    const logs = [...this.buffer]
    this.buffer = []

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs })
      })
    } catch (error) {
      console.error('Failed to send logs to remote endpoint:', error)
      // Re-add logs to buffer for retry
      this.buffer.unshift(...logs)
    }
  }

  private startAutoFlush() {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private getCurrentUserId(): string | undefined {
    // Implementation depends on your auth system
    if (typeof window !== 'undefined') {
      return (window as any).currentUserId
    }
    return undefined
  }

  private getCurrentSessionId(): string | undefined {
    // Implementation depends on your session management
    if (typeof window !== 'undefined') {
      return (window as any).sessionId
    }
    return undefined
  }

  private getCurrentRequestId(): string | undefined {
    // Implementation depends on your request tracking
    if (typeof window !== 'undefined') {
      return (window as any).requestId
    }
    return undefined
  }

  // Method to create child logger with context
  child(context: string, metadata?: Record<string, any>): Logger {
    const childLogger = new Logger(this.config)
    
    // Override log method to include context and metadata
    const originalLog = childLogger.log.bind(childLogger)
    childLogger.log = (level, message, childContext?, childMetadata?) => {
      originalLog(level, message, childContext || context, {
        ...metadata,
        ...childMetadata
      })
    }
    
    return childLogger
  }

  // Method to update configuration
  updateConfig(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config }
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    if (this.config.enableRemote) {
      this.startAutoFlush()
    }
  }

  // Method to get log statistics
  getStats(): {
    bufferSize: number
    totalLogged: number
    logsByLevel: Record<string, number>
  } {
    // This would need to be implemented with persistent storage
    return {
      bufferSize: this.buffer.length,
      totalLogged: 0,
      logsByLevel: {}
    }
  }

  // Cleanup method
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    if (this.config.enableRemote) {
      this.flush()
    }
  }
}

// Create default logger instance
export const logger = new Logger({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  remoteEndpoint: '/api/logs'
})

// Convenience functions
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger)
}

// React hook for logging
export function useLogger(context?: string) {
  return useMemo(() => {
    if (context) {
      return logger.child(context)
    }
    return logger
  }, [context])
}
// Import React's useMemo if in a React environment

// Implement useMemo fallback for non-React environments
function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T {
  if (typeof reactUseMemo === 'function') {
    // If React's useMemo is available, use it
    return reactUseMemo(factory, deps);
  } else {
    // Simple fallback implementation for non-React environments
    // This will always run the factory function - no memoization in non-React environments
    return factory();
  }
}
