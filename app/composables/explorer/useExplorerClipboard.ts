import type { FileSystemItem } from '~/data/fileSystem';
import { useSounds } from '~/composables/useSounds';

interface ClipboardState {
  mode: 'cut' | 'copy';
  ids: number[];
}

export function useExplorerClipboard(
  fileSystem: ReturnType<typeof useFileSystem>,
  activeIds: ComputedRef<number[]>
) {
  const { playClick } = useSounds();
  const clipboard = ref<ClipboardState | null>(null);

  function cutItems() {
    if (activeIds.value.length === 0) return;
    clipboard.value = { mode: 'cut', ids: [...activeIds.value] };
    playClick();
  }

  function copyItems() {
    if (activeIds.value.length === 0) return;
    clipboard.value = { mode: 'copy', ids: [...activeIds.value] };
    playClick();
  }

  function pasteItems(currentFolderId: number | null) {
    if (!clipboard.value || currentFolderId === null) return;
    for (const id of clipboard.value.ids) {
      const item = fileSystem.getItem(id);
      if (!item) continue;
      if (clipboard.value.mode === 'cut') {
        if (item.parentId !== currentFolderId)
          fileSystem.moveItem(id, currentFolderId);
      } else {
        const copy: FileSystemItem = {
          ...item,
          id: Date.now() + Math.random(),
          parentId: currentFolderId,
          name: `Cópia de ${item.name}`,
        };
        fileSystem.items.value.push(copy);
      }
    }
    if (clipboard.value.mode === 'cut') clipboard.value = null;
    playClick();
  }

  return { clipboard, cutItems, copyItems, pasteItems };
}
