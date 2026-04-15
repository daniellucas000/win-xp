import type { DesktopIcon } from '~/data/desktop'

interface UseDesktopShortcutsOptions {
  selectedIcons: Ref<Set<number>>
  focusedIconIndex: Ref<number | null>
  visibleIcons: ComputedRef<DesktopIcon[]>
  deleteIcon: (id: number) => void
  playNotification: () => void
}

export function useDesktopShortcuts(options: UseDesktopShortcutsOptions) {
  const {
    selectedIcons,
    focusedIconIndex,
    visibleIcons,
    deleteIcon,
    playNotification,
  } = options

  function deleteSelected() {
    const toDelete = [...selectedIcons.value]
    for (const id of toDelete) {
      deleteIcon(id)
    }
    playNotification()
  }

  function deleteFocused() {
    const icon = focusedIconIndex.value !== null
      ? visibleIcons.value[focusedIconIndex.value]
      : null

    if (!icon || icon.isSystem || icon.isProtected) return

    deleteIcon(icon.id)
    playNotification()
  }

  function handleGlobalKeydown(e: KeyboardEvent) {
    if (e.key === 'Delete') {
      if (selectedIcons.value.size > 0) {
        deleteSelected()
      } else {
        deleteFocused()
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown)
  })

  return {}
}
