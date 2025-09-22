<template>
  <div class="games-view">
    <h1>Recent Games</h1>

    <div v-if="chessStore.isLoading" class="loading">
      Loading games...
    </div>

    <div v-else-if="chessStore.hasError" class="error">
      {{ chessStore.error }}
    </div>

    <div v-else-if="chessStore.recentGames.length === 0" class="no-games">
      No recent games found. Please enter a username on the home page.
    </div>

    <div v-else class="games-container">
      <div class="games-header">
        <h2>{{ chessStore.recentGames.length }} Recent Games</h2>
        <div class="view-controls">
          <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }">
            List View
          </button>
          <button @click="viewMode = 'board'" :class="{ active: viewMode === 'board' }">
            Board View
          </button>
        </div>
      </div>

      <div v-if="viewMode === 'list'" class="games-list">
        <GameCard
          v-for="(game, index) in chessStore.recentGames"
          :key="game.url"
          :game="game"
          :player-username="chessStore.profile?.username || ''"
          @select="selectGame(index)"
          :class="{ selected: selectedGameIndex === index }"
        />
      </div>

      <div v-else class="board-view">
        <div class="game-selector">
          <select v-model="selectedGameIndex" @change="loadSelectedGame">
            <option v-for="(game, index) in chessStore.recentGames" :key="index" :value="index">
              Game {{ index + 1 }}: {{ getGameDescription(game) }}
            </option>
          </select>
        </div>

        <div v-if="selectedGame" class="game-display">
          <div class="game-info">
            <h3>{{ getGameDescription(selectedGame) }}</h3>
            <p>{{ formatGameDate(selectedGame.end_time) }}</p>
            <p>Time Control: {{ selectedGame.time_control }}</p>
            <p v-if="selectedGame.accuracies">
              Accuracy: White {{ selectedGame.accuracies.white }}%, Black {{ selectedGame.accuracies.black }}%
            </p>
          </div>

          <SimpleChessBoard
            :key="boardKey"
            :pgn="selectedGame.pgn"
            :show-controls="true"
            :interactive="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChessStore } from '@/stores/chess'
import GameCard from '@/components/GameCard.vue'
import SimpleChessBoard from '@/components/SimpleChessBoard.vue'
import type { ChessComGame } from '@/types/chess'

const chessStore = useChessStore()
const viewMode = ref<'list' | 'board'>('list')
const selectedGameIndex = ref<number>(0)
const boardKey = ref(0)

const selectedGame = computed(() => {
  return chessStore.recentGames[selectedGameIndex.value] || null
})

const selectGame = (index: number) => {
  selectedGameIndex.value = index
  viewMode.value = 'board'
  loadSelectedGame()
}

const loadSelectedGame = () => {
  // Force re-render of the chess board component
  boardKey.value += 1
}

const getGameDescription = (game: ChessComGame): string => {
  const playerUsername = chessStore.profile?.username || ''
  const isWhite = game.white.username.toLowerCase() === playerUsername.toLowerCase()
  const opponent = isWhite ? game.black.username : game.white.username
  const result = isWhite ? game.white.result : game.black.result

  let resultText = ''
  switch (result) {
    case 'win':
      resultText = 'Won'
      break
    case 'checkmated':
    case 'timeout':
    case 'resigned':
    case 'abandoned':
      resultText = 'Lost'
      break
    case 'agreed':
    case 'stalemate':
    case 'insufficient':
    case 'timevsinsufficient':
      resultText = 'Draw'
      break
    default:
      resultText = 'Unknown'
  }

  return `${resultText} vs ${opponent} (${game.time_class})`
}

const formatGameDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

// Auto-select first game if available
if (chessStore.recentGames.length > 0) {
  selectedGameIndex.value = 0
}
</script>

<style scoped>
.games-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.loading, .error, .no-games {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #f44336;
}

.games-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.games-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-controls button.active,
.view-controls button:hover {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.board-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-selector {
  margin-bottom: 1rem;
}

.game-selector select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.game-display {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: start;
}

.game-info {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.game-info h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.game-info p {
  margin: 0.5rem 0;
  color: #666;
}

h1, h2 {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .games-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .game-display {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .view-controls {
    justify-content: center;
  }
}
</style>