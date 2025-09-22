<template>
  <div class="game-card" :class="resultClass" @click="$emit('select')">
    <div class="game-header">
      <div class="game-result">
        <span class="result-text">{{ resultText }}</span>
        <span class="result-badge" :class="resultClass">{{ resultBadge }}</span>
      </div>
      <div class="game-date">{{ formattedDate }}</div>
    </div>

    <div class="game-details">
      <div class="players">
        <div class="player" :class="{ current: isPlayerWhite }">
          <span class="piece">♔</span>
          <span class="username">{{ game.white.username }}</span>
          <span class="rating">({{ game.white.rating }})</span>
        </div>
        <div class="vs">vs</div>
        <div class="player" :class="{ current: !isPlayerWhite }">
          <span class="piece">♚</span>
          <span class="username">{{ game.black.username }}</span>
          <span class="rating">({{ game.black.rating }})</span>
        </div>
      </div>

      <div class="game-meta">
        <div class="time-control">
          <span class="label">Time:</span>
          <span class="value">{{ game.time_control }}</span>
        </div>
        <div class="time-class">
          <span class="label">Format:</span>
          <span class="value">{{ formatTimeClass(game.time_class) }}</span>
        </div>
        <div v-if="game.rated" class="rated">
          <span class="badge">Rated</span>
        </div>
      </div>

      <div v-if="game.accuracies" class="accuracies">
        <div class="accuracy">
          <span class="label">White Accuracy:</span>
          <span class="value">{{ game.accuracies.white }}%</span>
        </div>
        <div class="accuracy">
          <span class="label">Black Accuracy:</span>
          <span class="value">{{ game.accuracies.black }}%</span>
        </div>
      </div>
    </div>

    <div class="game-footer">
      <button class="view-game-btn" @click.stop="$emit('select')">
        View Game
      </button>
      <a :href="game.url" target="_blank" class="chess-com-link" @click.stop>
        View on Chess.com ↗
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChessComGame } from '@/types/chess'

interface Props {
  game: ChessComGame
  playerUsername: string
}

const props = defineProps<Props>()

defineEmits<{
  select: []
}>()

const isPlayerWhite = computed(() => {
  return props.game.white.username.toLowerCase() === props.playerUsername.toLowerCase()
})

const playerResult = computed(() => {
  return isPlayerWhite.value ? props.game.white.result : props.game.black.result
})

const resultText = computed(() => {
  const opponent = isPlayerWhite.value ? props.game.black.username : props.game.white.username
  return `vs ${opponent}`
})

const resultBadge = computed(() => {
  switch (playerResult.value) {
    case 'win':
      return 'WIN'
    case 'checkmated':
    case 'timeout':
    case 'resigned':
    case 'abandoned':
      return 'LOSS'
    case 'agreed':
    case 'stalemate':
    case 'insufficient':
    case 'timevsinsufficient':
      return 'DRAW'
    default:
      return 'UNKNOWN'
  }
})

const resultClass = computed(() => {
  switch (playerResult.value) {
    case 'win':
      return 'win'
    case 'checkmated':
    case 'timeout':
    case 'resigned':
    case 'abandoned':
      return 'loss'
    case 'agreed':
    case 'stalemate':
    case 'insufficient':
    case 'timevsinsufficient':
      return 'draw'
    default:
      return 'unknown'
  }
})

const formattedDate = computed(() => {
  return new Date(props.game.end_time * 1000).toLocaleDateString()
})

const formatTimeClass = (timeClass: string): string => {
  return timeClass.charAt(0).toUpperCase() + timeClass.slice(1)
}
</script>

<style scoped>
.game-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.game-card.win {
  border-left-color: #4CAF50;
}

.game-card.loss {
  border-left-color: #f44336;
}

.game-card.draw {
  border-left-color: #FF9800;
}

.game-card.unknown {
  border-left-color: #9E9E9E;
}

.game-card.selected {
  background: #f0f8ff;
  border-color: #2196F3;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-result {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-text {
  font-weight: 600;
  color: #2c3e50;
}

.result-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}

.result-badge.win {
  background: #4CAF50;
}

.result-badge.loss {
  background: #f44336;
}

.result-badge.draw {
  background: #FF9800;
}

.result-badge.unknown {
  background: #9E9E9E;
}

.game-date {
  color: #666;
  font-size: 0.9rem;
}

.game-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.players {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.player {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.player.current {
  background: #e3f2fd;
  font-weight: 600;
}

.piece {
  font-size: 1.2rem;
}

.username {
  font-weight: 500;
}

.rating {
  color: #666;
  font-size: 0.9rem;
}

.vs {
  font-weight: bold;
  color: #666;
}

.game-meta {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.game-meta > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.label {
  font-size: 0.8rem;
  color: #666;
}

.value {
  font-weight: 600;
  color: #2c3e50;
}

.badge {
  background: #2196F3;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.accuracies {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding: 0.5rem;
  background: #f0f4f7;
  border-radius: 4px;
}

.accuracy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.view-game-btn {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.view-game-btn:hover {
  background: #369870;
}

.chess-com-link {
  color: #2196F3;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.chess-com-link:hover {
  color: #1976D2;
}

@media (max-width: 768px) {
  .players {
    flex-direction: column;
    gap: 0.5rem;
  }

  .vs {
    transform: rotate(90deg);
  }

  .game-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .accuracies {
    flex-direction: column;
    gap: 0.5rem;
  }

  .game-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>