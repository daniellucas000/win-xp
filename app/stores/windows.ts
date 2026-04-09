import { defineStore } from 'pinia'

export type AppName = 'notepad' | 'paint' | 'ie' | 'mediaplayer' | 'explorer' | 'msn'
export interface WindowState {
  id: string
  app: AppName
  title: string
  icon?: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  focused: boolean
  zIndex: number
  folderId?: number
  progress?: number
  closing?: boolean
}

const APP_DEFAULTS: Record<AppName, Partial<WindowState>> = {
  notepad:     { title: 'Untitled - Notepad',          width: 500, height: 380 },
  paint:       { title: 'Untitled - Paint',             width: 700, height: 500 },
  ie:          { title: 'Microsoft Internet Explorer',  width: 800, height: 560 },
  mediaplayer: { title: 'Windows Media Player',         width: 520, height: 400 },
  explorer:    { title: 'Meu computador',               width: 600, height: 420 },
  msn:         { title: 'MSN Messenger',                width: 280, height: 450 },
}

let zCounter = 100

export const useWindowsStore = defineStore('windows', () => {
  const windows = ref<WindowState[]>([])
  const showDesktopActive = ref(false)
  const preMinimizeState = ref<WindowState[]>([])

  function open(app: AppName, options?: { folderId?: number; title?: string; icon?: string }) {
    if (app === 'mediaplayer') return

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
      progress: undefined,
      closing: false,
      ...APP_DEFAULTS[app],
      title: options?.title || APP_DEFAULTS[app]?.title || '',
      icon: options?.icon ?? APP_DEFAULTS[app]?.icon,
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

  function updatePositionAndSize(id: string, x: number, y: number, width: number, height: number) {
    const w = windows.value.find(w => w.id === id)
    if (!w) return
    w.x = x
    w.y = y
    w.width = width
    w.height = height
  }

  function setProgress(id: string, progress: number | undefined) {
    const w = windows.value.find(w => w.id === id)
    if (w) w.progress = progress
  }

  function updateWindowTitle(windowId: string, title: string, icon?: string) {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.title = title
      if (icon !== undefined) window.icon = icon
    }
  }

  function toggleShowDesktop() {
    if (!showDesktopActive.value) {
      preMinimizeState.value = windows.value.map(w => ({ ...w }))
      windows.value.forEach(w => { w.minimized = true })
      showDesktopActive.value = true
    } else {
      preMinimizeState.value.forEach(saved => {
        const w = windows.value.find(win => win.id === saved.id)
        if (w) {
          w.minimized = false
          w.focused = saved.focused
          w.zIndex = saved.zIndex
        }
      })
      if (windows.value.length > 0) {
        const last = windows.value[windows.value.length - 1]
        if (last) focusWindow(last.id)
      }
      showDesktopActive.value = false
      preMinimizeState.value = []
    }
  }

  const openWindows = computed(() =>
    windows.value.filter(w => !w.minimized)
  )

  const taskbarWindows = computed(() => windows.value)

  const focusedWindow = computed(() =>
    windows.value.find(w => w.focused)
  )

  return {
    windows,
    open,
    close,
    focusWindow,
    minimize,
    maximize,
    updatePosition,
    updateSize,
    updatePositionAndSize,
    setProgress,
    updateWindowTitle,
    toggleShowDesktop,
    showDesktopActive,
    openWindows,
    taskbarWindows,
    focusedWindow,
  }
})
