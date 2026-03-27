<script setup lang="ts">
type CellState = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacentMines: number
}

const ROWS = 9
const COLS = 9
const MINES = 10

const board = ref<CellState[][]>([])
const gameOver = ref(false)
const gameWon = ref(false)
const started = ref(false)
const minesLeft = ref(MINES)
const seconds = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const numberColors: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
}

function createBoard() {
  board.value = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
    }))
  )
  gameOver.value = false
  gameWon.value = false
  started.value = false
  minesLeft.value = MINES
  seconds.value = 0
  if (timer) clearInterval(timer)
}

function placeMines(excludeRow: number, excludeCol: number) {
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!board.value[r][c].mine && !(r === excludeRow && c === excludeCol)) {
      board.value[r][c].mine = true
      placed++
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board.value[r][c].mine) {
        board.value[r][c].adjacentMines = countAdjacent(r, c)
      }
    }
  }
}

function countAdjacent(row: number, col: number) {
  let count = 0
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr
      const c = col + dc
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board.value[r][c].mine) {
        count++
      }
    }
  }
  return count
}

function reveal(row: number, col: number) {
  const cell = board.value[row][col]
  if (cell.revealed || cell.flagged || gameOver.value || gameWon.value) return

  if (!started.value) {
    started.value = true
    placeMines(row, col)
    timer = setInterval(() => {
      if (seconds.value < 999) seconds.value++
    }, 1000)
  }

  cell.revealed = true

  if (cell.mine) {
    gameOver.value = true
    revealAllMines()
    if (timer) clearInterval(timer)
    return
  }

  if (cell.adjacentMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          reveal(r, c)
        }
      }
    }
  }

  checkWin()
}

function revealAllMines() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board.value[r][c].mine) board.value[r][c].revealed = true
    }
  }
}

function toggleFlag(e: MouseEvent, row: number, col: number) {
  e.preventDefault()
  const cell = board.value[row][col]
  if (cell.revealed || gameOver.value || gameWon.value) return
  cell.flagged = !cell.flagged
  minesLeft.value += cell.flagged ? -1 : 1
}

function checkWin() {
  const allSafeRevealed = board.value.every(row =>
    row.every(cell => cell.mine || cell.revealed)
  )
  if (allSafeRevealed) {
    gameWon.value = true
    if (timer) clearInterval(timer)
  }
}

function faceIcon() {
  if (gameOver.value) return '😵'
  if (gameWon.value) return '😎'
  return '🙂'
}

onMounted(() => createBoard())
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="minesweeper">
    <!-- Header -->
    <div class="minesweeper__header">
      <div class="minesweeper__counter">{{ String(minesLeft).padStart(3, '0') }}</div>
      <button class="minesweeper__face" @click="createBoard">{{ faceIcon() }}</button>
      <div class="minesweeper__counter">{{ String(seconds).padStart(3, '0') }}</div>
    </div>

    <!-- Board -->
    <div class="minesweeper__board">
      <div
        v-for="(row, ri) in board"
        :key="ri"
        class="minesweeper__row"
      >
        <button
          v-for="(cell, ci) in row"
          :key="ci"
          class="minesweeper__cell"
          :class="{
            'minesweeper__cell--revealed': cell.revealed,
            'minesweeper__cell--mine': cell.revealed && cell.mine,
          }"
          :style="cell.revealed && cell.adjacentMines > 0 && !cell.mine
            ? { color: numberColors[cell.adjacentMines] }
            : {}"
          @click="reveal(ri, ci)"
          @contextmenu="toggleFlag($event, ri, ci)"
        >
          <template v-if="cell.revealed">
            <span v-if="cell.mine">💣</span>
            <span v-else-if="cell.adjacentMines > 0">{{ cell.adjacentMines }}</span>
          </template>
          <template v-else>
            <span v-if="cell.flagged">🚩</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/apps/Minesweeper.scss';
</style>