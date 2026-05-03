import type { FileSystemItem } from '~/data/fileSystem';
import { FileType } from '~/data/fileSystem';
import { STORAGE_KEYS } from '~/constants/storage';
import { FILE_TYPE_LABELS } from '~/constants/explorer';

type SortColumn = 'name' | 'type';

const DRIVES: FileSystemItem[] = [
  {
    id: -1,
    parentId: null,
    name: 'Disco Local (C:)',
    type: FileType.Folder,
    icon: '/images/xp/icons/hd-drive.png',
  },
  {
    id: -2,
    parentId: null,
    name: 'Disco Local (D:)',
    type: FileType.Folder,
    icon: '/images/xp/icons/hd-drive.png',
  },
  {
    id: -3,
    parentId: null,
    name: 'DVD Drive (E:)',
    type: FileType.Folder,
    icon: '/images/xp/icons/dvd-drive.png',
  },
];

function fileTypeLabel(type: string) {
  return FILE_TYPE_LABELS[type as FileType] ?? 'Arquivo';
}

export function useExplorerItems(
  currentFolderId: Ref<number | null>,
  isTrashMode: ComputedRef<boolean>,
  fileSystem: ReturnType<typeof useFileSystem>
) {
  const sortColumn = ref<SortColumn>('name');
  const sortAsc = ref(true);
  const trashItems = ref<FileSystemItem[]>([]);

  const breadcrumbs = computed(() => {
    if (isTrashMode.value) return [{ name: 'Lixeira' }];
    if (currentFolderId.value === null) return [{ name: 'Meu Computador' }];

    const root = [{ name: 'C:' }, { name: 'daniel' }];
    const path: { name: string }[] = [];
    let current = fileSystem.getItem(currentFolderId.value);
    let iterations = 0;

    while (current && iterations++ < 50) {
      path.push({ name: current.name });
      if (current.parentId === null) break;
      current = fileSystem.getItem(current.parentId);
    }

    return [...root, ...path.reverse()];
  });

  const currentPathText = computed(() =>
    breadcrumbs.value.map((p) => p.name).join('/')
  );

  const currentPathIcon = computed(() => {
    if (isTrashMode.value) return '/images/xp/icons/recycle-bin-empty.png';
    if (currentFolderId.value === null)
      return '/images/xp/icons/mycomputer.png';
    return (
      fileSystem.getItem(currentFolderId.value)?.icon ??
      '/images/xp/icons/folder.png'
    );
  });

  const rawItems = computed(() => {
    if (isTrashMode.value) return trashItems.value;
    if (currentFolderId.value === null) return DRIVES;
    return fileSystem.getChildrenOf(currentFolderId.value);
  });

  const sortedItems = computed(() => {
    const items = [...rawItems.value];
    items.sort((a, b) => {
      if (a.type === FileType.Folder && b.type !== FileType.Folder) return -1;
      if (a.type !== FileType.Folder && b.type === FileType.Folder) return 1;
      const key = sortColumn.value;
      if (key === 'name') {
        const cmp = (a.name || '').localeCompare(b.name || '');
        return sortAsc.value ? cmp : -cmp;
      }
      if (key === 'type') {
        const cmp = (a.type || '').localeCompare(b.type || '');
        return sortAsc.value ? cmp : -cmp;
      }
      return 0;
    });
    return items;
  });

  function handleSort(col: SortColumn) {
    sortColumn.value === col
      ? (sortAsc.value = !sortAsc.value)
      : ((sortColumn.value = col), (sortAsc.value = true));
  }

  function sortIcon(col: string) {
    if (sortColumn.value !== col) return '';
    return sortAsc.value ? ' ▲' : ' ▼';
  }

  function loadTrashItems() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEYS.TRASH);
    if (!saved) return;
    try {
      trashItems.value = JSON.parse(saved).map((item: any) => ({
        id: item.id || Date.now(),
        parentId: null,
        name: item.label || item.name,
        type: item.type === 'folder' ? FileType.Folder : FileType.Txt,
        icon: item.icon || '/images/xp/icons/file-text.png',
        content: item.content,
      }));
    } catch {
      trashItems.value = [];
    }
  }

  return {
    sortColumn,
    sortAsc,
    trashItems,
    breadcrumbs,
    currentPathText,
    currentPathIcon,
    sortedItems,
    handleSort,
    sortIcon,
    loadTrashItems,
    fileTypeLabel,
  };
}
