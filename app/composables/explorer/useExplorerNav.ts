import { useSounds } from '~/composables/useSounds';

export function useExplorerNav(
  initialFolderId: Ref<number | null>,
  isTrashMode: ComputedRef<boolean>
) {
  const { playOpen } = useSounds();

  const currentFolderId = ref<number | null>(initialFolderId.value);
  const history = ref<(number | null)[]>([initialFolderId.value]);
  const historyIndex = ref(0);

  const canGoBack = computed(
    () => historyIndex.value > 0 && !isTrashMode.value
  );
  const canGoForward = computed(
    () => historyIndex.value < history.value.length - 1 && !isTrashMode.value
  );
  const canGoUp = computed(
    () => currentFolderId.value !== null && !isTrashMode.value
  );

  function navigateTo(folderId: number | null) {
    playOpen();
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }
    history.value.push(folderId);
    historyIndex.value++;
    currentFolderId.value = folderId;
  }

  function goBack() {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      currentFolderId.value = history.value[historyIndex.value] ?? null;
    }
  }

  function goForward() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      currentFolderId.value = history.value[historyIndex.value] ?? null;
    }
  }

  function goUp(getItem: (id: number | null) => any) {
    if (currentFolderId.value === null) return;
    const item = getItem(currentFolderId.value);
    if (item) navigateTo(item.parentId);
  }

  function reset(folderId: number | null) {
    currentFolderId.value = folderId;
    history.value = [folderId];
    historyIndex.value = 0;
  }

  return {
    currentFolderId,
    canGoBack,
    canGoForward,
    canGoUp,
    navigateTo,
    goBack,
    goForward,
    goUp,
    reset,
  };
}
