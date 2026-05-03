interface KeyboardDeps {
  isWindowFocused: Ref<boolean>;
  renamingItem: Ref<number | null>;
  isCreatingFolder: Ref<boolean>;
  isCreatingFile: Ref<boolean>;
  contextMenuOpen: Ref<boolean>;
  canGoUp: ComputedRef<boolean>;
  selectedItem: Ref<number | null>;
  deleteSelectedItems: () => void;
  startRename: (id: number) => void;
  cutItems: () => void;
  copyItems: () => void;
  pasteItems: () => void;
  goUp: () => void;
}

export function useExplorerKeyboard(deps: KeyboardDeps) {
  function handleKeydown(e: KeyboardEvent) {
    if (!deps.isWindowFocused.value) return;
    if (
      deps.renamingItem.value !== null ||
      deps.isCreatingFolder.value ||
      deps.isCreatingFile.value
    )
      return;

    if (e.key === 'Escape' && deps.contextMenuOpen.value) {
      deps.contextMenuOpen.value = false;
      return;
    }

    if (deps.contextMenuOpen.value) return;

    const ctrl = e.ctrlKey || e.metaKey;
    const map: Record<string, () => void> = {
      Delete: () => deps.deleteSelectedItems(),
      F2: () =>
        deps.selectedItem.value !== null &&
        deps.startRename(deps.selectedItem.value),
      Backspace: () => deps.canGoUp.value && deps.goUp(),
    };

    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
      return;
    }

    if (ctrl) {
      const ctrlMap: Record<string, () => void> = {
        x: deps.cutItems,
        c: deps.copyItems,
        v: deps.pasteItems,
      };
      const ctrlFn = ctrlMap[e.key];
      if (ctrlFn) {
        e.preventDefault();
        ctrlFn();
      }
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown));
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
}
