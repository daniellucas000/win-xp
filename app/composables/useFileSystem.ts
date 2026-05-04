import {
  defaultFileSystem,
  getChildren,
  getItemById,
  FileType,
  type FileSystemItem,
} from '~/data/fileSystem';

const STORAGE_KEY = 'xp-file-system';

const FILE_ICONS: Record<FileType, string> = {
  [FileType.Folder]: '/images/xp/icons/folder.webp',
  [FileType.Txt]: '/images/xp/icons/file-text.webp',
  [FileType.Jpg]: '/images/xp/icons/file-text.webp',
  [FileType.Mp3]: '/images/xp/icons/file-text.webp',
  [FileType.Exe]: '/images/xp/icons/file-text.webp',
  [FileType.Html]: '/images/xp/icons/file-text.webp',
  [FileType.Doc]: '/images/xp/icons/file-text.webp',
};

const VALID_TYPES = new Set(Object.keys(FILE_ICONS));

function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function resolveFileType(extension: string): FileType {
  return VALID_TYPES.has(extension) ? (extension as FileType) : FileType.Txt;
}

function loadFromStorage(): FileSystemItem[] {
  if (typeof window === 'undefined') return [...defaultFileSystem];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultFileSystem];

    const userItems: FileSystemItem[] = JSON.parse(raw);
    const systemIds = new Set(
      defaultFileSystem.filter((item) => item.isSystem).map((item) => item.id)
    );

    return mergeFileSystems(defaultFileSystem, userItems, systemIds);
  } catch {
    return [...defaultFileSystem];
  }
}

function mergeFileSystems(
  system: readonly FileSystemItem[],
  user: FileSystemItem[],
  systemIds: Set<number>
): FileSystemItem[] {
  const merged = [...system];

  for (const item of user) {
    if (systemIds.has(item.id)) continue;

    const existingIndex = merged.findIndex((i) => i.id === item.id);
    if (existingIndex >= 0) {
      merged[existingIndex] = item;
    } else {
      merged.push(item);
    }
  }

  return merged;
}

function saveToStorage(items: FileSystemItem[]): void {
  if (typeof window === 'undefined') return;

  const userItems = items.filter((item) => !item.isSystem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userItems));
}

function collectDescendants(
  items: FileSystemItem[],
  folderId: number
): Set<number> {
  const toDelete = new Set<number>([folderId]);

  function traverse(id: number): void {
    const children = getChildren(items, id);
    for (const child of children) {
      toDelete.add(child.id);
      if (child.type === FileType.Folder) traverse(child.id);
    }
  }

  traverse(folderId);
  return toDelete;
}

const items = ref<FileSystemItem[]>(loadFromStorage());

function persist(): void {
  saveToStorage(items.value);
}

export function useFileSystem() {
  function getChildrenOf(parentId: number | null): readonly FileSystemItem[] {
    const targetParent = parentId === 0 ? null : parentId;
    return getChildren(items.value, targetParent);
  }

  function getItem(id: number | null): FileSystemItem | undefined {
    return getItemById(items.value, id);
  }

  function createFolder(parentId: number | null, name: string): FileSystemItem {
    const folder: FileSystemItem = {
      id: generateId(),
      parentId,
      name,
      type: FileType.Folder,
      icon: '/images/xp/icons/folder.webp',
    };

    items.value = [...items.value, folder];
    persist();
    return folder;
  }

  function createFile(
    parentId: number | null,
    name: string,
    content = ''
  ): FileSystemItem {
    const extension = name.split('.').pop()?.toLowerCase() ?? '';
    const type = resolveFileType(extension);
    const icon = FILE_ICONS[type];

    const file: FileSystemItem = {
      id: generateId(),
      parentId,
      name,
      type,
      icon,
      content: type === FileType.Txt ? content : undefined,
    };

    items.value = [...items.value, file];
    persist();
    return file;
  }

  function renameItem(id: number, newName: string): void {
    items.value = items.value.map((item) =>
      item.id === id && !item.isSystem ? { ...item, name: newName } : item
    );
    persist();
  }

  function deleteItem(id: number): void {
    const item = items.value.find((i) => i.id === id);
    if (!item || item.isSystem) return;

    const toDelete = collectDescendants(items.value, id);
    items.value = items.value.filter((item) => !toDelete.has(item.id));
    persist();
  }

  function moveItem(id: number, newParentId: number | null): void {
    items.value = items.value.map((item) =>
      item.id === id && !item.isSystem
        ? { ...item, parentId: newParentId }
        : item
    );
    persist();
  }

  function updateContent(id: number, content: string): void {
    items.value = items.value.map((item) =>
      item.id === id && item.type === FileType.Txt ? { ...item, content } : item
    );
    persist();
  }

  return {
    items,
    getChildrenOf,
    getItem,
    createFolder,
    createFile,
    renameItem,
    deleteItem,
    moveItem,
    updateContent,
  };
}
