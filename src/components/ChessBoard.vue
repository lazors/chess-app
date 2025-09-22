<template>
  <div class="chess-board-container">
    <div ref="boardElement" class="chess-board"></div>
    <div v-if="showControls" class="board-controls">
      <button @click="flipBoard">Flip Board</button>
      <button @click="resetPosition">Reset</button>
      <button v-if="pgn" @click="loadPgn">Load Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
}>()

const boardElement = ref<HTMLElement>()
const game = ref(new Chess())
let board: any = null

onMounted(async () => {
  // Dynamically import chessboard-element
  const { ChessBoard } = await import('chessboard-element')

  if (boardElement.value) {
    board = new ChessBoard()
    board.position = props.fen || 'start'
    board.orientation = props.orientation
    board.interactive = props.interactive

    // Set up move validation and handling
    if (props.interactive) {
      board.addEventListener('move', handleMove)
      board.addEventListener('snapend', onSnapEnd)
    }

    boardElement.value.appendChild(board)
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
      board.position = game.value.fen()
    }
  } catch (error) {
    // Invalid move, snap back
    board.position = game.value.fen()
  }
}

const onSnapEnd = () => {
  board.position = game.value.fen()
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

@media (max-width: 768px) {
  .chess-board {
    width: 300px;
    height: 300px;
  }
}
</style>