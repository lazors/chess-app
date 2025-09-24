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
  Leaderboards
} from '@/types/chess'

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

  analyzeOpenings(games: ChessComGame[]): OpeningStats[] {
    const openingMap = new Map<string, {
      games: number
      wins: number
      losses: number
      draws: number
      totalRating: number
    }>()

    games.forEach(game => {
      if (!game.pgn) return

      const opening = this.extractOpeningFromPGN(game.pgn)
      if (!opening) return

      const isWhite = game.white.username.toLowerCase()
      const isPlayer = isWhite || game.black.username.toLowerCase()
      if (!isPlayer) return

      const playerResult = isWhite ? game.white.result : game.black.result
      const playerRating = isWhite ? game.white.rating : game.black.rating

      const current = openingMap.get(opening) || {
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalRating: 0
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

      openingMap.set(opening, current)
    })

    return Array.from(openingMap.entries())
      .map(([opening, stats]) => ({
        opening,
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

  private extractOpeningFromPGN(pgn: string): string | null {
    const ecoMatch = pgn.match(/\[ECO "([^"]+)"\]/)
    const openingMatch = pgn.match(/\[Opening "([^"]+)"\]/)

    if (openingMatch) {
      return openingMatch[1]
    }

    if (ecoMatch) {
      return `ECO ${ecoMatch[1]}`
    }

    const moves = pgn.split('\n').find(line => !line.startsWith('['))?.trim()
    if (moves) {
      const firstMoves = moves.split(' ').slice(0, 6).join(' ')
      if (firstMoves.length > 0) {
        return `Opening: ${firstMoves}`
      }
    }

    return null
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