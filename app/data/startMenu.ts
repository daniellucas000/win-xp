import type { AppName } from '~/stores/windows';

export interface StartMenuApp {
  id: string;
  icon: string;
  label: string;
  app: AppName;
  bold?: boolean;
}

export const pinnedApps: StartMenuApp[] = [
  {
    id: 'ie',
    icon: '/images/xp/icons/iexplorer.webp',
    label: 'Internet Explorer',
    app: 'ie',
    bold: true,
  },
  {
    id: 'mediaplayer',
    icon: '/images/xp/icons/media-player.webp',
    label: 'Windows Media Player',
    app: 'mediaplayer',
  },
  {
    id: 'paint',
    icon: '/images/xp/icons/paint.webp',
    label: 'Paint',
    app: 'paint',
  },
];

export const rightApps: StartMenuApp[] = [
  {
    id: 'my-pictures',
    icon: '/images/xp/icons/my-pictures.webp',
    label: 'Minhas imagens',
    app: 'explorer',
    bold: true,
  },
  {
    id: 'my-musics',
    icon: '/images/xp/icons/my-musics.webp',
    label: 'Minhas músicas',
    app: 'mediaplayer',
    bold: true,
  },
  {
    id: 'my-computer',
    icon: '/images/xp/icons/mycomputer.webp',
    label: 'Meu computador',
    app: 'explorer',
    bold: true,
  },
];

export const allPrograms: StartMenuApp[] = [
  {
    id: 'paint-program',
    icon: '/images/xp/icons/paint.webp',
    label: 'Paint',
    app: 'paint',
  },
  {
    id: 'notepad',
    icon: '/images/xp/icons/notepad.webp',
    label: 'Bloco de notas',
    app: 'notepad',
  },
  {
    id: 'mediaplayer-program',
    icon: '/images/xp/icons/media-player.webp',
    label: 'Windows Media Player',
    app: 'mediaplayer',
  },
  {
    id: 'msn',
    icon: '/images/xp/icons/msn.webp',
    label: 'MSN Messenger',
    app: 'msn',
  },
];
