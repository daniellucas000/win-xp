export type FileType = 'folder' | 'txt' | 'jpg' | 'mp3' | 'exe' | 'html' | 'doc'

export interface FileSystemItem {
  id: number
  parentId: number | null
  name: string
  type: FileType
  icon: string
  size?: string
  modified: string
  content?: string
  isSystem?: boolean
}

export const defaultFileSystem: FileSystemItem[] = [
  // C:\ root items
  { id: 1, parentId: null, name: 'Meus Documentos', type: 'folder', icon: '/images/xp/icons/my-documents.png', modified: '2001-08-23', isSystem: true },
  { id: 2, parentId: null, name: 'Documentos Compartilhados', type: 'folder', icon: '/images/xp/icons/shared-documents.png', modified: '2001-08-23', isSystem: true },
  { id: 3, parentId: null, name: 'Arquivos de Programas', type: 'folder', icon: '/images/xp/icons/program-files.png', modified: '2001-08-23', isSystem: true },
  { id: 4, parentId: null, name: 'Windows', type: 'folder', icon: '/images/xp/icons/windows.png', modified: '2001-08-23', isSystem: true },
  { id: 5, parentId: null, name: 'portfolio.txt', type: 'txt', icon: '/images/xp/icons/file-text.png', size: '3.2 KB', modified: '2024-01-15', content: `Sobre Mim\n=========\n\n[NOME] - [PROFISSÃO]\n[CIDADE], Brasil\n\n[SUA BIO AQUI]\n\nContato\n-------\nEmail: [seu-email@exemplo.com]\nGitHub: [github.com/seu-usuario]\nLinkedIn: [linkedin.com/in/seu-usuario]\n\nHabilidades\n----------\nFrontend: Vue.js, Nuxt, TypeScript, SCSS, Pinia, VueUse\nBackend: Node.js, Express, PostgreSQL, MongoDB\nTools: Git, Docker, Linux, Figma\n\nProjetos\n--------\n[ Adicione seus projetos aqui ]\n\nExperiência\n-----------\n[ Adicione sua experiência aqui ]\n\nFormação\n--------\n[ Adicione sua formação aqui ]` },

  // Meus Documentos (id: 1)
  { id: 10, parentId: 1, name: 'Minhas Imagens', type: 'folder', icon: '/images/xp/icons/my-pictures.png', modified: '2001-08-23', isSystem: true },
  { id: 11, parentId: 1, name: 'Minhas Músicas', type: 'folder', icon: '/images/xp/icons/my-musics.png', modified: '2001-08-23', isSystem: true },
  { id: 12, parentId: 1, name: 'Meus Vídeos', type: 'folder', icon: '/images/xp/icons/my-videos.png', modified: '2001-08-23', isSystem: true },
  { id: 13, parentId: 1, name: 'readme.txt', type: 'txt', icon: '/images/xp/icons/file-text.png', size: '1.2 KB', modified: '2024-01-10', content: 'Esta é a pasta Meus Documentos.\n\nAqui ficam seus arquivos pessoais.' },

  // Minhas Imagens (id: 10)
  { id: 20, parentId: 10, name: 'foto-ferias.jpg', type: 'jpg', icon: '/images/xp/icons/image-file.png', size: '2.4 MB', modified: '2023-07-15' },
  { id: 21, parentId: 10, name: 'aniversario.jpg', type: 'jpg', icon: '/images/xp/icons/image-file.png', size: '1.8 MB', modified: '2023-03-20' },

  // Minhas Músicas (id: 11)
  { id: 30, parentId: 11, name: 'musica-favorita.mp3', type: 'mp3', icon: '/images/xp/icons/audio-file.png', size: '4.5 MB', modified: '2023-05-10' },

  // Documentos Compartilhados (id: 2)
  { id: 40, parentId: 2, name: 'Imagens Compartilhadas', type: 'folder', icon: '/images/xp/icons/shared-pictures.png', modified: '2001-08-23', isSystem: true },
  { id: 41, parentId: 2, name: 'Músicas Compartilhadas', type: 'folder', icon: '/images/xp/icons/shared-music.png', modified: '2001-08-23', isSystem: true },
  { id: 42, parentId: 2, name: 'notas.txt', type: 'txt', icon: '/images/xp/icons/file-text.png', size: '0.5 KB', modified: '2024-02-01', content: 'Notas compartilhadas entre usuários.' },

  // Arquivos de Programas (id: 3)
  { id: 50, parentId: 3, name: 'Internet Explorer', type: 'folder', icon: '/images/xp/icons/iexplorer.png', modified: '2001-08-23', isSystem: true },
  { id: 51, parentId: 3, name: 'Windows Media Player', type: 'folder', icon: '/images/xp/icons/media-player.png', modified: '2001-08-23', isSystem: true },
  { id: 52, parentId: 3, name: 'Messenger', type: 'folder', icon: '/images/xp/icons/msn.png', modified: '2001-08-23', isSystem: true },
  { id: 53, parentId: 3, name: 'Movie Maker', type: 'folder', icon: '/images/xp/icons/movie-maker.png', modified: '2001-08-23', isSystem: true },

  // Internet Explorer (id: 50)
  { id: 60, parentId: 50, name: 'iexplore.exe', type: 'exe', icon: '/images/xp/icons/iexplorer.png', size: '88 KB', modified: '2001-08-23', isSystem: true },

  // Windows (id: 4)
  { id: 70, parentId: 4, name: 'system32', type: 'folder', icon: '/images/xp/icons/system32.png', modified: '2001-08-23', isSystem: true },
  { id: 71, parentId: 4, name: 'explorer.exe', type: 'exe', icon: '/images/xp/icons/explorer-icon.png', size: '1.0 MB', modified: '2001-08-23', isSystem: true },
  { id: 72, parentId: 4, name: 'notepad.exe', type: 'exe', icon: '/images/xp/icons/notepad.png', size: '67 KB', modified: '2001-08-23', isSystem: true },
  { id: 73, parentId: 4, name: 'win.ini', type: 'txt', icon: '/images/xp/icons/file-text.png', size: '0.3 KB', modified: '2001-08-23', content: '; for 16-bit app support\n[extensions]\n[fonts]\n[MCI Extensions.BAK]\n[files]\n[MCI]', isSystem: true },

  // system32 (id: 70)
  { id: 80, parentId: 70, name: 'cmd.exe', type: 'exe', icon: '/images/xp/icons/cmd.png', size: '264 KB', modified: '2001-08-23', isSystem: true },
  { id: 81, parentId: 70, name: 'notepad.exe', type: 'exe', icon: '/images/xp/icons/notepad.png', size: '67 KB', modified: '2001-08-23', isSystem: true },
]

export function getChildren(items: FileSystemItem[], parentId: number | null): FileSystemItem[] {
  return items.filter(item => item.parentId === parentId)
}

export function getItemById(items: FileSystemItem[], id: number | null): FileSystemItem | undefined {
  if (id === null) return undefined
  return items.find(item => item.id === id)
}

export function getAllDescendants(items: FileSystemItem[], folderId: number): FileSystemItem[] {
  const children = getChildren(items, folderId)
  let result = [...children]
  for (const child of children) {
    if (child.type === 'folder') {
      result = result.concat(getAllDescendants(items, child.id))
    }
  }
  return result
}

export function getFolderSize(items: FileSystemItem[], folderId: number): string {
  const descendants = getAllDescendants(items, folderId)
  const fileCount = descendants.filter(i => i.type !== 'folder').length
  const folderCount = descendants.filter(i => i.type === 'folder').length
  if (fileCount === 0 && folderCount === 0) return 'Pasta vazia'
  const parts = []
  if (folderCount > 0) parts.push(`${folderCount} pasta(s)`)
  if (fileCount > 0) parts.push(`${fileCount} arquivo(s)`)
  return parts.join(', ')
}
