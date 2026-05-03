import type { DesktopIcon } from '~/data/desktop'
import { useDesktopIcons } from './useDesktopIcons'

interface UseDesktopSelectionOptions {
  visibleIcons: ReturnType<typeof useDesktopIcons>['visibleIcons']
  renamingItem: Ref<number | null>
  contextMenu: ReturnType<typeof useDesktopIcons>['contextMenu']
  openItem: (item: DesktopIcon) => void
  startRename: (id: number) => void
}

interface SelectionBox {
  x: number
  y: number
  width: number
  height: number
}

export function useDesktopSelection(options: UseDesktopSelectionOptions) {
  const { visibleIcons, renamingItem, contextMenu, openItem, startRename } = options

  const selectedIcons = ref<Set<number>>(new Set())
  const focusedIconIndex = ref<number | null>(null)
  const iconElements = ref<Map<number, HTMLElement>>(new Map())
  const selectionBox = ref<SelectionBox | null>(null)
  const savedDesktopRect = ref<DOMRect | null>(null)

  let selectionStart = { x: 0, y: 0 }
  let isSelecting = false

  onUnmounted(() => {
    isSelecting = false
    selectionBox.value = null
  })

  function toggleIconSelection(id: number, e: MouseEvent) {
    if (selectedIcons.value.has(id)) {
      selectedIcons.value.delete(id)
    } else {
      if (!e.ctrlKey) {
        selectedIcons.value.clear()
      }
      selectedIcons.value.add(id)
    }
  }

  function onDesktopMouseDown(e: MouseEvent, desktopRef: HTMLElement | null) {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('.desktop__icon')) return

    const desktopRect = desktopRef?.getBoundingClientRect()
    if (!desktopRect) return

    savedDesktopRect.value = desktopRect
    focusedIconIndex.value = null
    isSelecting = true

    if (!e.ctrlKey) {
      selectedIcons.value.clear()
    }

    selectionStart = { x: e.clientX - desktopRect.left, y: e.clientY - desktopRect.top }
    selectionBox.value = { x: selectionStart.x, y: selectionStart.y, width: 0, height: 0 }
  }

  function onDesktopMouseMove(e: MouseEvent) {
    if (!isSelecting || !savedDesktopRect.value) return

    const desktopRect = savedDesktopRect.value
    const currentX = e.clientX - desktopRect.left
    const currentY = e.clientY - desktopRect.top

    selectionBox.value = {
      x: Math.min(selectionStart.x, currentX),
      y: Math.min(selectionStart.y, currentY),
      width: Math.abs(currentX - selectionStart.x),
      height: Math.abs(currentY - selectionStart.y),
    }
  }

  function onDesktopMouseUp() {
    if (!isSelecting || !selectionBox.value || !savedDesktopRect.value) {
      isSelecting = false
      return
    }

    const box = selectionBox.value
    const desktopRect = savedDesktopRect.value

    iconElements.value.forEach((iconEl, id) => {
      const rect = iconEl.getBoundingClientRect()
      const iconX = rect.left - desktopRect.left
      const iconY = rect.top - desktopRect.top
      const iconW = rect.width
      const iconH = rect.height

      const intersects = !(
        iconX + iconW < box.x ||
        iconX > box.x + box.width ||
        iconY + iconH < box.y ||
        iconY > box.y + box.height
      )

      if (intersects) {
        selectedIcons.value.add(id)
      } else if (box.width > 5 || box.height > 5) {
        selectedIcons.value.delete(id)
      }
    })

    isSelecting = false
    selectionBox.value = null
  }

  function handleDesktopKeydown(e: KeyboardEvent) {
    if (renamingItem.value !== null) return
    if (contextMenu.value.open) return

    const icons = visibleIcons.value
    if (icons.length === 0) return

    const currentIndex = focusedIconIndex.value
    const item = currentIndex !== null ? icons[currentIndex] : null

    const next = () => currentIndex === null ? 0 : (currentIndex + 1) % icons.length
    const prev = () => currentIndex === null ? icons.length - 1 : (currentIndex - 1 + icons.length) % icons.length

    const actions: Record<string, () => void> = {
      ArrowRight: () => { focusedIconIndex.value = next() },
      ArrowDown:  () => { focusedIconIndex.value = next() },
      ArrowLeft:  () => { focusedIconIndex.value = prev() },
      ArrowUp:    () => { focusedIconIndex.value = prev() },
      Enter:      () => { item && openItem(item) },
      F2:         () => { item && !item.isSystem && !item.isProtected && startRename(item.id) },
    }

    const action = actions[e.key]
    if (action) {
      e.preventDefault()
      action()
    }
  }

  return {
    selectedIcons,
    focusedIconIndex,
    iconElements,
    selectionBox,
    toggleIconSelection,
    onDesktopMouseDown,
    onDesktopMouseMove,
    onDesktopMouseUp,
    handleDesktopKeydown,
  }
}