export function useDrag(
  onMove: (x: number, y: number) => void,
) {
  let startX = 0
  let startY = 0
  let originX = 0
  let originY = 0

  function start(e: MouseEvent, currentX: number, currentY: number) {
    e.preventDefault()

    startX = e.clientX
    startY = e.clientY
    originX = currentX
    originY = currentY

    function onMouseMove(e: MouseEvent) {
      const x = originX + (e.clientX - startX)
      const y = Math.max(0, originY + (e.clientY - startY))
      onMove(x, y)
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return { start }
}