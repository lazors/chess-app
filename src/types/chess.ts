export interface ChessComProfile {
  player_id: number
  '@id': string
  url: string
  username: string
  followers: number
  country: string
  last_online: number
  joined: number
  status: string
  name?: string
  avatar?: string
  location?: string
  title?: string
  is_streamer?: boolean
  twitch_url?: string
}

export interface ChessComStats {
  chess_daily?: GameTypeStats
  chess_rapid?: GameTypeStats
  chess_bullet?: GameTypeStats
  chess_blitz?: GameTypeStats
  fide?: number
  tactics?: TacticsStats
}

export interface GameTypeStats {
  last: GameResult
  best?: GameResult
  record: GameRecord
}

export interface GameResult {
  rating: number
  date: number
  rd?: number
}

export interface GameRecord {
  win: number
  loss: number
  draw: number
}

export interface TacticsStats {
  highest: GameResult
  lowest: GameResult
}

export interface ChessComGame {
  url: string
  pgn: string
  time_control: string
  end_time: number
  rated: boolean
  fen: string
  time_class: 'daily' | 'rapid' | 'blitz' | 'bullet'
  rules: string
  white: PlayerGame
  black: PlayerGame
  accuracies?: {
    white: number
    black: number
  }
}

export interface PlayerGame {
  rating: number
  result: 'win' | 'checkmated' | 'agreed' | 'timeout' | 'resigned' | 'stalemate' | 'lose' | 'insufficient' | 'abandoned' | 'kingofthehill' | 'threecheck' | 'timevsinsufficient'
  '@id': string
  username: string
  uuid: string
}

export interface BestGame {
  game: ChessComGame
  playerColor: 'white' | 'black'
  playerRating: number
  opponentRating: number
  playerAccuracy: number
  opponentAccuracy: number
  ratingDifference: number
  gameScore: number // Combined score based on rating difference, accuracy, and result
  result: 'win' | 'draw' | 'loss'
}

export interface GameArchive {
  archives: string[]
}

export interface Tournament {
  url: string
  '@id': string
  title: string
  description: string
  creator: string
  status: 'finished' | 'in_progress' | 'registration'
  finish_time?: number
  start_time: number
  time_class: string
  time_control: string
  type: 'arena' | 'swiss' | 'elimination'
  total_players: number
}

export interface Club {
  '@id': string
  name: string
  club_id: number
  icon: string
  url: string
  joined: number
}

export interface TeamMatch {
  '@id': string
  url: string
  opponent: string
  start_time: number
  end_time?: number
  time_class: string
  status: 'finished' | 'in_progress'
  result: 'win' | 'loss' | 'draw'
}

export interface OpeningStats {
  opening: string
  eco?: string
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageRating: number
  color?: 'white' | 'black' | 'both'
}

export interface ColoredOpeningStats {
  white: OpeningStats[]
  black: OpeningStats[]
  combined: OpeningStats[]
}

export interface ColorGameStats {
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageRating: number
}

export interface ColorSeparatedStats {
  white: ColorGameStats
  black: ColorGameStats
  combined: ColorGameStats
}

export interface LeaderboardEntry {
  player_id: number
  '@id': string
  url: string
  username: string
  score: number
  rank: number
  country: string
  title?: string
  name?: string
  status: string
  avatar?: string
  trend_score?: {
    direction: number
    delta: number
  }
  trend_rank?: {
    direction: number
    delta: number
  }
  flair_code?: string
}

export interface Leaderboards {
  daily: LeaderboardEntry[]
  daily960: LeaderboardEntry[]
  live_rapid: LeaderboardEntry[]
  live_blitz: LeaderboardEntry[]
  live_bullet: LeaderboardEntry[]
  live_bughouse: LeaderboardEntry[]
  live_blitz960: LeaderboardEntry[]
  live_threecheck: LeaderboardEntry[]
  live_crazyhouse: LeaderboardEntry[]
  live_kingofthehill: LeaderboardEntry[]
  tactics: LeaderboardEntry[]
  rush: LeaderboardEntry[]
  battle: LeaderboardEntry[]
}