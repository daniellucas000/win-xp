import { onUnmounted } from 'vue'

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

interface ResizeState {
  startX: number
  startY: number
  startW: number
  startH: number
  startLeft: number
  startTop: number
  direction: ResizeDirection
}

const MIN_WIDTH = 200
const MIN_HEIGHT = 120

function hasEdge(dir: ResizeDirection, edge: string): boolean {
  return dir.includes(edge)
}

export function useResize(
  onUpdate: (x: number, y: number, width: number, height: number) => void
) {
  let state: ResizeState | null = null

  function start(
    e: MouseEvent,
    direction: ResizeDirection,
    currentX: number,
    currentY: number,
    currentW: number,
    currentH: number
  ) {
    e.preventDefault()

    state = {
      startX: e.clientX,
      startY: e.clientY,
      startW: currentW,
      startH: currentH,
      startLeft: currentX,
      startTop: currentY,
      direction,
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!state) return

    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY
    const dir = state.direction

    let x = state.startLeft
    let y = state.startTop
    let w = state.startW
    let h = state.startH

    if (hasEdge(dir, 'e')) {
      w = Math.max(MIN_WIDTH, state.startW + dx)
    }

    if (hasEdge(dir, 'w')) {
      w = Math.max(MIN_WIDTH, state.startW - dx)
      x = state.startLeft + (state.startW - w)
    }

    if (hasEdge(dir, 's')) {
      h = Math.max(MIN_HEIGHT, state.startH + dy)
    }

    if (hasEdge(dir, 'n')) {
      h = Math.max(MIN_HEIGHT, state.startH - dy)
      y = state.startTop + (state.startH - h)
    }

    onUpdate(x, y, w, h)
  }

  function onMouseUp() {
    cleanup()
  }

  function cleanup() {
    state = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  onUnmounted(cleanup)

  return { start }
}