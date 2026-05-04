export const enum FileType {
  Folder = 'folder',
  Txt = 'txt',
  Jpg = 'jpg',
  Mp3 = 'mp3',
  Exe = 'exe',
  Html = 'html',
  Doc = 'doc',
}

export interface FileSystemItem {
  readonly id: number;
  readonly parentId: number | null;
  readonly name: string;
  readonly type: FileType;
  readonly icon?: string;
  readonly content?: string;
  readonly isSystem?: boolean;
}

const ICONS = {
  myDocuments: '/images/xp/icons/my-documents.webp',
  fileText: '/images/xp/icons/file-text.webp',
  myPictures: '/images/xp/icons/my-pictures.webp',
  myMusics: '/images/xp/icons/my-musics.webp',
  iexplorer: '/images/xp/icons/iexplorer.webp',
  mediaPlayer: '/images/xp/icons/media-player.webp',
  msn: '/images/xp/icons/msn.webp',
} as const;

export const defaultFileSystem: readonly FileSystemItem[] = Object.freeze([
  {
    id: 1,
    parentId: null,
    name: 'Meus Documentos',
    type: FileType.Folder,
    icon: ICONS.myDocuments,
    isSystem: true,
  },
  {
    id: 10,
    parentId: 1,
    name: 'Minhas Imagens',
    type: FileType.Folder,
    icon: ICONS.myPictures,
    isSystem: true,
  },
  {
    id: 11,
    parentId: 1,
    name: 'Minhas Músicas',
    type: FileType.Folder,
    icon: ICONS.myMusics,
    isSystem: true,
  },
  {
    id: 13,
    parentId: 1,
    name: 'readme.txt',
    type: FileType.Txt,
    icon: ICONS.fileText,
    content:
      'Esta é a pasta Meus Documentos.\n\nAqui ficam seus arquivos pessoais.',
  },
  {
    id: 50,
    parentId: 3,
    name: 'Internet Explorer',
    type: FileType.Folder,
    icon: ICONS.iexplorer,
    isSystem: true,
  },
  {
    id: 51,
    parentId: 3,
    name: 'Windows Media Player',
    type: FileType.Folder,
    icon: ICONS.mediaPlayer,
    isSystem: true,
  },
  {
    id: 52,
    parentId: 3,
    name: 'Messenger',
    type: FileType.Folder,
    icon: ICONS.msn,
    isSystem: true,
  },
  {
    id: 60,
    parentId: 50,
    name: 'iexplore.exe',
    type: FileType.Exe,
    icon: ICONS.iexplorer,
    isSystem: true,
  },
  {
    id: 73,
    parentId: 4,
    name: 'win.ini',
    type: FileType.Txt,
    icon: ICONS.fileText,
    isSystem: true,
    content:
      '; for 16-bit app support\n[extensions]\n[fonts]\n[MCI Extensions.BAK]\n[files]\n[MCI]',
  },
]);
export interface FileSystemIndexes {
  readonly byId: ReadonlyMap<number, FileSystemItem>;
  readonly byParentId: ReadonlyMap<number | null, readonly FileSystemItem[]>;
}

export function buildIndexes(
  items: readonly FileSystemItem[]
): FileSystemIndexes {
  const byId = new Map<number, FileSystemItem>();
  const byParentId = new Map<number | null, FileSystemItem[]>();

  for (const item of items) {
    byId.set(item.id, item);

    const siblings = byParentId.get(item.parentId) ?? [];
    if (siblings.length === 0) byParentId.set(item.parentId, siblings);
    siblings.push(item);
  }

  return { byId, byParentId };
}

export function getChildren(
  items: readonly FileSystemItem[],
  parentId: number | null
): readonly FileSystemItem[] {
  return items.filter((item) => item.parentId === parentId);
}

export function getItemById(
  items: readonly FileSystemItem[],
  id: number | null
): FileSystemItem | undefined {
  if (id === null) return undefined;
  return items.find((item) => item.id === id);
}

export function getAllDescendants(
  items: readonly FileSystemItem[],
  folderId: number
): readonly FileSystemItem[] {
  const result: FileSystemItem[] = [];
  const stack = [folderId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const children = items.filter((i) => i.parentId === currentId);

    for (const child of children) {
      result.push(child);
      if (child.type === FileType.Folder) stack.push(child.id);
    }
  }

  return result;
}

export function getChildrenFast(
  indexes: FileSystemIndexes,
  parentId: number | null
): readonly FileSystemItem[] {
  return indexes.byParentId.get(parentId) ?? [];
}

export function getItemByIdFast(
  indexes: FileSystemIndexes,
  id: number | null
): FileSystemItem | undefined {
  if (id === null) return undefined;
  return indexes.byId.get(id);
}

export function getAllDescendantsFast(
  indexes: FileSystemIndexes,
  folderId: number
): readonly FileSystemItem[] {
  const result: FileSystemItem[] = [];
  const stack = [folderId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const children = getChildrenFast(indexes, currentId);

    for (const child of children) {
      result.push(child);
      if (child.type === FileType.Folder) stack.push(child.id);
    }
  }

  return result;
}
