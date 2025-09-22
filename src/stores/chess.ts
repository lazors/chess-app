import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChessComProfile, ChessComStats, ChessComGame } from '@/types/chess'
import { chessComApi } from '@/services/chessComApi'

export const useChessStore = defineStore('chess', () => {
  const profile = ref<ChessComProfile | null>(null)
  const stats = ref<ChessComStats | null>(null)
  const recentGames = ref<ChessComGame[]>([])
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

  function clearData() {
    profile.value = null
    stats.value = null
    recentGames.value = []
    error.value = null
  }

  return {
    // State
    profile,
    stats,
    recentGames,
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
    clearData
  }
})