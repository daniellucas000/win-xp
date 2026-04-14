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
  myDocuments: '/images/xp/icons/my-documents.png',
  sharedDocuments: '/images/xp/icons/shared-documents.png',
  programFiles: '/images/xp/icons/program-files.png',
  windows: '/images/xp/icons/windows.png',
  fileText: '/images/xp/icons/file-text.png',
  myPictures: '/images/xp/icons/my-pictures.png',
  myMusics: '/images/xp/icons/my-musics.png',
  myVideos: '/images/xp/icons/my-videos.png',
  imageFile: '/images/xp/icons/image-file.png',
  audioFile: '/images/xp/icons/audio-file.png',
  sharedPictures: '/images/xp/icons/shared-pictures.png',
  sharedMusic: '/images/xp/icons/shared-music.png',
  iexplorer: '/images/xp/icons/iexplorer.png',
  mediaPlayer: '/images/xp/icons/media-player.png',
  msn: '/images/xp/icons/msn.png',
  movieMaker: '/images/xp/icons/movie-maker.png',
  system32: '/images/xp/icons/system32.png',
  explorer: '/images/xp/icons/explorer-icon.png',
  notepad: '/images/xp/icons/notepad.png',
  cmd: '/images/xp/icons/cmd.png',
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
    id: 2,
    parentId: null,
    name: 'Documentos Compartilhados',
    type: FileType.Folder,
    icon: ICONS.sharedDocuments,
    isSystem: true,
  },
  {
    id: 3,
    parentId: null,
    name: 'Arquivos de Programas',
    type: FileType.Folder,
    icon: ICONS.programFiles,
    isSystem: true,
  },
  {
    id: 4,
    parentId: null,
    name: 'Windows',
    type: FileType.Folder,
    icon: ICONS.windows,
    isSystem: true,
  },
  {
    id: 5,
    parentId: null,
    name: 'portfolio.txt',
    type: FileType.Txt,
    icon: ICONS.fileText,
    content: [
      'Sobre Mim',
      '=========',
      '',
      '[NOME] - [PROFISSÃO]',
      '[CIDADE], Brasil',
      '',
      '[SUA BIO AQUI]',
      '',
      'Contato',
      '-------',
      'Email: [seu-email@exemplo.com]',
      'GitHub: [github.com/seu-usuario]',
      'LinkedIn: [linkedin.com/in/seu-usuario]',
      '',
      'Habilidades',
      '----------',
      'Frontend: Vue.js, Nuxt, TypeScript, SCSS, Pinia, VueUse',
      'Backend: Node.js, Express, PostgreSQL, MongoDB',
      'Tools: Git, Docker, Linux, Figma',
      '',
      'Projetos',
      '--------',
      '[ Adicione seus projetos aqui ]',
      '',
      'Experiência',
      '-----------',
      '[ Adicione sua experiência aqui ]',
      '',
      'Formação',
      '--------',
      '[ Adicione sua formação aqui ]',
    ].join('\n'),
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
    id: 12,
    parentId: 1,
    name: 'Meus Vídeos',
    type: FileType.Folder,
    icon: ICONS.myVideos,
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
    id: 20,
    parentId: 10,
    name: 'foto-ferias.jpg',
    type: FileType.Jpg,
    icon: ICONS.imageFile,
  },
  {
    id: 21,
    parentId: 10,
    name: 'aniversario.jpg',
    type: FileType.Jpg,
    icon: ICONS.imageFile,
  },

  {
    id: 30,
    parentId: 11,
    name: 'musica-favorita.mp3',
    type: FileType.Mp3,
    icon: ICONS.audioFile,
  },

  {
    id: 40,
    parentId: 2,
    name: 'Imagens Compartilhadas',
    type: FileType.Folder,
    icon: ICONS.sharedPictures,
    isSystem: true,
  },
  {
    id: 41,
    parentId: 2,
    name: 'Músicas Compartilhadas',
    type: FileType.Folder,
    icon: ICONS.sharedMusic,
    isSystem: true,
  },
  {
    id: 42,
    parentId: 2,
    name: 'notas.txt',
    type: FileType.Txt,
    icon: ICONS.fileText,
    content: 'Notas compartilhadas entre usuários.',
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
    id: 53,
    parentId: 3,
    name: 'Movie Maker',
    type: FileType.Folder,
    icon: ICONS.movieMaker,
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
    id: 70,
    parentId: 4,
    name: 'system32',
    type: FileType.Folder,
    icon: ICONS.system32,
    isSystem: true,
  },
  {
    id: 71,
    parentId: 4,
    name: 'explorer.exe',
    type: FileType.Exe,
    icon: ICONS.explorer,
    isSystem: true,
  },
  {
    id: 72,
    parentId: 4,
    name: 'notepad.exe',
    type: FileType.Exe,
    icon: ICONS.notepad,
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

  {
    id: 80,
    parentId: 70,
    name: 'cmd.exe',
    type: FileType.Exe,
    icon: ICONS.cmd,
    isSystem: true,
  },
  {
    id: 81,
    parentId: 70,
    name: 'notepad.exe',
    type: FileType.Exe,
    icon: ICONS.notepad,
    isSystem: true,
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
