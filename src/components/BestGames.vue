<template>
  <div class="best-games">
    <h2>🏆 Best Games</h2>
    <p class="description">Your top-performing games based on accuracy, rating difference, and results.</p>

    <div v-if="loading" class="loading">
      Loading best games...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="bestGames.length === 0" class="no-games">
      No best games found. Play some games with good accuracy to see them here!
    </div>

    <div v-else class="games-list">
      <div 
        v-for="(bestGame, index) in bestGames" 
        :key="bestGame.game.url"
        class="game-card"
        :class="{ 'winner': bestGame.result === 'win', 'draw': bestGame.result === 'draw' }"
      >
        <div class="game-rank">
          <span class="rank-number">#{{ index + 1 }}</span>
          <div class="game-score">
            <span class="score-label">Score:</span>
            <span class="score-value">{{ Math.round(bestGame.gameScore) }}</span>
          </div>
        </div>

        <div class="game-header">
          <div class="players">
            <div class="player-info" :class="{ 'current-player': bestGame.playerColor === 'white' }">
              <span class="player-name">{{ bestGame.game.white.username }}</span>
              <span class="rating">({{ bestGame.game.white.rating }})</span>
            </div>
            <div class="vs">vs</div>
            <div class="player-info" :class="{ 'current-player': bestGame.playerColor === 'black' }">
              <span class="player-name">{{ bestGame.game.black.username }}</span>
              <span class="rating">({{ bestGame.game.black.rating }})</span>
            </div>
          </div>
          
          <div class="result-badge" :class="bestGame.result">
            {{ bestGame.result.toUpperCase() }}
          </div>
        </div>

        <div class="game-stats">
          <div class="stat-group">
            <div class="stat">
              <span class="stat-label">Your Accuracy</span>
              <span class="stat-value accuracy high">{{ bestGame.playerAccuracy }}%</span>
            </div>
            <div class="stat">
              <span class="stat-label">Opponent Accuracy</span>
              <span class="stat-value accuracy">{{ bestGame.opponentAccuracy }}%</span>
            </div>
          </div>

          <div class="stat-group">
            <div class="stat">
              <span class="stat-label">Rating Difference</span>
              <span 
                class="stat-value rating-diff" 
                :class="{ 'positive': bestGame.ratingDifference > 0, 'negative': bestGame.ratingDifference < 0 }"
              >
                {{ bestGame.ratingDifference > 0 ? '+' : '' }}{{ bestGame.ratingDifference }}
              </span>
            </div>
            <div class="stat">
              <span class="stat-label">Time Control</span>
              <span class="stat-value time-control">{{ bestGame.game.time_control }}</span>
            </div>
          </div>
        </div>

        <div class="game-meta">
          <span class="color-played">
            Played as {{ bestGame.playerColor === 'white' ? '⚪' : '⚫' }} {{ bestGame.playerColor }}
          </span>
          <span class="game-date">
            {{ formatGameDate(bestGame.game.end_time) }}
          </span>
          <a 
            :href="bestGame.game.url" 
            target="_blank" 
            class="game-link"
            aria-label="View game on Chess.com"
          >
            View Game ↗
          </a>
        </div>
      </div>
    </div>

    <div v-if="bestGames.length > 0" class="load-more">
      <button 
        @click="loadMoreGames" 
        :disabled="loading"
        class="load-more-btn"
        type="button"
      >
        {{ loading ? 'Loading...' : 'Load More Games' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useChessStore } from '@/stores/chess'
import { formatShortDate } from '@/utils/date'
import type { BestGame } from '@/types/chess'

interface Props {
  username?: string
  autoLoad?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
  limit: 10
})

const chessStore = useChessStore()

const bestGames = computed(() => chessStore.bestGames)
const loading = computed(() => chessStore.isLoading)
const error = computed(() => chessStore.error)

const formatGameDate = (timestamp: number): string => {
  return formatShortDate(timestamp)
}

const loadMoreGames = async () => {
  if (props.username) {
    await chessStore.fetchBestGames(props.username, 12, props.limit + 5)
  }
}

onMounted(() => {
  if (props.autoLoad && props.username) {
    chessStore.fetchBestGames(props.username, 6, props.limit)
  }
})
</script>

<style scoped>
.best-games {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.best-games h2 {
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffd700, #ffb000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.loading, .error, .no-games {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  border-radius: var(--radius-lg);
  margin: 2rem 0;
}

.loading {
  background: var(--loading-bg);
  color: var(--loading-text);
}

.error {
  background: var(--error-bg);
  color: var(--error-text);
}

.no-games {
  background: var(--bg-secondary);
  color: var(--text-muted);
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #059669);
}

.game-card.winner::before {
  background: linear-gradient(90deg, #ffd700, #ffb000);
}

.game-card.draw::before {
  background: linear-gradient(90deg, #64748b, #475569);
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-primary);
}

.game-rank {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--accent-primary);
}

.game-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.score-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-primary);
  background: rgba(var(--accent-primary-rgb), 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.players {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-info.current-player {
  font-weight: 700;
  color: var(--accent-primary);
}

.player-name {
  font-size: 1.1rem;
}

.rating {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.vs {
  font-weight: 600;
  color: var(--text-muted);
  padding: 0 0.5rem;
}

.result-badge {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-badge.win {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.result-badge.draw {
  background: linear-gradient(135deg, #64748b, #475569);
  color: white;
}

.result-badge.loss {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.game-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-weight: 700;
}

.accuracy {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.accuracy.high {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.rating-diff.positive {
  color: #10b981;
}

.rating-diff.negative {
  color: #ef4444;
}

.time-control {
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.color-played {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.game-date {
  color: var(--text-muted);
}

.game-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.game-link:hover {
  color: var(--accent-secondary);
  text-decoration: underline;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.load-more-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .best-games {
    padding: 1rem;
  }

  .game-card {
    padding: 1rem;
  }

  .game-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .game-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .players {
    width: 100%;
    justify-content: space-between;
  }

  .game-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>