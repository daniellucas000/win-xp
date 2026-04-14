import { defaultFileSystem, getChildren, getItemById, type FileSystemItem } from '~/data/fileSystem'

const STORAGE_KEY = 'xp-file-system'

const FILE_ICONS: Record<string, string> = {
  txt:  '/images/xp/icons/file-text.png',
  jpg:  '/images/xp/icons/image-file.png',
  mp3:  '/images/xp/icons/audio-file.png',
  exe:  '/images/xp/icons/exe-file.png',
  html: '/images/xp/icons/html-file.png',
  doc:  '/images/xp/icons/doc-file.png',
}

const VALID_TYPES = new Set(['txt', 'jpg', 'mp3', 'exe', 'html', 'doc'])

function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}

function resolveFileType(ext: string): FileSystemItem['type'] {
  return (VALID_TYPES.has(ext) ? ext : 'txt') as FileSystemItem['type']
}

function parseStoredFileSystem(): FileSystemItem[] {
  if (typeof window === 'undefined') return [...defaultFileSystem]

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...defaultFileSystem]

    const userItems: FileSystemItem[] = JSON.parse(raw)
    const systemIds = new Set(
      defaultFileSystem.filter(i => i.isSystem).map(i => i.id)
    )

    const merged = [...defaultFileSystem]
    for (const user of userItems) {
      if (systemIds.has(user.id)) continue
      const existingIndex = merged.findIndex(i => i.id === user.id)
      if (existingIndex >= 0) {
        merged[existingIndex] = user
      } else {
        merged.push(user)
      }
    }
    return merged
  } catch {
    console.warn('[FileSystem] Falha ao carregar do localStorage')
    return [...defaultFileSystem]
  }
}

function persistFileSystem(items: FileSystemItem[]) {
  if (typeof window === 'undefined') return
  const userItems = items.filter(i => !i.isSystem)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userItems))
}

const items = ref<FileSystemItem[]>(parseStoredFileSystem())

export function useFileSystem() {
  function persist() {
    persistFileSystem(items.value)
  }

  function getChildrenOf(parentId: number | null): FileSystemItem[] {
    return getChildren(items.value, parentId === 0 ? null : parentId)
  }

  function getItem(id: number | null): FileSystemItem | undefined {
    return getItemById(items.value, id)
  }

  function createFolder(parentId: number | null, name: string): FileSystemItem {
    const folder: FileSystemItem = {
      id: generateId(),
      parentId,
      name,
      type: 'folder',
      icon: '/images/xp/icons/folder.png',
    }
    items.value = [...items.value, folder]
    persist()
    return folder
  }

  function createFile(parentId: number | null, name: string, content = ''): FileSystemItem {
    const ext = name.split('.').pop()?.toLowerCase() ?? ''
    const type = resolveFileType(ext)
    const file: FileSystemItem = {
      id: generateId(),
      parentId,
      name,
      type,
      icon: FILE_ICONS[type] ?? FILE_ICONS.txt,
      content: type === 'txt' ? content : undefined,
    }
    items.value = [...items.value, file]
    persist()
    return file
  }

  function renameItem(id: number, newName: string) {
    items.value = items.value.map(i =>
      i.id === id && !i.isSystem
        ? { ...i, name: newName }
        : i
    )
    persist()
  }

  function deleteItem(id: number) {
    const item = items.value.find(i => i.id === id)
    if (!item || item.isSystem) return

    const toDelete = new Set<number>([id])

    function collectDescendants(folderId: number) {
      for (const child of getChildren(items.value, folderId)) {
        toDelete.add(child.id)
        if (child.type === 'folder') collectDescendants(child.id)
      }
    }

    if (item.type === 'folder') collectDescendants(id)

    items.value = items.value.filter(i => !toDelete.has(i.id))
    persist()
  }

  function moveItem(id: number, newParentId: number | null) {
    items.value = items.value.map(i =>
      i.id === id && !i.isSystem
        ? { ...i, parentId: newParentId }
        : i
    )
    persist()
  }

  function updateContent(id: number, content: string) {
    items.value = items.value.map(i =>
      i.id === id && i.type === 'txt'
        ? { ...i, content }
        : i
    )
    persist()
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
  }
}