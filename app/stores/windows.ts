import { defineStore } from 'pinia'

export type AppName = 'notepad' | 'minesweeper' | 'paint' | 'ie' | 'mediaplayer' | 'explorer' | 'msn'

export interface WindowState {
  id: string
  app: AppName
  title: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  focused: boolean
  zIndex: number
  folderId?: number
}

const APP_DEFAULTS: Record<AppName, Partial<WindowState>> = {
  notepad:     { title: 'Untitled - Notepad',          width: 500, height: 380 },
  minesweeper: { title: 'Minesweeper',                  width: 200, height: 260 },
  paint:       { title: 'Untitled - Paint',             width: 700, height: 500 },
  ie:          { title: 'Microsoft Internet Explorer',  width: 800, height: 560 },
  mediaplayer: { title: 'Windows Media Player',         width: 520, height: 400 },
  explorer:    { title: 'Meu computador',                  width: 600, height: 420 },
  msn:         { title: 'MSN Messenger',                width: 280, height: 450 },
}

let zCounter = 100

export const useWindowsStore = defineStore('windows', () => {
  const windows = ref<WindowState[]>([])

  function open(app: AppName, options?: { folderId?: number; title?: string }) {
    const id = `${app}-${Date.now()}`
    const offset = windows.value.length * 24

    windows.value.push({
      id,
      app,
      x: 60 + offset,
      y: 40 + offset,
      minimized: false,
      maximized: false,
      focused: true,
      zIndex: ++zCounter,
      folderId: options?.folderId,
      title: options?.title || APP_DEFAULTS[app]?.title || '',
    } as WindowState)

    focusWindow(id)
  }

  function close(id: string) {
    windows.value = windows.value.filter(w => w.id !== id)
  }

  function focusWindow(id: string) {
    windows.value.forEach(w => {
      w.focused = w.id === id
      if (w.id === id) w.zIndex = ++zCounter
    })
  }

  function minimize(id: string) {
    const w = windows.value.find(w => w.id === id)
    if (!w) return
    w.minimized = !w.minimized
    if (!w.minimized) focusWindow(id)
  }

  function maximize(id: string) {
    const w = windows.value.find(w => w.id === id)
    if (w) w.maximized = !w.maximized
  }

  function updatePosition(id: string, x: number, y: number) {
    const w = windows.value.find(w => w.id === id)
    if (w) { w.x = x; w.y = y }
  }

  function updateSize(id: string, width: number, height: number) {
    const w = windows.value.find(w => w.id === id)
    if (w) { w.width = width; w.height = height }
  }

  const openWindows = computed(() =>
    windows.value.filter(w => !w.minimized)
  )

  const taskbarWindows = computed(() => windows.value)

  return {
    windows,
    open,
    close,
    focusWindow,
    minimize,
    maximize,
    updatePosition,
    updateSize,
    openWindows,
    taskbarWindows,
  }
})