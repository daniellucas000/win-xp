import type { AppName } from '~/stores/windows'

export interface StartMenuApp {
  icon: string
  label: string
  app: AppName
  bold?: boolean
}

export const pinnedApps: StartMenuApp[] = [
  { icon: '/images/xp/icons/iexplorer.png', label: 'Internet Explorer',  app: 'ie',          bold: true },
  { icon: '/images/xp/icons/media-player.png', label: 'Windows Media Player', app: 'mediaplayer' },
  { icon: '/images/xp/icons/paint.png', label: 'Paint', app: 'paint' },
]

export const rightApps: StartMenuApp[] = [
  { icon: '/images/xp/icons/my-pictures.png', label: 'Minhas imagens', app: 'explorer', bold: true },
  { icon: '/images/xp/icons/my-musics.png', label: 'Minhas músicas', app: 'mediaplayer', bold: true },
  { icon: '/images/xp/icons/mycomputer.png', label: 'Meu computador', app: 'explorer', bold: true },
]

export const allPrograms: StartMenuApp[] = [
  { icon: '/images/xp/icons/paint.png', label: 'Paint', app: 'paint' },
  { icon: '/images/xp/icons/notepad.png', label: 'Bloco de notas', app: 'notepad' },
  { icon: '/images/xp/icons/media-player.png', label: 'Windows Media Player', app: 'mediaplayer' },
  { icon: '/images/xp/icons/msn.png', label: 'MSN Messenger', app: 'msn' },
]
