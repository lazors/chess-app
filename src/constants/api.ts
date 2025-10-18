/**
 * API Configuration Constants
 */
export const API_CONFIG = {
  // Base API URL
  BASE_URL: 'https://api.chess.com/pub',
  
  // Timeout settings
  TIMEOUT: 10000, // 10 seconds
  
  // Request retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  
  // Default query parameters
  DEFAULT_GAME_LIMIT: 10,
  DEFAULT_MONTHS_BACK: 6,
  
  // Cache settings
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const

/**
 * Chess Game Constants
 */
export const CHESS_CONFIG = {
  // Opening analysis thresholds
  MIN_GAMES_FOR_OPENING_STAT: 2,
  MAX_OPENING_RESULTS: 15,
  
  // Rating ranges
  MIN_RATING: 0,
  MAX_RATING: 3500,
} as const

/**
 * UI Constants
 */
export const UI_CONFIG = {
  // Animation durations (ms)
  ANIMATION_DURATION_SHORT: 200,
  ANIMATION_DURATION_MEDIUM: 300,
  ANIMATION_DURATION_LONG: 500,
  
  // Breakpoints (px)
  BREAKPOINT_MOBILE: 640,
  BREAKPOINT_TABLET: 768,
  BREAKPOINT_DESKTOP: 1024,
} as const

/**
 * Validation Constants
 */
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 25,
  USERNAME_PATTERN: /^[a-zA-Z0-9_-]+$/,
} as const
