import { defaultFileSystem, getChildren, getItemById, type FileSystemItem } from '~/data/fileSystem'

const STORAGE_KEY = 'xp-file-system'

function loadFileSystem(): FileSystemItem[] {
  if (typeof window === 'undefined') return [...defaultFileSystem]
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const userItems: FileSystemItem[] = JSON.parse(saved)
      const systemIds = new Set(defaultFileSystem.filter(i => i.isSystem).map(i => i.id))
      const merged = [...defaultFileSystem]
      for (const user of userItems) {
        if (!systemIds.has(user.id)) {
          const existing = merged.findIndex(i => i.id === user.id)
          if (existing >= 0) {
            merged[existing] = user
          } else {
            merged.push(user)
          }
        }
      }
      return merged
    } catch {
      return [...defaultFileSystem]
    }
  }
  return [...defaultFileSystem]
}

function saveFileSystem(items: FileSystemItem[]) {
  if (typeof window === 'undefined') return
  const userItems = items.filter(i => !i.isSystem)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userItems))
}

export function useFileSystem() {
  const items = ref<FileSystemItem[]>(loadFileSystem())

  function persist() {
    saveFileSystem(items.value)
  }

  function getChildrenOf(parentId: number | null) {
    // Treat 0 as desktop root (virtual — maps to parentId: null)
    return getChildren(items.value, parentId === 0 ? null : parentId)
  }

  function getItem(id: number | null) {
    return getItemById(items.value, id)
  }

  function createFolder(parentId: number | null, name: string): FileSystemItem {
    const folder: FileSystemItem = {
      id: Date.now(),
      parentId,
      name,
      type: 'folder',
      icon: '/images/xp/icons/folder.png',
      modified: new Date().toISOString().split('T')[0]!,
    }
    items.value.push(folder)
    persist()
    return folder
  }

  function createFile(parentId: number | null, name: string, content = ''): FileSystemItem {
    const ext = name.split('.').pop()?.toLowerCase() || ''
    const fileType = (ext === 'txt' ? 'txt' : ext === 'jpg' ? 'jpg' : ext === 'mp3' ? 'mp3' : ext === 'exe' ? 'exe' : ext === 'html' ? 'html' : ext === 'doc' ? 'doc' : 'txt') as FileSystemItem['type']
    const iconMap: Record<string, string> = {
      txt: '/images/xp/icons/file-text.png',
      jpg: '/images/xp/icons/image-file.png',
      mp3: '/images/xp/icons/audio-file.png',
      exe: '/images/xp/icons/exe-file.png',
      html: '/images/xp/icons/html-file.png',
      doc: '/images/xp/icons/doc-file.png',
    }
    const file: FileSystemItem = {
      id: Date.now(),
      parentId,
      name,
      type: fileType,
      icon: iconMap[fileType] || '/images/xp/icons/file-text.png',
      size: `${new Blob([content]).size} B`,
      modified: new Date().toISOString().split('T')[0]!,
      content: fileType === 'txt' ? content : undefined,
    }
    items.value.push(file)
    persist()
    return file
  }

  function renameItem(id: number, newName: string) {
    const item = items.value.find(i => i.id === id)
    if (item && !item.isSystem) {
      item.name = newName
      item.modified = new Date().toISOString().split('T')[0]!
      persist()
    }
  }

  function deleteItem(id: number) {
    const item = items.value.find(i => i.id === id)
    if (!item || item.isSystem) return

    const toDelete = new Set<number>()
    function collectDescendants(folderId: number) {
      const children = getChildren(items.value, folderId)
      for (const child of children) {
        toDelete.add(child.id)
        if (child.type === 'folder') collectDescendants(child.id)
      }
    }

    toDelete.add(id)
    if (item.type === 'folder') collectDescendants(id)

    items.value = items.value.filter(i => !toDelete.has(i.id))
    persist()
  }

  function moveItem(id: number, newParentId: number | null) {
    const item = items.value.find(i => i.id === id)
    if (item && !item.isSystem) {
      item.parentId = newParentId
      persist()
    }
  }

  function updateContent(id: number, content: string) {
    const item = items.value.find(i => i.id === id)
    if (item && item.type === 'txt') {
      item.content = content
      item.size = `${new Blob([content]).size} B`
      item.modified = new Date().toISOString().split('T')[0]!
      persist()
    }
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
