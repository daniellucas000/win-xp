import type { DesktopIcon } from '~/data/desktop'
import { useFileSystem } from '~/composables/useFileSystem'

interface UseDesktopRenameOptions {
  desktopIcons: Ref<DesktopIcon[]>
  saveToStorage: () => void
  getInputElement?: () => HTMLInputElement | null
  onCancel?: () => void
  onRename?: (id: number, newName: string) => void
}

export function useDesktopRename(options: UseDesktopRenameOptions) {
  const { desktopIcons, saveToStorage, onCancel, onRename } = options
  const fileSystem = useFileSystem()

  const renamingItem = ref<number | null>(null)
  const renameInput = ref('')

  function startRename(id: number) {
    const item = desktopIcons.value.find(i => i.id === id)
    if (!item) return

    renamingItem.value = id
    renameInput.value = item.label

    nextTick(() => {
      requestAnimationFrame(() => {
        const input = options.getInputElement?.()
        input?.focus()
        input?.select()
      })
    })
  }

  function saveRename(id: number) {

    const newName = renameInput.value.trim()

    if (!newName) {
      return cancelRename()
    }

    const itemExists = desktopIcons.value.some(i => i.id === id)
    if (!itemExists) return

    desktopIcons.value = desktopIcons.value.map(icon =>
      icon.id === id
        ? {
            ...icon,
            label: newName,
            modifiedAt: new Date(),
          }
        : icon
    )

    fileSystem.renameItem(id, newName)
    saveToStorage()

    onRename?.(id, newName)

    renamingItem.value = null
  }

  function cancelRename() {
    renamingItem.value = null
    onCancel?.()
  }

  const isRenaming = computed(() => renamingItem.value !== null)

  return {
    renamingItem,
    renameInput,
    isRenaming,
    startRename,
    saveRename,
    cancelRename,
  }
}
