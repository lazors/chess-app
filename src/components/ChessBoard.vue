<template>
  <div class="chess-board-container">
    <div v-if="isLoading" class="loading">
      Loading chess board...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <template v-else>
      <div ref="boardElement" class="chess-board" role="application" aria-label="Chess board"></div>
      <div v-if="showControls" class="board-controls" role="toolbar" aria-label="Chess board controls">
        <button 
          @click="flipBoard" 
          aria-label="Flip chess board orientation"
          type="button"
        >
          Flip Board
        </button>
        <button 
          @click="resetPosition" 
          aria-label="Reset board to starting position"
          type="button"
        >
          Reset
        </button>
        <button 
          v-if="pgn" 
          @click="loadPgn"
          aria-label="Load game from PGN notation"
          type="button"
        >
          Load Game
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chess } from 'chess.js'

interface Props {
  fen?: string
  pgn?: string
  showControls?: boolean
  interactive?: boolean
  orientation?: 'white' | 'black'
}

const props = withDefaults(defineProps<Props>(), {
  showControls: true,
  interactive: true,
  orientation: 'white'
})

const emit = defineEmits<{
  move: [move: { from: string; to: string; promotion?: string }]
  gameEnd: [result: string]
  error: [error: string]
}>()

const boardElement = ref<HTMLElement>()
const game = ref(new Chess())
const isLoading = ref(true)
const error = ref<string | null>(null)

// Type-safe board reference using any for chessboard-element (no official types available)
let board: any = null

onMounted(async () => {
  try {
    // Dynamically import chessboard-element
    await import('chessboard-element')

    if (boardElement.value) {
      // Create custom element
      board = document.createElement('chess-board')
      board.position = props.fen || 'start'
      board.orientation = props.orientation
      board.interactive = props.interactive

      // Set up move validation and handling
      if (props.interactive) {
        board.addEventListener('move', handleMove as EventListener)
        board.addEventListener('snapend', onSnapEnd as EventListener)
      }

      boardElement.value.appendChild(board)
      isLoading.value = false
    }
  } catch (err) {
    const errorMessage = 'Failed to load chess board'
    error.value = errorMessage
    emit('error', errorMessage)
    console.error('Error loading chessboard:', err)
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (board) {
    try {
      // Clean up event listeners
      if (props.interactive) {
        board.removeEventListener('move', handleMove as EventListener)
        board.removeEventListener('snapend', onSnapEnd as EventListener)
      }
      // Remove board from DOM
      if (board.parentNode) {
        board.parentNode.removeChild(board)
      }
    } catch (err) {
      console.warn('Error during board cleanup:', err)
    }
  }
})

const handleMove = (event: CustomEvent) => {
  const { from, to, promotion } = event.detail

  try {
    const move = game.value.move({
      from,
      to,
      promotion: promotion || 'q'
    })

    if (move) {
      emit('move', { from, to, promotion })

      // Check for game end
      if (game.value.isGameOver()) {
        let result = 'Draw'
        if (game.value.isCheckmate()) {
          result = game.value.turn() === 'w' ? 'Black wins' : 'White wins'
        }
        emit('gameEnd', result)
      }
    } else {
      // Invalid move, snap back
      if (board) {
        board.position = game.value.fen()
      }
    }
  } catch (error) {
    // Invalid move, snap back
    if (board) {
      board.position = game.value.fen()
    }
  }
}

const onSnapEnd = () => {
  if (board) {
    board.position = game.value.fen()
  }
}

const flipBoard = () => {
  if (board) {
    board.orientation = board.orientation === 'white' ? 'black' : 'white'
  }
}

const resetPosition = () => {
  game.value.reset()
  if (board) {
    board.position = 'start'
  }
}

const loadPgn = () => {
  if (props.pgn) {
    try {
      game.value.loadPgn(props.pgn)
      if (board) {
        board.position = game.value.fen()
      }
    } catch (error) {
      console.error('Error loading PGN:', error)
    }
  }
}

// Watch for external FEN changes
watch(() => props.fen, (newFen) => {
  if (newFen && board) {
    try {
      game.value.load(newFen)
      board.position = newFen
    } catch (error) {
      console.error('Error loading FEN:', error)
    }
  }
})

// Watch for PGN changes
watch(() => props.pgn, (newPgn) => {
  if (newPgn) {
    loadPgn()
  }
})

// Expose methods for parent components
defineExpose({
  flipBoard,
  resetPosition,
  loadPgn,
  getCurrentFen: () => game.value.fen(),
  getCurrentPgn: () => game.value.pgn()
})
</script>

<style scoped>
.chess-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.chess-board {
  width: 400px;
  height: 400px;
}

.board-controls {
  display: flex;
  gap: 0.5rem;
}

.board-controls button {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.board-controls button:hover {
  background: #369870;
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
}

.loading {
  color: var(--text-muted, #666);
  background: var(--bg-subtle, #f9f9f9);
}

.error {
  color: var(--error-text, #dc3545);
  background: var(--error-bg, #f8d7da);
  border-color: var(--error-border, #f5c6cb);
}

@media (max-width: 768px) {
  .chess-board, .loading, .error {
    width: 300px;
    height: 300px;
  }
}
</style>