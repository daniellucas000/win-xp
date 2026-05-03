import type {
  MenuItem,
  DesktopIconInfo as DesktopIcon,
} from '~/data/contextMenu';
import { contextMenuSections } from '~/data/contextMenu';

interface SectionOptions {
  onCreateFolder?: () => void;
  onCreateTextDocument?: () => void;
  onSortByName?: () => void;
  onSortBySize?: () => void;
  onSortByType?: () => void;
  onSortByModified?: () => void;
  onDelete?: (id: number) => void;
  onRestore?: (id: number) => void;
  onEmptyTrash?: () => void;
  onRename?: (id: number) => void;
}

export function useContextMenuSections(
  icon: Ref<DesktopIcon | null | undefined>,
  opts: SectionOptions,
  currentSort: Ref<string | null | undefined> = ref(null)
) {
  return computed<MenuItem[][]>(() => {
    const i = icon.value;

    if (i?.isDeleted) {
      return [
        [
          { label: 'Restaurar', action: () => opts.onRestore?.(i.id) },
          { label: 'Excluir', action: () => opts.onDelete?.(i.id) },
        ],
      ];
    }

    if (i && !i.isSystem) {
      return [
        [{ label: 'Abrir' }, { label: 'Explorar' }],
        [
          { label: 'Excluir', action: () => opts.onDelete?.(i.id) },
          { label: 'Renomear', action: () => opts.onRename?.(i.id) },
        ],
        [{ label: 'Propriedades' }],
      ];
    }

    if (i?.isSystem && i.type === 'trash') {
      return [
        [
          { label: 'Abrir', action: () => {} },
          { label: 'Esvaziar lixeira', action: () => opts.onEmptyTrash?.() },
        ],
        [{ label: 'Propriedades' }],
      ];
    }

    const sortActions = [
      opts.onSortByName,
      opts.onSortBySize,
      opts.onSortByType,
      opts.onSortByModified,
    ];

    const newActions = [opts.onCreateTextDocument, opts.onCreateFolder];

    return contextMenuSections.base.map((section) =>
      section.map((item) => {
        if (item.label === 'Organizar ícones por' && item.submenu) {
          return {
            ...item,
            submenu: item.submenu.map((sub, idx) => ({
              ...sub,
              action: sortActions[idx],
            })),
          };
        }
        if (item.label === 'Novo' && item.submenu) {
          return {
            ...item,
            submenu: item.submenu.map((sub, idx) => ({
              ...sub,
              action: newActions[idx],
            })),
          };
        }
        return item;
      })
    );
  });
}
