import axios from 'axios'
import type { ChessComProfile, ChessComStats, ChessComGame } from '@/types/chess'

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
}

export const chessComApi = new ChessComApiService()