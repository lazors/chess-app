# Chess Statistics App - Claude Code Configuration

## Project Overview
A Vue.js chess statistics application that integrates with Chess.com API to provide comprehensive player analytics, game history, and performance tracking.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Chess API**: Chess.com Public API
- **Chess Logic**: chess.js library
- **Chess Board**: chessboard-element
- **HTTP Client**: Axios
- **Styling**: CSS custom properties with dark/light theme support

## Key Features
- User profile and statistics display
- Game history and analysis
- Opening statistics and performance
- Rating tracking and visualization
- Leaderboards view
- Dark/light theme toggle
- Responsive design

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Preview production build
npm run preview
```

## Project Structure
```
src/
├── components/          # Reusable Vue components
│   ├── ChessBoard.vue   # Interactive chess board
│   ├── GameCard.vue     # Individual game display
│   ├── RatingCard.vue   # Rating display component
│   └── ThemeToggle.vue  # Dark/light theme switcher
├── views/               # Route-based page components
│   ├── HomeView.vue     # Main dashboard
│   ├── GamesView.vue    # Game history
│   ├── StatsView.vue    # Statistics and analytics
│   └── LeaderboardsView.vue # Chess.com leaderboards
├── stores/              # Pinia state management
│   ├── chess.ts         # Chess-related state
│   └── theme.ts         # Theme management
├── services/            # API and external services
│   └── chessComApi.ts   # Chess.com API integration
├── types/               # TypeScript type definitions
│   └── chess.ts         # Chess-related types
└── router/              # Vue Router configuration
    └── index.ts
```

## Available Routes
- `/` - Home dashboard with user profile and recent games
- `/games` - Detailed game history and analysis
- `/stats` - Comprehensive statistics and performance metrics
- `/leaderboards` - Chess.com leaderboards display

## Chess.com API Integration
The app uses the Chess.com public API to fetch:
- Player profiles and ratings
- Game history and archives
- Tournament participation
- Club memberships
- Global leaderboards
- Advanced opening statistics analysis with ECO codes

### Opening Analysis Features
- **ECO Code Mapping**: Comprehensive database of Encyclopedia of Chess Openings (ECO) codes A00-E99
- **Meaningful Opening Names**: Proper chess opening names instead of generic ECO codes
- **Combined Variations**: All opening variations grouped under main opening families
  - All Caro-Kann variations → "Caro-Kann Defense"
  - All Sicilian variations → "Sicilian Defense"
  - All French Defense variations → "French Defense"
  - All Queen's Gambit variations → "Queen's Gambit"
  - And many more opening families
- **Separate Statistics**: Analyzes openings played as White vs Black pieces
- **Color-Specific Performance**: Win rates and statistics for each color
- **Enhanced Extraction**: Improved PGN parsing with variation support
- **Smart Grouping**: Automatic fallback for unlisted variations using colon-separated naming

## State Management
- `useChessStore`: Manages user data, games, and statistics
- `useThemeStore`: Handles dark/light theme persistence

## API Service Methods
The `ChessComApiService` provides comprehensive methods:

### Core Data Retrieval
- `getUserProfile(username)` - Player profile information
- `getUserStats(username)` - Rating statistics by game type
- `getUserGamesByMonth(username, year, month)` - Monthly game archives
- `getRecentGames(username, limit)` - Most recent games
- `getHistoricalGames(username, monthsBack)` - Extended game history

### Advanced Analysis
- `analyzeOpeningsByColor(games, username)` - Separate White/Black opening stats with combined variations
- `analyzeOpenings(games, username)` - Combined opening analysis (legacy) with variation grouping
- `extractOpeningFromPGN(pgn)` - Enhanced opening name extraction
- `getBaseOpeningName(openingName)` - Groups opening variations into main families

### Community Data
- `getPlayerTournaments(username)` - Tournament participation
- `getPlayerClubs(username)` - Club memberships
- `getPlayerMatches(username)` - Team match history
- `getLeaderboards()` - Global leaderboards

## Component Architecture
- **ChessBoard.vue**: Interactive board for game replay
- **GameCard.vue**: Displays individual game results with metadata
- **RatingCard.vue**: Shows rating progression and statistics
- **ThemeToggle.vue**: Provides theme switching functionality

## Development Notes
- Uses Chess.com public API (no authentication required)
- Implements proper error handling for API requests
- Supports responsive design for mobile/desktop
- Includes opening analysis and performance tracking
- Features comprehensive TypeScript coverage

## Code Quality
- ESLint + Prettier for code formatting
- TypeScript for type safety
- Vue 3 Composition API for reactive components
- Modern ES modules and Vite build system