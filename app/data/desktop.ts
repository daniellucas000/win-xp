import type { AppName } from '~/stores/windows';

export interface DesktopIcon {
  id: number;
  icon: string;
  label: string;
  app: AppName;
  type: string;
  isSystem: boolean;
  isProtected?: boolean;
  isDeleted?: boolean;
}

export const systemIcons: DesktopIcon[] = [
  {
    id: -1,
    icon: '/images/xp/icons/recycle-bin-empty.png',
    label: 'Lixeira',
    app: 'explorer',
    type: 'trash',
    isSystem: true,
    isProtected: true,
  },
  {
    id: 2,
    icon: '/images/xp/icons/mycomputer.png',
    label: 'Meu computador',
    app: 'explorer',
    type: 'app',
    isSystem: true,
  },
  {
    id: 3,
    icon: '/images/xp/icons/iexplorer.png',
    label: 'Internet Explorer',
    app: 'ie',
    type: 'app',
    isSystem: true,
  },
  {
    id: 4,
    icon: '/images/xp/icons/msn.png',
    label: 'MSN Messenger',
    app: 'msn',
    type: 'app',
    isSystem: true,
  },
  {
    id: 5,
    icon: '/images/xp/icons/notepad.png',
    label: 'Bloco de notas',
    app: 'notepad',
    type: 'app',
    isSystem: true,
  },
  {
    id: 6,
    icon: '/images/xp/icons/paint.png',
    label: 'Paint',
    app: 'paint',
    type: 'app',
    isSystem: true,
  },
  {
    id: 8,
    icon: '/images/xp/icons/media-player.png',
    label: 'Media Player',
    app: 'mediaplayer',
    type: 'app',
    isSystem: true,
  },
];
