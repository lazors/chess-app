# AI Agent Guidelines

This document provides guidelines for AI coding agents working on the Chess App project.

## Project Overview

**Chess App** is a Vue.js application that integrates with the Chess.com API to display player statistics, game history, and advanced chess analytics.

### Tech Stack
- **Frontend Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Chess Logic**: Chess.js
- **Chess Board UI**: chessboard-element
- **HTTP Client**: Axios
- **Package Manager**: pnpm

## Project Structure

```
chess-app/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page-level components
│   ├── stores/         # Pinia state management
│   ├── services/       # API integration services
│   ├── types/          # TypeScript type definitions
│   ├── router/         # Vue Router configuration
│   ├── data/           # Static data (ECO mappings, etc.)
│   └── assets/         # Stylesheets and static assets
├── .github/            # GitHub configuration and documentation
└── [config files]      # Various configuration files
```

## Key Features

1. **Player Statistics Dashboard**
   - Display ratings across different time controls (Rapid, Blitz, Bullet, Daily)
   - Win/loss/draw records
   - Color-separated analysis (White vs Black performance)

2. **Game History & Replay**
   - Browse recent games from Chess.com
   - Interactive chess board for game replay
   - Game metadata display

3. **Opening Analysis**
   - ECO code classification
   - Performance tracking per opening
   - Separate statistics for White and Black
   - Worst openings analyzer

4. **Additional Features**
   - Tournament history
   - Club memberships
   - Team matches
   - Dark/Light theme toggle

## Development Guidelines

### Code Style

1. **TypeScript**: Always use TypeScript with proper type definitions
   - Define interfaces in `src/types/` directory
   - Avoid `any` types when possible
   - Use type inference where appropriate

2. **Vue 3 Composition API**
   - Use `<script setup>` syntax for components
   - Follow the Options API pattern for larger components only when necessary
   - Use composables for shared logic

3. **Component Structure**
   ```vue
   <script setup lang="ts">
   // Imports
   // Props & Emits
   // Reactive state
   // Computed properties
   // Methods
   // Lifecycle hooks
   </script>

   <template>
     <!-- Template code -->
   </template>

   <style scoped>
     /* Component-specific styles */
   </style>
   ```

4. **Naming Conventions**
   - Components: PascalCase (e.g., `ChessBoard.vue`)
   - Composables: camelCase with `use` prefix (e.g., `useChessGame`)
   - Files: camelCase or kebab-case
   - Constants: UPPER_SNAKE_CASE

### State Management

- Use **Pinia** stores for global state
- Store files in `src/stores/`
- Keep component-level state local when possible
- Example stores:
  - `chess.ts`: Player data, games, statistics
  - `theme.ts`: Theme preferences

### API Integration

- All Chess.com API calls go through `src/services/chessComApi.ts`
- Use Axios for HTTP requests
- Handle errors gracefully with try/catch blocks
- Implement loading states for async operations
- Cache API responses when appropriate

### Routing

- Define routes in `src/router/index.ts`
- Use lazy loading for view components
- Follow RESTful naming conventions for routes

### Package Management

**Important**: This project uses **pnpm**, not npm!

- Install packages: `pnpm add <package>`
- Remove packages: `pnpm remove <package>`
- Install dev dependencies: `pnpm add -D <package>`
- Run scripts: `pnpm dev`, `pnpm build`, etc.

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Lint and fix code
pnpm format     # Format code with Prettier
pnpm typecheck  # TypeScript type checking
```

## Common Tasks

### Adding a New Component

1. Create component file in `src/components/` with PascalCase name
2. Use `<script setup lang="ts">` syntax
3. Define props/emits with TypeScript types
4. Add scoped styles if needed
5. Export and import where needed

### Adding a New View/Page

1. Create view file in `src/views/` with `View` suffix (e.g., `StatsView.vue`)
2. Define route in `src/router/index.ts`
3. Add navigation link if needed
4. Implement lazy loading for better performance

### Adding New API Endpoints

1. Add method to `src/services/chessComApi.ts`
2. Define response types in `src/types/chess.ts`
3. Handle errors appropriately
4. Update store if state management is needed

### Adding New Chess Data

1. Update types in `src/types/chess.ts`
2. Add data processing in relevant service
3. Update store actions/getters if needed
4. Update UI components to display new data

## Chess.com API Notes

- Base URL: `https://api.chess.com/pub`
- Public API (no authentication required)
- Rate limiting: Be respectful, implement caching
- Key endpoints used:
  - `/player/{username}`: Player profile
  - `/player/{username}/stats`: Player statistics
  - `/player/{username}/games/{YYYY}/{MM}`: Monthly archives
  - `/player/{username}/clubs`: Club memberships
  - `/player/{username}/matches`: Team matches
  - `/player/{username}/tournaments`: Tournament history

## Testing Considerations

When adding or modifying features:
- Test with different Chess.com usernames
- Handle missing or incomplete data gracefully
- Test responsive design on various screen sizes
- Verify dark/light theme compatibility
- Check TypeScript compilation with `pnpm typecheck`

## Performance Best Practices

1. **Lazy Loading**: Use dynamic imports for routes
2. **Caching**: Cache API responses to minimize requests
3. **Computed Properties**: Use for derived state instead of methods
4. **Virtual Scrolling**: For large lists (if needed)
5. **Code Splitting**: Keep bundle sizes reasonable

## Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers when possible

## Git Workflow

1. Create feature branches from `main`
2. Write clear commit messages
3. Keep commits focused and atomic
4. Test before committing
5. Run linting and type checking before pushing

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `pnpm typecheck` to identify issues
2. **Build Failures**: Ensure all dependencies are installed with `pnpm install`
3. **API Errors**: Check Chess.com API status and rate limits
4. **Styling Issues**: Verify scoped styles and CSS specificity

### Debug Tips

- Use Vue DevTools for component inspection
- Check browser console for errors
- Use `console.log()` sparingly (prefer debugger)
- Verify API responses in Network tab

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Chess.com API Documentation](https://www.chess.com/news/view/published-data-api)
- [Chess.js Library](https://github.com/jhlywa/chess.js)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## Questions or Issues?

When encountering issues:
1. Check this guide first
2. Review existing code for patterns
3. Check documentation for libraries used
4. Test in isolation to identify the problem
5. Consider edge cases and error handling

---

**Last Updated**: October 14, 2025
