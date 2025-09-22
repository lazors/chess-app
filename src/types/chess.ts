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