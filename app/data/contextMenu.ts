export interface DesktopIconInfo {
  id: number
  isSystem: boolean
  isProtected?: boolean
  isDeleted?: boolean
}

export interface SubmenuItem {
  label: string
  action?: () => void
}

export interface MenuItem {
  label: string
  disabled?: boolean
  hasSubmenu?: boolean
  submenu?: SubmenuItem[]
  action?: () => void
}

export const contextMenuSections = {
  base: [
    [
      { 
        label: 'Organizar ícones por', 
        hasSubmenu: true,
        submenu: [
          { label: 'Nome' },
          { label: 'Tamanho' },
          { label: 'Tipo' },
          { label: 'Modificado' },
        ],
      },
      { label: 'Atualizar' },
    ],
    [
      { label: 'Colar', disabled: true },
      { label: 'Colar atalho', disabled: true },
      { label: 'Desfazer exclusão', disabled: true },
    ],
    [
      {
        label: 'Novo',
        hasSubmenu: true,
        submenu: [
          { label: 'Documento de texto' },
          { label: 'Pasta' },
        ],
      },
    ],
    [
      { label: 'Propriedades' },
    ],
  ] as MenuItem[][],

  deleted: [
    [
      { label: 'Restaurar' },
      { label: 'Excluir' },
    ],
  ] as MenuItem[][],

  userIcon: [
    [
      { label: 'Abrir' },
      { label: 'Explorar' },
    ],
    [
      { label: 'Excluir' },
      { label: 'Renomear' },
    ],
    [
      { label: 'Propriedades' },
    ],
  ] as MenuItem[][],

  trash: [
    [
      { label: 'Abrir' },
      { label: 'Esvaziar lixeira' },
    ],
    [
      { label: 'Propriedades' },
    ],
  ] as MenuItem[][],
}
