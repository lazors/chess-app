<template>
  <div class="chess-board-wrapper">
    <div class="chess-board" :class="{ flipped: orientation === 'black' }">
      <div
        v-for="(square, index) in squares"
        :key="index"
        class="square"
        :class="{
          'light': isLightSquare(index),
          'dark': !isLightSquare(index),
          'selected': selectedSquare === index,
          'possible-move': possibleMoves.includes(index)
        }"
        @click="handleSquareClick(index)"
      >
        <div v-if="square" class="piece" :class="getPieceClass(square)">
          {{ getPieceSymbol(square) }}
        </div>
      </div>
    </div>
    <div v-if="showControls" class="board-controls">
      <button @click="flipBoard">Flip Board</button>
      <button @click="resetPosition">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

const game = ref(new Chess())
const selectedSquare = ref<number | null>(null)
const possibleMoves = ref<number[]>([])
const orientation = ref(props.orientation)

// Convert board array to squares for display
const squares = computed(() => {
  const board = game.value.board()
  const flatBoard: (any | null)[] = []

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[orientation.value === 'white' ? 7 - rank : rank][file]
      flatBoard.push(piece)
    }
  }

  return flatBoard
})

const isLightSquare = (index: number): boolean => {
  const rank = Math.floor(index / 8)
  const file = index % 8
  return (rank + file) % 2 === 0
}

const indexToSquare = (index: number): string => {
  const rank = Math.floor(index / 8)
  const file = index % 8

  if (orientation.value === 'white') {
    return String.fromCharCode(97 + file) + (8 - rank)
  } else {
    return String.fromCharCode(97 + (7 - file)) + (rank + 1)
  }
}

const squareToIndex = (square: string): number => {
  const file = square.charCodeAt(0) - 97
  const rank = parseInt(square[1]) - 1

  if (orientation.value === 'white') {
    return (7 - rank) * 8 + file
  } else {
    return rank * 8 + (7 - file)
  }
}

const getPieceClass = (piece: any): string => {
  if (!piece) return ''
  return `${piece.color}-${piece.type}`
}

const getPieceSymbol = (piece: any): string => {
  if (!piece) return ''

  const symbols: Record<string, Record<string, string>> = {
    w: {
      k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙'
    },
    b: {
      k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
    }
  }

  return symbols[piece.color]?.[piece.type] || ''
}

const handleSquareClick = (index: number) => {
  if (!props.interactive) return

  const square = indexToSquare(index)

  if (selectedSquare.value === null) {
    // Select a piece
    const piece = game.value.get(square)
    if (piece) {
      selectedSquare.value = index
      updatePossibleMoves(square)
    }
  } else {
    // Try to make a move
    const fromSquare = indexToSquare(selectedSquare.value)

    if (selectedSquare.value === index) {
      // Deselect
      selectedSquare.value = null
      possibleMoves.value = []
    } else {
      // Attempt move
      try {
        const move = game.value.move({
          from: fromSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        })

        if (move) {
          emit('move', { from: fromSquare, to: square, promotion: 'q' })

          // Check for game end
          if (game.value.isGameOver()) {
            let result = 'Draw'
            if (game.value.isCheckmate()) {
              result = game.value.turn() === 'w' ? 'Black wins' : 'White wins'
            }
            emit('gameEnd', result)
          }
        }
      } catch (error) {
        console.log('Invalid move')
      }

      selectedSquare.value = null
      possibleMoves.value = []
    }
  }
}

const updatePossibleMoves = (square: string) => {
  const moves = game.value.moves({ square, verbose: true })
  possibleMoves.value = moves.map(move => squareToIndex(move.to))
}

const flipBoard = () => {
  orientation.value = orientation.value === 'white' ? 'black' : 'white'
  selectedSquare.value = null
  possibleMoves.value = []
}

const resetPosition = () => {
  game.value.reset()
  selectedSquare.value = null
  possibleMoves.value = []
}

const loadPgn = () => {
  if (props.pgn) {
    try {
      game.value.loadPgn(props.pgn)
      selectedSquare.value = null
      possibleMoves.value = []
    } catch (error) {
      console.error('Error loading PGN:', error)
    }
  }
}

// Watch for external changes
watch(() => props.fen, (newFen) => {
  if (newFen) {
    try {
      game.value.load(newFen)
      selectedSquare.value = null
      possibleMoves.value = []
    } catch (error) {
      console.error('Error loading FEN:', error)
    }
  }
})

watch(() => props.pgn, (newPgn) => {
  if (newPgn) {
    loadPgn()
  }
})

// Initialize with props
if (props.fen) {
  game.value.load(props.fen)
} else if (props.pgn) {
  loadPgn()
}

// Expose methods
defineExpose({
  flipBoard,
  resetPosition,
  loadPgn,
  getCurrentFen: () => game.value.fen(),
  getCurrentPgn: () => game.value.pgn()
})
</script>

<style scoped>
.chess-board-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.chess-board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 400px;
  height: 400px;
  border: 2px solid #8B4513;
}

.square {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.square.light {
  background-color: #f0d9b5;
}

.square.dark {
  background-color: #b58863;
}

.square.selected {
  background-color: #ffff00 !important;
}

.square.possible-move {
  background-color: #00ff00 !important;
  opacity: 0.7;
}

.square:hover {
  opacity: 0.8;
}

.piece {
  font-size: 2rem;
  line-height: 1;
  pointer-events: none;
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

  .piece {
    font-size: 1.5rem;
  }
}
</style>