export const ROWS = 9
export const COLS = 9
export const MINES = 10

export const numberColors: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
}

export type CellState = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacentMines: number
}
