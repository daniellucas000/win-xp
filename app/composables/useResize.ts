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
    e.stopPropagation()

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

    let { startLeft: x, startTop: y, startW: w, startH: h } = state
    const dir = state.direction

    if (dir.includes('e')) {
      w = Math.max(MIN_WIDTH, state.startW + dx)
    }
    if (dir.includes('w')) {
      const newW = Math.max(MIN_WIDTH, state.startW - dx)
      x = state.startLeft + (state.startW - newW)
      w = newW
    }

    if (dir.includes('s')) {
      h = Math.max(MIN_HEIGHT, state.startH + dy)
    }
    if (dir.includes('n')) {
      const newH = Math.max(MIN_HEIGHT, state.startH - dy)
      y = state.startTop + (state.startH - newH)
      h = newH
    }

    onUpdate(x, y, w, h)
  }

  function onMouseUp() {
    state = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  return { start }
}