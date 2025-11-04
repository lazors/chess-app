/**
 * Centralized logging utility for better error tracking and debugging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: string
  metadata?: Record<string, any>
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private currentLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const levelStr = LogLevel[level]
    const contextStr = context ? `[${context}]` : ''
    return `${timestamp} ${levelStr}${contextStr}: ${message}`
  }

  private addLog(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      metadata
    }

    this.logs.push(logEntry)
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context), metadata)
      this.addLog(LogLevel.DEBUG, message, context, metadata)
    }
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context), metadata)
      this.addLog(LogLevel.INFO, message, context, metadata)
    }
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context), metadata)
      this.addLog(LogLevel.WARN, message, context, metadata)
    }
  }

  error(message: string, context?: string, error?: Error, metadata?: Record<string, any>) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const fullMetadata = { ...metadata }
      if (error) {
        fullMetadata.error = {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }
      console.error(this.formatMessage(LogLevel.ERROR, message, context), fullMetadata)
      this.addLog(LogLevel.ERROR, message, context, fullMetadata)
    }
  }

  /**
   * Get recent logs for debugging
   */
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count)
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * Export logs as JSON string for error reporting
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Global logger instance
export const logger = new Logger()

/**
 * Error boundary decorator for async functions
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string,
  defaultValue?: R
): (...args: T) => Promise<R | undefined> {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      logger.error(
        `Error in ${context}`,
        'ErrorBoundary',
        error instanceof Error ? error : undefined,
        { args: args.slice(0, 3) } // Limit arg logging
      )
      
      if (defaultValue !== undefined) {
        return defaultValue
      }
      
      throw error
    }
  }
}

/**
 * Performance monitoring decorator
 */
export function withPerformanceTracking<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    const startTime = performance.now()
    
    try {
      const result = await fn(...args)
      const duration = performance.now() - startTime
      
      logger.debug(
        `${context} completed in ${duration.toFixed(2)}ms`,
        'Performance'
      )
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      logger.warn(
        `${context} failed after ${duration.toFixed(2)}ms`,
        'Performance',
        { error: error instanceof Error ? error.message : String(error) }
      )
      
      throw error
    }
  }
}