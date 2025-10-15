import { ref, computed, type Ref, type ComputedRef } from 'vue'

interface ApiCallOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  retries?: number
  retryDelay?: number
}

interface ApiCallReturn<T> {
  loading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  data: ComputedRef<T | null>
  execute: (apiFunction: () => Promise<T>, options?: ApiCallOptions<T>) => Promise<T | null>
  reset: () => void
}

/**
 * Composable for handling API calls with consistent loading, error, and success states
 */
export function useApiCall<T>(): ApiCallReturn<T> {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T | null>(null)

  const execute = async (
    apiFunction: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
      retries?: number
      retryDelay?: number
    }
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    const { onSuccess, onError, retries = 0, retryDelay = 1000 } = options || {}

    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await apiFunction()
        data.value = result
        onSuccess?.(result)
        return result
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error')
        
        if (attempt < retries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
          continue
        }
        
        // Final attempt failed
        const errorMessage = lastError.message || 'An error occurred'
        error.value = errorMessage
        onError?.(lastError)
        console.error('API call failed:', lastError)
        break
      }
    }

    return null
  }

  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    data: computed(() => data.value),
    execute,
    reset
  }
}

/**
 * Composable for handling multiple concurrent API calls
 */
export function useApiBatch() {
  const loading = ref(false)
  const errors = ref<string[]>([])
  const results = ref<any[]>([])

  const executeBatch = async <T>(
    apiCalls: Array<() => Promise<T>>,
    options?: {
      failFast?: boolean
      onProgress?: (completed: number, total: number) => void
    }
  ): Promise<(T | null)[]> => {
    loading.value = true
    errors.value = []
    results.value = []

    const { failFast = false, onProgress } = options || {}

    if (failFast) {
      try {
        const allResults = await Promise.all(apiCalls.map(call => call()))
        results.value = allResults
        return allResults
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Batch operation failed'
        errors.value = [errorMessage]
        throw error
      } finally {
        loading.value = false
      }
    } else {
      // Execute with settlement (don't fail fast)
      const promises = apiCalls.map(async (call, index) => {
        try {
          const result = await call()
          onProgress?.(index + 1, apiCalls.length)
          return result
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Call ${index} failed`
          errors.value.push(errorMessage)
          return null
        }
      })

      const allResults = await Promise.allSettled(promises)
      const finalResults = allResults.map(result => 
        result.status === 'fulfilled' ? result.value : null
      )
      
      results.value = finalResults
      loading.value = false
      return finalResults
    }
  }

  return {
    loading: computed(() => loading.value),
    errors: computed(() => errors.value),
    results: computed(() => results.value),
    executeBatch
  }
}

/**
 * Utility function to create a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Utility function to retry an operation with exponential backoff
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt < maxRetries) {
        const delayMs = baseDelay * Math.pow(2, attempt)
        await delay(delayMs)
        continue
      }
    }
  }

  throw lastError!
}