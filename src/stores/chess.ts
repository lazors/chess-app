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
  Leaderboards
} from '@/types/chess'
import { chessComApi } from '@/services/chessComApi'

export const useChessStore = defineStore('chess', () => {
  const profile = ref<ChessComProfile | null>(null)
  const stats = ref<ChessComStats | null>(null)
  const recentGames = ref<ChessComGame[]>([])
  const historicalGames = ref<ChessComGame[]>([])
  const tournaments = ref<Tournament[]>([])
  const clubs = ref<Club[]>([])
  const teamMatches = ref<TeamMatch[]>([])
  const openingStats = ref<OpeningStats[]>([])
  const leaderboards = ref<Partial<Leaderboards>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

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
      openingStats.value = chessComApi.analyzeOpenings(historicalGames.value, username)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch historical games'
      console.error('Error fetching historical games:', err)
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
      await Promise.allSettled([
        fetchUserProfile(username),
        fetchUserStats(username),
        fetchRecentGames(username),
        fetchHistoricalGames(username, 6),
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
    tournaments.value = []
    clubs.value = []
    teamMatches.value = []
    openingStats.value = []
    leaderboards.value = {}
    error.value = null
  }

  return {
    // State
    profile,
    stats,
    recentGames,
    historicalGames,
    tournaments,
    clubs,
    teamMatches,
    openingStats,
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
    fetchTournaments,
    fetchClubs,
    fetchTeamMatches,
    fetchLeaderboards,
    fetchAllUserData,
    clearData
  }
})