# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A Vue.js chess statistics application that integrates with the Chess.com API to provide comprehensive player analytics, game history, and performance tracking. Built with Vue 3, TypeScript, and Vite.

## Development Commands

### Core Development
```powershell
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```powershell
# Type checking
npm run typecheck

# Lint and auto-fix code
npm run lint

# Format code with Prettier
npm run format

# Run all quality checks
npm run typecheck; npm run lint
```

### Single File Operations
```powershell
# Type check specific file
npx vue-tsc --noEmit src/path/to/file.vue

# Lint specific file
npx eslint src/path/to/file.ts --fix

# Format specific file
npx prettier --write src/path/to/file.vue
```

## Architecture Overview

### State Management Architecture
- **Pinia Stores**: Centralized state management
  - `useChessStore`: Manages Chess.com data, games, and user statistics
  - `useThemeStore`: Handles dark/light theme persistence
- **Composition API**: All components use Vue 3 Composition API
- **Reactive Data Flow**: State changes automatically trigger UI updates

### API Integration Pattern
- **ChessComApiService**: Centralized API client with comprehensive methods
- **Error Handling**: Consistent error boundaries and user feedback
- **Data Transformation**: Raw Chess.com API data transformed to typed interfaces
- **Rate Limiting**: Respectful API usage patterns built-in

### Component Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ChessBoard.vue   # Interactive chess board (chessboard-element)
│   ├── GameCard.vue     # Individual game display with metadata
│   ├── RatingCard.vue   # Rating display and progression
│   └── ThemeToggle.vue  # Dark/light theme switcher
├── views/               # Route-based page components
│   ├── HomeView.vue     # Dashboard with profile and recent games
│   ├── GamesView.vue    # Detailed game history and analysis
│   ├── StatsView.vue    # Comprehensive statistics and metrics
│   └── LeaderboardsView.vue # Chess.com leaderboards
├── stores/              # Pinia state management
│   ├── chess.ts         # Chess data and API state
│   └── theme.ts         # Theme persistence
├── services/            # External service integrations
│   └── chessComApi.ts   # Chess.com API client
├── types/               # TypeScript definitions
│   └── chess.ts         # Chess-related type definitions
├── data/                # Static data and mappings
│   └── ecoMappings.ts   # Encyclopedia of Chess Openings mapping
└── router/              # Vue Router configuration
    └── index.ts
```

## Key Technical Features

### Advanced Chess Analysis
- **Opening Analysis**: ECO (Encyclopedia of Chess Openings) code mapping with 500+ opening variations
- **Color-Specific Statistics**: Separate analysis for White vs Black pieces
- **Opening Grouping**: Automatic grouping of variations under main opening families (e.g., all Sicilian variations → "Sicilian Defense")
- **PGN Parsing**: Enhanced parsing with variation support for game analysis

### Chess.com API Integration
The `ChessComApiService` provides comprehensive methods:

**Core Data Retrieval:**
- `getUserProfile(username)` - Player profile information
- `getUserStats(username)` - Rating statistics by game type
- `getUserGamesByMonth(username, year, month)` - Monthly game archives
- `getRecentGames(username, limit)` - Most recent games
- `getHistoricalGames(username, monthsBack)` - Extended game history

**Advanced Analysis:**
- `analyzeOpeningsByColor(games, username)` - Separate White/Black opening stats
- `analyzeOpenings(games, username)` - Combined opening analysis with variation grouping
- `extractOpeningFromPGN(pgn)` - Enhanced opening name extraction
- `getBaseOpeningName(openingName)` - Groups variations into main families

**Community Data:**
- `getPlayerTournaments(username)` - Tournament participation
- `getPlayerClubs(username)` - Club memberships
- `getLeaderboards()` - Global leaderboards

### Data Flow Pattern
1. **User Input**: Username entry triggers data fetching
2. **API Calls**: ChessComApiService methods called via Pinia store actions
3. **Data Processing**: Raw API data transformed and analyzed (openings, statistics)
4. **State Updates**: Processed data stored in Pinia stores
5. **UI Updates**: Components reactively update based on store state
6. **Error Handling**: API errors caught and displayed to user

## Development Guidelines

### TypeScript Integration
- All components use TypeScript with strict type checking
- Comprehensive type definitions in `src/types/chess.ts`
- Vue 3 Composition API with proper typing
- Generic types for Chess.com API responses

### Code Style and Standards
- ESLint + Prettier for consistent formatting
- Vue 3 best practices with Composition API
- Async/await for all API calls
- Error boundaries and proper error handling
- Responsive design patterns for mobile/desktop

### State Management Patterns
```typescript
// Accessing store data
const chessStore = useChessStore()
const { profile, stats, recentGames } = storeToRefs(chessStore)

// Triggering actions
await chessStore.loadUserData(username)
await chessStore.loadRecentGames(username, 10)
```

### Adding New Features
1. **API Integration**: Add methods to `ChessComApiService`
2. **Type Definitions**: Update `src/types/chess.ts`
3. **Store Actions**: Add actions to appropriate Pinia store
4. **Components**: Create/update Vue components
5. **Routing**: Update `src/router/index.ts` if needed
6. **Testing**: Run type checking and linting

## Environment Setup

### Dependencies
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Pinia** for state management
- **Vue Router** for navigation
- **chess.js** for game logic validation
- **chessboard-element** for interactive chess board
- **axios** for API requests

### Vite Configuration
- Path alias `@` points to `src/` directory
- Vue plugin enabled for SFC support
- Development server runs on `http://localhost:5173`

### IDE Integration
- TypeScript support with `vue-tsc`
- ESLint integration for code quality
- Prettier for code formatting
- Path alias support for imports

## Common Development Tasks

### Adding a New Chess.com API Endpoint
1. Add method to `ChessComApiService` class
2. Update TypeScript types in `src/types/chess.ts`
3. Add store action in `src/stores/chess.ts`
4. Use in components via store

### Creating a New Page
1. Create Vue component in `src/views/`
2. Add route to `src/router/index.ts`
3. Update navigation if needed
4. Follow existing patterns for data loading

### Adding Chess Analysis Features
1. Understand the chess data structure in `src/types/chess.ts`
2. Use existing analysis methods in `ChessComApiService`
3. Leverage ECO mappings in `src/data/ecoMappings.ts`
4. Follow color-specific analysis patterns

### Debugging API Issues
1. Check browser Network tab for API calls
2. Verify Chess.com API rate limits
3. Check error handling in `ChessComApiService`
4. Ensure proper error display in UI components