import { useWindowsStore } from '~/stores/windows'
import { systemIcons, type DesktopIcon } from '~/data/desktop'
import type { AppName } from '~/stores/windows'
import { useFileSystem } from '~/composables/useFileSystem'
import { STORAGE_KEYS } from '~/constants/storage'
import { useDebounceFn } from '@vueuse/core'

interface UseDesktopIconsOptions {
  store: ReturnType<typeof useWindowsStore>
  openWindowlessApp: (app: AppName) => void
  playOpen: () => void
}

interface ContextMenuState {
  open: boolean
  x: number
  y: number
  selectedIcon: DesktopIcon | null
}

const TRASH_FULL_ICON = '/images/xp/icons/recycle-bin-full.png'
const TRASH_EMPTY_ICON = '/images/xp/icons/recycle-bin-empty.png'
const TRASH_FOLDER_ID = -1

export function useDesktopIcons(options: UseDesktopIconsOptions) {
  const { store, openWindowlessApp, playOpen } = options
  const fileSystem = useFileSystem()

  const desktopIcons = ref<DesktopIcon[]>([...systemIcons])

  const contextMenu = ref<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
    selectedIcon: null
  })

  const trashCount = computed(() =>
    desktopIcons.value.filter(icon => icon.isDeleted).length
  )

  const computedIcons = computed(() =>
    desktopIcons.value.map(icon => {
      if (icon.type !== 'trash') return icon
      return {
        ...icon,
        icon: trashCount.value > 0 ? TRASH_FULL_ICON : TRASH_EMPTY_ICON
      }
    })
  )

  const visibleIcons = computed(() =>
    computedIcons.value.filter(icon => !icon.isDeleted)
  )

  function parseStoredIcons(key: string, extra?: Partial<DesktopIcon>): DesktopIcon[] {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return []
      return JSON.parse(raw).map((icon: DesktopIcon) => ({
        ...icon,
        ...extra,
        modifiedAt: new Date(icon.modifiedAt)
      }))
    } catch {
      console.warn(`[Desktop] Falha ao ler "${key}" do localStorage`)
      return []
    }
  }

  function loadFromStorage() {
    if (typeof window === 'undefined') return

    const userIcons = parseStoredIcons(STORAGE_KEYS.ICONS)
    const trashIcons = parseStoredIcons(STORAGE_KEYS.TRASH, { isDeleted: true })

    desktopIcons.value = [...systemIcons, ...userIcons, ...trashIcons]
  }

  const saveToStorage = useDebounceFn(() => {
    if (typeof window === 'undefined') return

    const userIcons = desktopIcons.value.filter(icon => !icon.isSystem && !icon.isDeleted)
    const trashIcons = desktopIcons.value.filter(icon => icon.isDeleted)

    localStorage.setItem(STORAGE_KEYS.ICONS, JSON.stringify(userIcons))
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(trashIcons))
  }, 300)

  function onRightClick(e: MouseEvent, icon?: DesktopIcon) {
    e.preventDefault()
    contextMenu.value = {
      open: true,
      x: e.clientX,
      y: e.clientY,
      selectedIcon: icon ?? null
    }
  }

  function onIconRightClick(e: MouseEvent, icon: DesktopIcon) {
    e.preventDefault()
    e.stopPropagation()
    contextMenu.value = {
      open: true,
      x: e.clientX,
      y: e.clientY,
      selectedIcon: icon
    }
  }

  function resolveFolderId(item: DesktopIcon) {
    if (item.type === 'trash') return TRASH_FOLDER_ID
    if (item.type === 'folder' || item.type === 'txt') return item.id
    return undefined
  }

  function openItem(item: DesktopIcon) {
    playOpen()

    if (item.app === 'mediaplayer') {
      return openWindowlessApp(item.app)
    }

    const folderId = resolveFolderId(item)
    const title = item.type === 'trash' ? 'Lixeira' : item.label

    store.open(item.app, { folderId, title, icon: item.icon })
  }

  function createDesktopIcon(data: Partial<DesktopIcon>): DesktopIcon {
    return {
      size: 0,
      modifiedAt: new Date(),
      isSystem: false,
      ...data,
    } as DesktopIcon
  }

  function createFolder(): { id: number; name: string } {
    const name = 'Nova Pasta'
    const fsItem = fileSystem.createFolder(0, name)

    desktopIcons.value = [
      ...desktopIcons.value,
      createDesktopIcon({
        id: fsItem.id,
        icon: fsItem.icon,
        label: fsItem.name,
        app: 'explorer',
        type: 'folder'
      })
    ]

    saveToStorage()
    return { id: fsItem.id, name }
  }

  function createTextDocument(): { id: number; name: string } {
    const name = 'Novo Documento de Texto'
    const fsItem = fileSystem.createFile(0, name, '')

    desktopIcons.value = [
      ...desktopIcons.value,
      createDesktopIcon({
        id: fsItem.id,
        icon: fsItem.icon,
        label: fsItem.name,
        app: 'notepad',
        type: 'txt'
      })
    ]

    saveToStorage()
    return { id: fsItem.id, name }
  }

  function systemFirst(a: DesktopIcon, b: DesktopIcon): number {
    if (a.isSystem && !b.isSystem) return -1
    if (!a.isSystem && b.isSystem) return 1
    return 0
  }

  function sortIcons(compare: (a: DesktopIcon, b: DesktopIcon) => number) {
    desktopIcons.value = [...desktopIcons.value].sort((a, b) => {
      const sys = systemFirst(a, b)
      return sys !== 0 ? sys : compare(a, b)
    })
  }

  function sortByName() {
    sortIcons((a, b) => a.label.localeCompare(b.label))
  }

  function sortBySize() {
    sortIcons((a, b) => a.size - b.size)
  }

  function sortByType() {
    const typeOrder: Record<string, number> = { folder: 0, app: 1, txt: 2, trash: 3 }
    sortIcons((a, b) => (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99))
  }

  function sortByModified() {
    sortIcons((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
  }

  return {
    desktopIcons,
    visibleIcons,
    contextMenu,
    loadFromStorage,
    saveToStorage,
    onRightClick,
    onIconRightClick,
    openItem,
    createFolder,
    createTextDocument,
    sortByName,
    sortBySize,
    sortByType,
    sortByModified,
  }
}