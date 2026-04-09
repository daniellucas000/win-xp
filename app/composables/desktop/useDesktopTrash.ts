import { useNotificationsStore } from '~/stores/notifications'
import { useDesktopIcons } from './useDesktopIcons'
import { useFileSystem } from '~/composables/useFileSystem'

interface UseDesktopTrashOptions {
  desktopIcons: ReturnType<typeof useDesktopIcons>['desktopIcons']
  saveToStorage: () => void
  selectedIcons: Ref<Set<number>>
  playNotification: () => void
  notifStore: ReturnType<typeof useNotificationsStore>
}

export function useDesktopTrash(options: UseDesktopTrashOptions) {
  const { desktopIcons, saveToStorage, selectedIcons, playNotification, notifStore } = options
  const fileSystem = useFileSystem()

  function deleteIcon(id: number) {
    const item = desktopIcons.value.find(i => i.id === id)
    if (!item || item.isSystem || item.isProtected) return

    desktopIcons.value = desktopIcons.value.map(i =>
      i.id === id ? { ...i, isDeleted: true, modifiedAt: new Date() } : i
    )

    fileSystem.deleteItem(id)
    selectedIcons.value.delete(id)
    saveToStorage()
  }

  function deleteSelectedIcons() {
    const toDelete = [...selectedIcons.value]
    if (toDelete.length === 0) return

    for (const id of toDelete) {
      deleteIcon(id)
    }

    playNotification()
    notifStore.show(
      'Lixeira',
      `${toDelete.length} item(ns) movido(s) para a Lixeira.`,
      { icon: 'info' }
    )
  }

  function restoreFromTrash(id: number) {
    const item = desktopIcons.value.find(i => i.id === id)
    if (!item?.isDeleted) return

    desktopIcons.value = desktopIcons.value.map(i =>
      i.id === id ? { ...i, isDeleted: false, modifiedAt: new Date() } : i
    )

    saveToStorage()
  }

  function emptyTrash() {
    desktopIcons.value = desktopIcons.value.filter(icon => !icon.isDeleted)
    saveToStorage()
  }

  return {
    deleteIcon,
    deleteSelectedIcons,
    restoreFromTrash,
    emptyTrash,
  }
}