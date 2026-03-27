<script setup lang="ts">
interface DesktopIcon {
  id: number
  isSystem: boolean
  isProtected?: boolean
  isDeleted?: boolean
}

interface SubmenuItem {
  label: string
  action?: () => void
}

interface MenuItem {
  label: string
  disabled?: boolean
  hasSubmenu?: boolean
  submenu?: SubmenuItem[]
}

interface Props {
  x: number
  y: number
  selectedIcon?: DesktopIcon | null
  onCreateFolder?: () => void
  onCreateTextDocument?: () => void
  onSortByName?: () => void
  onSortBySize?: () => void
  onSortByType?: () => void
  onSortByModified?: () => void
  onDelete?: (id: number) => void
  onRestore?: (id: number) => void
  onEmptyTrash?: () => void
}

const props = defineProps<Props>()
const open = defineModel<boolean>('modelValue')  

const baseSections: MenuItem[][] = [
  [
    { 
      label: 'Organizar ícones por', 
      hasSubmenu: true,
      submenu: [
        { label: 'Nome', action: props.onSortByName },
        { label: 'Tamanho', action: props.onSortBySize },
        { label: 'Tipo', action: props.onSortByType },
        { label: 'Modificado', action: props.onSortByModified },
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
        { label: 'Documento de texto', action: props.onCreateTextDocument },
        { label: 'Pasta', action: props.onCreateFolder },
      ],
    },
  ],
  [
    { label: 'Propriedades' },
  ],
]

const sections = computed(() => {
  const icon = props.selectedIcon
  let result = [...baseSections]
  
  if (icon?.isDeleted) {
    result = [
      [
        { 
          label: 'Restaurar', 
          action: () => props.onRestore?.(icon.id) 
        },
        { 
          label: 'Excluir', 
          action: () => props.onDelete?.(icon.id) 
        },
      ],
    ]
  } else if (icon && !icon.isSystem) {
    result = [
      [
        { label: 'Abrir' },
        { label: 'Explorar' },
      ],
      [
        { 
          label: 'Excluir', 
          action: () => props.onDelete?.(icon.id) 
        },
        { label: 'Renomear' },
      ],
      [
        { label: 'Propriedades' },
      ],
    ]
  } else if (icon?.isSystem && icon.id === 1) {
    result = [
      [
        { 
          label: 'Abrir', 
          action: () => {} 
        },
        { 
          label: 'Esvaziar lixeira', 
          action: () => props.onEmptyTrash?.() 
        },
      ],
      [
        { label: 'Propriedades' },
      ],
    ]
  }
  
  return result
})

</script>

<template>
  <div
    class="context-menu"
    :style="{ top: `${y}px`, left: `${x}px` }"
    @click.stop
  >
    <template v-for="(section, index) in sections" :key="index">
      <div v-if="index > 0" class="context-menu__divider" />

      <div
        v-for="item in section"
        :key="item.label"
        class="context-menu__item"
        :class="{ 'context-menu__item--disabled': item.disabled }"
        @click="!item.disabled && (item.action?.(), open = false)"  
      >
        <span class="context-menu__item-label">{{ item.label }}</span>
        <span v-if="item.hasSubmenu" class="context-menu__arrow">▶</span>

        <div v-if="item.submenu" class="context-menu__submenu">
          <div
            v-for="sub in item.submenu"
            :key="sub.label"
            class="context-menu__item"
            @click.stop="sub.action?.(); open = false"
          >
            <span class="context-menu__item-label">{{ sub.label }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/ContextMenu.scss';
</style>