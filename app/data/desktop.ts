import type { AppName } from '~/stores/windows'

export interface DesktopIcon {
  id: number
  icon: string
  label: string
  app: AppName
  size: number
  type: string
  modifiedAt: Date
  isSystem: boolean
  isProtected?: boolean
  isDeleted?: boolean
}

export const systemIcons: DesktopIcon[] = [
  { id: 0, icon: '/images/xp/icons/folder.png', label: 'Meus Projetos', app: 'explorer', size: 0, type: 'folder', modifiedAt: new Date('2000-01-01'), isSystem: true, isProtected: true },
  { id: 1, icon: '/images/xp/icons/recycle-bin-empty.png', label: 'Lixeira', app: 'explorer', size: 0, type: 'trash', modifiedAt: new Date('2000-01-01'), isSystem: true, isProtected: true },
  { id: 2, icon: '/images/xp/icons/mycomputer.png', label: 'Meu computador', app: 'explorer', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
  { id: 3, icon: '/images/xp/icons/iexplorer.png', label: 'Internet Explorer', app: 'ie', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
  { id: 4, icon: '/images/xp/icons/msn.png', label: 'MSN Messenger', app: 'msn', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
  { id: 5, icon: '/images/xp/icons/notepad.png', label: 'Bloco de notas', app: 'notepad', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
  { id: 6, icon: '/images/xp/icons/paint.png', label: 'Paint', app: 'paint', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
  { id: 7, icon: '/images/xp/icons/minesweeper.png', label: 'Campo minado', app: 'minesweeper', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
  { id: 8, icon: '/images/xp/icons/media-player.png', label: 'Media Player', app: 'mediaplayer', size: 0, type: 'app', modifiedAt: new Date('2000-01-01'), isSystem: true },
]
