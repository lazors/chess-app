import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ChessComProfile,
  ChessComStats,
  ChessComGame,
  Tournament,
  Club,
  TeamMatch,
  OpeningStats,
  ColoredOpeningStats,
  ColorSeparatedStats,
  Leaderboards,
  BestGame
} from '@/types/chess'
import { chessComApi } from '@/services/chessComApi'

export const useChessStore = defineStore('chess', () => {
  const profile = ref<ChessComProfile | null>(null)
  const stats = ref<ChessComStats | null>(null)
  const recentGames = ref<ChessComGame[]>([])
  const historicalGames = ref<ChessComGame[]>([])
  const bestGames = ref<BestGame[]>([])
  const tournaments = ref<Tournament[]>([])
  const clubs = ref<Club[]>([])
  const teamMatches = ref<TeamMatch[]>([])
  const openingStats = ref<OpeningStats[]>([])
  const coloredOpeningStats = ref<ColoredOpeningStats>({
    white: [],
    black: [],
    combined: []
  })
  const colorSeparatedStats = ref<ColorSeparatedStats>({
    white: { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
    black: { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
    combined: { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 }
  })
  const leaderboards = ref<Partial<Leaderboards>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Error handling wrapper to reduce code duplication
  async function withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    setLoadingState = true
  ): Promise<T | null> {
    if (setLoadingState) loading.value = true
    error.value = null

    try {
      const result = await operation()
      return result
    } catch (err) {
      const finalErrorMessage = err instanceof Error ? err.message : errorMessage
      error.value = finalErrorMessage
      console.error(errorMessage, err)
      return null
    } finally {
      if (setLoadingState) loading.value = false
    }
  }

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const hasProfile = computed(() => profile.value !== null)

  const rapidRating = computed(() => {
    return stats.value?.chess_rapid?.last?.rating || null
  })

  const blitzRating = computed(() => {
    return stats.value?.chess_blitz?.last?.rating || null
  })

  const bulletRating = computed(() => {
    return stats.value?.chess_bullet?.last?.rating || null
  })

  const dailyRating = computed(() => {
    return stats.value?.chess_daily?.last?.rating || null
  })

  const winLossRecord = computed(() => {
    if (!stats.value) return null

    let totalWins = 0
    let totalLosses = 0
    let totalDraws = 0

    const gameTypes = ['chess_rapid', 'chess_blitz', 'chess_bullet', 'chess_daily'] as const

    gameTypes.forEach(gameType => {
      const record = stats.value?.[gameType]?.record
      if (record) {
        totalWins += record.win
        totalLosses += record.loss
        totalDraws += record.draw
      }
    })

    return {
      wins: totalWins,
      losses: totalLosses,
      draws: totalDraws,
      total: totalWins + totalLosses + totalDraws
    }
  })

  async function fetchUserProfile(username: string) {
    loading.value = true
    error.value = null

    try {
      profile.value = await chessComApi.getUserProfile(username)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch profile'
      console.error('Error fetching profile:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUserStats(username: string) {
    loading.value = true
    error.value = null

    try {
      stats.value = await chessComApi.getUserStats(username)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch stats'
      console.error('Error fetching stats:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRecentGames(username: string, limit = 10) {
    loading.value = true
    error.value = null

    try {
      recentGames.value = await chessComApi.getRecentGames(username, limit)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch recent games'
      console.error('Error fetching recent games:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTournaments(username: string) {
    loading.value = true
    error.value = null

    try {
      tournaments.value = await chessComApi.getPlayerTournaments(username)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tournaments'
      console.error('Error fetching tournaments:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchClubs(username: string) {
    loading.value = true
    error.value = null

    try {
      clubs.value = await chessComApi.getPlayerClubs(username)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch clubs'
      console.error('Error fetching clubs:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTeamMatches(username: string) {
    loading.value = true
    error.value = null

    try {
      teamMatches.value = await chessComApi.getPlayerMatches(username)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch team matches'
      console.error('Error fetching team matches:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchHistoricalGames(username: string, monthsBack = 6) {
    loading.value = true
    error.value = null

    try {
      historicalGames.value = await chessComApi.getHistoricalGames(username, monthsBack)
      
      // Calculate color-separated opening statistics
      coloredOpeningStats.value = chessComApi.analyzeOpeningsByColor(historicalGames.value, username)
      
      // Calculate color-separated overall statistics
      colorSeparatedStats.value = chessComApi.analyzeGamesByColor(historicalGames.value, username)
      
      // Keep backward compatibility
      openingStats.value = coloredOpeningStats.value.combined
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch historical games'
      console.error('Error fetching historical games:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchBestGames(username: string, monthsBack = 6, limit = 10) {
    loading.value = true
    error.value = null

    try {
      bestGames.value = await chessComApi.getBestGames(username, monthsBack, limit)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch best games'
      console.error('Error fetching best games:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchLeaderboards() {
    loading.value = true
    error.value = null

    try {
      leaderboards.value = await chessComApi.getLeaderboards()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch leaderboards'
      console.error('Error fetching leaderboards:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAllUserData(username: string) {
    loading.value = true
    error.value = null

    try {
      // Rate-limited API calls to prevent exceeding Chess.com API limits
      // Phase 1: Core user data
      await Promise.allSettled([
        fetchUserProfile(username),
        fetchUserStats(username)
      ])
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Phase 2: Game data (more intensive calls)
      await Promise.allSettled([
        fetchRecentGames(username),
        fetchHistoricalGames(username, 6),
        fetchBestGames(username, 6, 5)
      ])
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Phase 3: Community data
      await Promise.allSettled([
        fetchTournaments(username),
        fetchClubs(username),
        fetchTeamMatches(username)
      ])
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch complete user data'
      console.error('Error fetching complete user data:', err)
    } finally {
      loading.value = false
    }
  }

  function clearData() {
    profile.value = null
    stats.value = null
    recentGames.value = []
    historicalGames.value = []
    bestGames.value = []
    tournaments.value = []
    clubs.value = []
    teamMatches.value = []
    openingStats.value = []
    coloredOpeningStats.value = { white: [], black: [], combined: [] }
    colorSeparatedStats.value = {
      white: { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
      black: { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
      combined: { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 }
    }
    leaderboards.value = {}
    error.value = null
  }

  return {
    // State
    profile,
    stats,
    recentGames,
    historicalGames,
    bestGames,
    tournaments,
    clubs,
    teamMatches,
    openingStats,
    coloredOpeningStats,
    colorSeparatedStats,
    leaderboards,
    loading,
    error,

    // Getters
    isLoading,
    hasError,
    hasProfile,
    rapidRating,
    blitzRating,
    bulletRating,
    dailyRating,
    winLossRecord,

    // Actions
    fetchUserProfile,
    fetchUserStats,
    fetchRecentGames,
    fetchHistoricalGames,
    fetchBestGames,
    fetchTournaments,
    fetchClubs,
    fetchTeamMatches,
    fetchLeaderboards,
    fetchAllUserData,
    clearData
  }
})