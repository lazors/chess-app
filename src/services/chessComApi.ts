import axios from 'axios'
import type {
  ChessComProfile,
  ChessComStats,
  ChessComGame,
  GameArchive,
  Tournament,
  Club,
  TeamMatch,
  OpeningStats,
  ColoredOpeningStats,
  ColorSeparatedStats,
  Leaderboards,
  BestGame
} from '@/types/chess'
import { getOpeningName, getBaseOpeningName } from '@/data/ecoMappings'
import { API_CONFIG, CHESS_CONFIG } from '@/constants/api'

const CHESS_COM_API_BASE = import.meta.env.VITE_CHESS_API_BASE || API_CONFIG.BASE_URL

export class ChessComApiService {
  private axiosInstance = axios.create({
    baseURL: CHESS_COM_API_BASE,
    timeout: API_CONFIG.TIMEOUT,
  })

  // Request cache with TTL
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  private isValidCache(cacheEntry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && this.isValidCache(cached)) {
      return cached.data
    }
    if (cached) {
      this.cache.delete(key) // Remove expired cache
    }
    return null
  }

  private setCache(key: string, data: any, ttl: number = API_CONFIG.CACHE_TTL): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
    
    // Cleanup old cache entries (basic LRU)
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
  }

  async getUserProfile(username: string): Promise<ChessComProfile> {
    const cacheKey = `profile-${username.toLowerCase()}`
    const cached = this.getFromCache<ChessComProfile>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await this.axiosInstance.get(`/player/${username}`)
      const data = response.data
      this.setCache(cacheKey, data, API_CONFIG.CACHE_TTL)
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error(`Failed to fetch profile for user: ${username}`)
    }
  }

  async getUserStats(username: string): Promise<ChessComStats> {
    const cacheKey = `stats-${username.toLowerCase()}`
    const cached = this.getFromCache<ChessComStats>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await this.axiosInstance.get(`/player/${username}/stats`)
      const data = response.data
      this.setCache(cacheKey, data, API_CONFIG.CACHE_TTL)
      return data
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw new Error(`Failed to fetch stats for user: ${username}`)
    }
  }

  async getUserGamesByMonth(username: string, year: number, month: number): Promise<{ games: ChessComGame[] }> {
    try {
      const monthStr = month.toString().padStart(2, '0')
      const response = await this.axiosInstance.get(`/player/${username}/games/${year}/${monthStr}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user games:', error)
      throw new Error(`Failed to fetch games for user: ${username} in ${year}/${month}`)
    }
  }

  async getRecentGames(username: string, limit = 10): Promise<ChessComGame[]> {
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      // Try current month first
      let gamesData = await this.getUserGamesByMonth(username, currentYear, currentMonth)
      let games = gamesData.games || []

      // If not enough games, try previous month
      if (games.length < limit && currentMonth > 1) {
        const prevMonthData = await this.getUserGamesByMonth(username, currentYear, currentMonth - 1)
        games = [...games, ...(prevMonthData.games || [])]
      } else if (games.length < limit && currentMonth === 1) {
        const prevMonthData = await this.getUserGamesByMonth(username, currentYear - 1, 12)
        games = [...games, ...(prevMonthData.games || [])]
      }

      // Sort by end_time (newest first) and limit
      return games
        .sort((a, b) => b.end_time - a.end_time)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent games:', error)
      throw new Error(`Failed to fetch recent games for user: ${username}`)
    }
  }

  async getGameArchives(username: string): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get(`/player/${username}/games/archives`)
      return response.data.archives
    } catch (error) {
      console.error('Error fetching game archives:', error)
      throw new Error(`Failed to fetch game archives for user: ${username}`)
    }
  }

  async getPlayerTournaments(username: string): Promise<Tournament[]> {
    try {
      const response = await this.axiosInstance.get(`/player/${username}/tournaments`)
      return response.data.tournaments || []
    } catch (error) {
      console.error('Error fetching tournaments:', error)
      throw new Error(`Failed to fetch tournaments for user: ${username}`)
    }
  }

  async getPlayerClubs(username: string): Promise<Club[]> {
    try {
      const response = await this.axiosInstance.get(`/player/${username}/clubs`)
      return response.data.clubs || []
    } catch (error) {
      console.error('Error fetching clubs:', error)
      throw new Error(`Failed to fetch clubs for user: ${username}`)
    }
  }

  async getPlayerMatches(username: string): Promise<TeamMatch[]> {
    try {
      const response = await this.axiosInstance.get(`/player/${username}/matches`)
      return response.data.matches || []
    } catch (error) {
      console.error('Error fetching team matches:', error)
      throw new Error(`Failed to fetch team matches for user: ${username}`)
    }
  }

  async getLeaderboards(): Promise<Partial<Leaderboards>> {
    try {
      const endpoints = [
        'leaderboards',
        'leaderboards/live_rapid',
        'leaderboards/live_blitz',
        'leaderboards/live_bullet',
        'leaderboards/daily',
        'leaderboards/tactics'
      ]

      const results = await Promise.allSettled(
        endpoints.map(endpoint => this.axiosInstance.get(`/${endpoint}`))
      )

      const leaderboards: Partial<Leaderboards> = {}

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const endpoint = endpoints[index]
          switch (endpoint) {
            case 'leaderboards/live_rapid':
              leaderboards.live_rapid = result.value.data.live_rapid || []
              break
            case 'leaderboards/live_blitz':
              leaderboards.live_blitz = result.value.data.live_blitz || []
              break
            case 'leaderboards/live_bullet':
              leaderboards.live_bullet = result.value.data.live_bullet || []
              break
            case 'leaderboards/daily':
              leaderboards.daily = result.value.data.daily || []
              break
            case 'leaderboards/tactics':
              leaderboards.tactics = result.value.data.tactics || []
              break
          }
        }
      })

      return leaderboards
    } catch (error) {
      console.error('Error fetching leaderboards:', error)
      throw new Error('Failed to fetch leaderboards')
    }
  }

  analyzeOpeningsByColor(games: ChessComGame[], targetUsername: string): ColoredOpeningStats {
    const whiteOpenings = new Map<string, {
      games: number
      wins: number
      losses: number
      draws: number
      totalRating: number
      eco?: string
    }>()

    const blackOpenings = new Map<string, {
      games: number
      wins: number
      losses: number
      draws: number
      totalRating: number
      eco?: string
    }>()

    games.forEach(game => {
      if (!game.pgn) return

      const openingData = this.extractOpeningFromPGN(game.pgn)
      if (!openingData) return

      // Combine variations into base opening names
      const baseOpeningName = getBaseOpeningName(openingData.name)

      const isPlayerWhite = game.white.username.toLowerCase() === targetUsername.toLowerCase()
      const isPlayerBlack = game.black.username.toLowerCase() === targetUsername.toLowerCase()

      if (!isPlayerWhite && !isPlayerBlack) return

      const playerResult = isPlayerWhite ? game.white.result : game.black.result
      const playerRating = isPlayerWhite ? game.white.rating : game.black.rating
      const targetMap = isPlayerWhite ? whiteOpenings : blackOpenings

      const current = targetMap.get(baseOpeningName) || {
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalRating: 0,
        eco: openingData.eco
      }

      current.games++
      current.totalRating += playerRating

      switch (playerResult) {
        case 'win':
          current.wins++
          break
        case 'checkmated':
        case 'timeout':
        case 'resigned':
        case 'abandoned':
          current.losses++
          break
        case 'agreed':
        case 'stalemate':
        case 'insufficient':
        case 'timevsinsufficient':
          current.draws++
          break
      }

      targetMap.set(baseOpeningName, current)
    })

    const processOpenings = (openingMap: typeof whiteOpenings, color: 'white' | 'black' | 'both'): OpeningStats[] => {
      return Array.from(openingMap.entries())
        .map(([opening, stats]) => ({
          opening,
          eco: stats.eco,
          games: stats.games,
          wins: stats.wins,
          losses: stats.losses,
          draws: stats.draws,
          winRate: stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0,
          averageRating: stats.games > 0 ? Math.round(stats.totalRating / stats.games) : 0,
          color
        }))
        .filter(stats => stats.games >= CHESS_CONFIG.MIN_GAMES_FOR_OPENING_STAT)
        .sort((a, b) => b.games - a.games)
        .slice(0, CHESS_CONFIG.MAX_OPENING_RESULTS)
    }

    const whiteStats = processOpenings(whiteOpenings, 'white')
    const blackStats = processOpenings(blackOpenings, 'black')

    // Combine statistics for overall view - OPTIMIZED
    const combinedMap = new Map(whiteOpenings)
    
    // Merge black statistics into combined map
    for (const [opening, stats] of blackOpenings) {
      const current = combinedMap.get(opening)
      
      if (current) {
        // Opening exists in both colors, merge stats
        current.games += stats.games
        current.wins += stats.wins
        current.losses += stats.losses
        current.draws += stats.draws
        current.totalRating += stats.totalRating
      } else {
        // Opening only exists as black, add it
        combinedMap.set(opening, { ...stats })
      }
    }

    const combinedStats = processOpenings(combinedMap, 'both')

    return {
      white: whiteStats,
      black: blackStats,
      combined: combinedStats
    }
  }

  analyzeGamesByColor(games: ChessComGame[], targetUsername: string): ColorSeparatedStats {
    let whiteStats = {
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalRating: 0
    }

    let blackStats = {
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalRating: 0
    }

    games.forEach(game => {
      const isPlayerWhite = game.white.username.toLowerCase() === targetUsername.toLowerCase()
      const isPlayerBlack = game.black.username.toLowerCase() === targetUsername.toLowerCase()

      if (!isPlayerWhite && !isPlayerBlack) return

      const playerResult = isPlayerWhite ? game.white.result : game.black.result
      const playerRating = isPlayerWhite ? game.white.rating : game.black.rating
      const targetStats = isPlayerWhite ? whiteStats : blackStats

      targetStats.games++
      targetStats.totalRating += playerRating

      switch (playerResult) {
        case 'win':
          targetStats.wins++
          break
        case 'checkmated':
        case 'timeout':
        case 'resigned':
        case 'abandoned':
          targetStats.losses++
          break
        case 'agreed':
        case 'stalemate':
        case 'insufficient':
        case 'timevsinsufficient':
          targetStats.draws++
          break
      }
    })

    const processStats = (stats: typeof whiteStats) => ({
      games: stats.games,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      winRate: stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0,
      averageRating: stats.games > 0 ? Math.round(stats.totalRating / stats.games) : 0
    })

    const processedWhite = processStats(whiteStats)
    const processedBlack = processStats(blackStats)

    // Calculate combined statistics
    const combined = {
      games: processedWhite.games + processedBlack.games,
      wins: processedWhite.wins + processedBlack.wins,
      losses: processedWhite.losses + processedBlack.losses,
      draws: processedWhite.draws + processedBlack.draws,
      winRate: 0,
      averageRating: 0
    }

    if (combined.games > 0) {
      combined.winRate = Math.round((combined.wins / combined.games) * 100)
      combined.averageRating = Math.round((whiteStats.totalRating + blackStats.totalRating) / combined.games)
    }

    return {
      white: processedWhite,
      black: processedBlack,
      combined: combined
    }
  }

  // Legacy method for backward compatibility
  analyzeOpenings(games: ChessComGame[], targetUsername?: string): OpeningStats[] {
    if (targetUsername) {
      return this.analyzeOpeningsByColor(games, targetUsername).combined
    }

    // Fallback to old behavior if no username provided
    const openingMap = new Map<string, {
      games: number
      wins: number
      losses: number
      draws: number
      totalRating: number
      eco?: string
    }>()

    games.forEach(game => {
      if (!game.pgn) return

      const openingData = this.extractOpeningFromPGN(game.pgn)
      if (!openingData) return

      // Combine variations into base opening names
      const baseOpeningName = getBaseOpeningName(openingData.name)

      const current = openingMap.get(baseOpeningName) || {
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalRating: 0,
        eco: openingData.eco
      }

      current.games++
      openingMap.set(baseOpeningName, current)
    })

    return Array.from(openingMap.entries())
      .map(([opening, stats]) => ({
        opening,
        eco: stats.eco,
        games: stats.games,
        wins: stats.wins,
        losses: stats.losses,
        draws: stats.draws,
        winRate: stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0,
        averageRating: stats.games > 0 ? Math.round(stats.totalRating / stats.games) : 0
      }))
      .filter(stats => stats.games >= 2)
      .sort((a, b) => b.games - a.games)
      .slice(0, 10)
  }

  private extractOpeningFromPGN(pgn: string): { name: string; eco?: string } | null {
    const ecoMatch = pgn.match(/\[ECO "([^"]+)"\]/)
    const openingMatch = pgn.match(/\[Opening "([^"]+)"\]/)
    const variationMatch = pgn.match(/\[Variation "([^"]+)"\]/)

    let eco: string | undefined
    let name: string | undefined

    if (ecoMatch) {
      eco = ecoMatch[1]
      // Use ECO mapping to get proper opening name
      name = getOpeningName(eco)
    }

    if (openingMatch) {
      name = openingMatch[1]
      // Add variation if available
      if (variationMatch && variationMatch[1] !== openingMatch[1]) {
        name += `: ${variationMatch[1]}`
      }
    }

    // Fallback: try to identify opening from first moves
    if (!name) {
      const moves = pgn.split('\n').find(line => !line.startsWith('['))?.trim()
      if (moves) {
        const firstMoves = moves.split(' ').slice(0, 8).join(' ')
        if (firstMoves.length > 0) {
          // Clean up move notation for better readability
          const cleanMoves = firstMoves.replace(/\d+\./g, '').replace(/\s+/g, ' ').trim()
          name = `Opening: ${cleanMoves}`
        }
      }
    }

    return name ? { name, eco } : null
  }

  async getHistoricalGames(username: string, monthsBack = 6): Promise<ChessComGame[]> {
    try {
      const archives = await this.getGameArchives(username)
      const recentArchives = archives.slice(-monthsBack)

      const gamesPromises = recentArchives.map(async (archiveUrl) => {
        try {
          const response = await this.axiosInstance.get(archiveUrl.replace(CHESS_COM_API_BASE, ''))
          return response.data.games || []
        } catch (error) {
          console.warn(`Failed to fetch archive ${archiveUrl}:`, error)
          return []
        }
      })

      const gamesArrays = await Promise.all(gamesPromises)
      return gamesArrays.flat().sort((a, b) => b.end_time - a.end_time)
    } catch (error) {
      console.error('Error fetching historical games:', error)
      throw new Error(`Failed to fetch historical games for user: ${username}`)
    }
  }

  /**
   * Analyzes games to find the best performances based on multiple criteria
   * @param games Array of games to analyze
   * @param targetUsername Username to analyze games for
   * @param limit Maximum number of best games to return
   * @returns Array of best games with analysis data
   */
  analyzeBestGames(games: ChessComGame[], targetUsername: string, limit = 10): BestGame[] {
    const bestGames: BestGame[] = []

    games.forEach(game => {
      const isPlayerWhite = game.white.username.toLowerCase() === targetUsername.toLowerCase()
      const isPlayerBlack = game.black.username.toLowerCase() === targetUsername.toLowerCase()
      
      if (!isPlayerWhite && !isPlayerBlack) return

      // Skip games without accuracy data - validate properly
      if (!game.accuracies || 
          typeof game.accuracies.white !== 'number' || 
          typeof game.accuracies.black !== 'number') {
        console.warn(`Skipping game without valid accuracy data: ${game.url}`)
        return
      }

      const playerColor = isPlayerWhite ? 'white' : 'black'
      const playerData = isPlayerWhite ? game.white : game.black
      const opponentData = isPlayerWhite ? game.black : game.white
      const playerAccuracy = isPlayerWhite ? game.accuracies.white : game.accuracies.black
      const opponentAccuracy = isPlayerWhite ? game.accuracies.black : game.accuracies.white

      // Determine result from player's perspective
      let result: 'win' | 'draw' | 'loss'
      switch (playerData.result) {
        case 'win':
          result = 'win'
          break
        case 'agreed':
        case 'stalemate':
        case 'insufficient':
        case 'timevsinsufficient':
          result = 'draw'
          break
        default:
          result = 'loss'
          break
      }

      const ratingDifference = playerData.rating - opponentData.rating

      // Calculate game score based on multiple factors
      let gameScore = 0

      // Base score from result (0-100 points)
      if (result === 'win') gameScore += 100
      else if (result === 'draw') gameScore += 50
      else gameScore += 0

      // Accuracy bonus (0-50 points)
      gameScore += (playerAccuracy / 100) * 50

      // Rating difference bonus/penalty (-25 to +25 points)
      if (ratingDifference < 0) {
        // Playing higher rated opponent - bonus for good performance
        gameScore += Math.min(Math.abs(ratingDifference) / 20, 25)
      } else {
        // Playing lower rated opponent - small penalty
        gameScore -= Math.min(ratingDifference / 40, 10)
      }

      // Accuracy relative to opponent bonus (0-25 points)
      const accuracyDifference = playerAccuracy - opponentAccuracy
      gameScore += (accuracyDifference / 100) * 25

      // Time class multiplier (longer games generally more meaningful)
      const timeClassMultiplier = {
        'bullet': 0.9,
        'blitz': 1.0,
        'rapid': 1.1,
        'daily': 1.2
      }
      gameScore *= timeClassMultiplier[game.time_class] || 1.0

      bestGames.push({
        game,
        playerColor,
        playerRating: playerData.rating,
        opponentRating: opponentData.rating,
        playerAccuracy,
        opponentAccuracy,
        ratingDifference,
        gameScore,
        result
      })
    })

    // Sort by game score (highest first) and return top games
    return bestGames
      .filter(bestGame => bestGame.playerAccuracy >= 70) // Only include games with decent accuracy
      .sort((a, b) => b.gameScore - a.gameScore)
      .slice(0, limit)
  }

  /**
   * Gets best games for a user by analyzing their historical games
   * @param username Username to get best games for
   * @param monthsBack Number of months to look back
   * @param limit Maximum number of best games to return
   * @returns Array of best games
   */
  async getBestGames(username: string, monthsBack = 6, limit = 10): Promise<BestGame[]> {
    try {
      const historicalGames = await this.getHistoricalGames(username, monthsBack)
      return this.analyzeBestGames(historicalGames, username, limit)
    } catch (error) {
      console.error('Error fetching best games:', error)
      throw new Error(`Failed to fetch best games for user: ${username}`)
    }
  }
}

export const chessComApi = new ChessComApiService()