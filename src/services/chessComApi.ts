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
  Leaderboards
} from '@/types/chess'
import { getOpeningName, getBaseOpeningName } from '@/data/ecoMappings'

const CHESS_COM_API_BASE = 'https://api.chess.com/pub'

export class ChessComApiService {
  private axiosInstance = axios.create({
    baseURL: CHESS_COM_API_BASE,
    timeout: 10000,
  })

  async getUserProfile(username: string): Promise<ChessComProfile> {
    try {
      const response = await this.axiosInstance.get(`/player/${username}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error(`Failed to fetch profile for user: ${username}`)
    }
  }

  async getUserStats(username: string): Promise<ChessComStats> {
    try {
      const response = await this.axiosInstance.get(`/player/${username}/stats`)
      return response.data
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
        .filter(stats => stats.games >= 2)
        .sort((a, b) => b.games - a.games)
        .slice(0, 15)
    }

    const whiteStats = processOpenings(whiteOpenings, 'white')
    const blackStats = processOpenings(blackOpenings, 'black')

    // Combine statistics for overall view
    const combinedMap = new Map<string, {
      games: number
      wins: number
      losses: number
      draws: number
      totalRating: number
      eco?: string
    }>()

    // Merge white and black statistics
    ;[...whiteOpenings, ...blackOpenings].forEach(([opening, stats]) => {
      const current = combinedMap.get(opening) || {
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalRating: 0,
        eco: stats.eco
      }

      current.games += stats.games
      current.wins += stats.wins
      current.losses += stats.losses
      current.draws += stats.draws
      current.totalRating += stats.totalRating

      combinedMap.set(opening, current)
    })

    const combinedStats = processOpenings(combinedMap, 'both')

    return {
      white: whiteStats,
      black: blackStats,
      combined: combinedStats
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
}

export const chessComApi = new ChessComApiService()