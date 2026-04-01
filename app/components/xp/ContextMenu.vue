<script setup lang="ts">
import { contextMenuSections, type DesktopIconInfo as DesktopIcon, type MenuItem } from '~/data/contextMenu'

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

const baseSections: MenuItem[][] = contextMenuSections.base.map(section =>
  section.map(item => {
    if (item.label === 'Organizar ícones por' && item.submenu) {
      return {
        ...item,
        submenu: item.submenu.map((sub, idx) => ({
          ...sub,
          action: [props.onSortByName, props.onSortBySize, props.onSortByType, props.onSortByModified][idx],
        })),
      }
    }
    if (item.label === 'Novo' && item.submenu) {
      return {
        ...item,
        submenu: item.submenu.map((sub, idx) => ({
          ...sub,
          action: [props.onCreateTextDocument, props.onCreateFolder][idx],
        })),
      }
    }
    return item
  })
)

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

<style lang="scss" scoped>
@import '~/assets/css/components/xp/ContextMenu.scss';
</style>