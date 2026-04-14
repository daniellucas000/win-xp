export function useExplorerSelection() {
  const selectedItem = ref<number | null>(null);
  const selectedItems = ref<Set<number>>(new Set());

  function selectItem(id: number, e?: MouseEvent) {
    if (e?.ctrlKey) {
      const set = new Set(selectedItems.value);
      set.has(id) ? set.delete(id) : set.add(id);
      selectedItems.value = set;
      selectedItem.value = id;
    } else {
      selectedItems.value = new Set();
      selectedItem.value = id;
    }
  }

  function clearSelection() {
    selectedItem.value = null;
    selectedItems.value = new Set();
  }

  const activeIds = computed(() =>
    selectedItems.value.size > 0
      ? [...selectedItems.value]
      : selectedItem.value !== null
        ? [selectedItem.value]
        : []
  );

  return { selectedItem, selectedItems, activeIds, selectItem, clearSelection };
}
