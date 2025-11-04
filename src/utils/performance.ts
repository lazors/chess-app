/**
 * Memoization utilities for performance optimization
 */

/**
 * Simple memoization with LRU cache
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number
    ttl?: number // Time to live in ms
    keyFn?: (...args: Parameters<T>) => string
  } = {}
): T {
  const { maxSize = 100, ttl = 60000, keyFn } = options
  
  const cache = new Map<string, { 
    value: ReturnType<T>
    timestamp: number 
  }>()

  const getKey = keyFn || ((...args: Parameters<T>) => JSON.stringify(args))

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args)
    const now = Date.now()
    
    // Check if cached result exists and is still valid
    const cached = cache.get(key)
    if (cached && (!ttl || now - cached.timestamp < ttl)) {
      return cached.value
    }

    // Calculate new result
    const result = fn(...args)
    
    // Store in cache
    cache.set(key, { value: result, timestamp: now })
    
    // Cleanup old entries
    if (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value
      if (oldestKey) {
        cache.delete(oldestKey)
      }
    }
    
    return result
  }) as T
}

/**
 * Memoized opening analysis for better performance
 */
export const memoizedOpeningAnalysis = memoize(
  (games: any[], targetUsername: string) => {
    // This will be used to wrap the opening analysis functions
    return { games: games.length, username: targetUsername }
  },
  {
    maxSize: 50,
    ttl: 300000, // 5 minutes
    keyFn: (games, username) => `${username}-${games.length}-${games[0]?.end_time || ''}`
  }
)

/**
 * Debounce function for reducing API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timeout

    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(this, args)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}