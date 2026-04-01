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

const menuRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

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

const flatItems = computed(() => {
  return sections.value.flat()
})

function handleKeydown(e: KeyboardEvent) {
  const items = flatItems.value
  
  if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusedIndex.value = (focusedIndex.value + 1) % items.length
    nextTick(() => {
      const buttons = menuRef.value?.querySelectorAll('button[role="menuitem"]')
      buttons?.[focusedIndex.value]?.focus()
    })
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusedIndex.value = (focusedIndex.value - 1 + items.length) % items.length
    nextTick(() => {
      const buttons = menuRef.value?.querySelectorAll('button[role="menuitem"]')
      buttons?.[focusedIndex.value]?.focus()
    })
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const item = items[focusedIndex.value]
    if (item && !item.disabled) {
      item.action?.()
      open.value = false
    }
  }
}

onMounted(() => {
  nextTick(() => {
    const buttons = menuRef.value?.querySelectorAll('button[role="menuitem"]')
    buttons?.[0]?.focus()
  })
})

</script>

<template>
  <div
    ref="menuRef"
    class="context-menu"
    role="menu"
    aria-label="Menu de contexto"
    :style="{ top: `${y}px`, left: `${x}px` }"
    tabindex="-1"
    @click.stop
    @keydown="handleKeydown"
  >
    <template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
      <div v-if="sectionIndex > 0" class="context-menu__divider" role="separator" />

      <button
        v-for="(item, itemIndex) in section"
        :key="item.label"
        class="context-menu__item"
        role="menuitem"
        :class="{ 'context-menu__item--disabled': item.disabled, 'context-menu__item--focused': flatItems.indexOf(item) === focusedIndex }"
        :disabled="item.disabled"
        :aria-disabled="item.disabled"
        :tabindex="flatItems.indexOf(item) === focusedIndex ? 0 : -1"
        @click="!item.disabled && (item.action?.(), open = false)"
        @focus="focusedIndex = flatItems.indexOf(item)"
      >
        <span class="context-menu__item-label">{{ item.label }}</span>
        <span v-if="item.hasSubmenu" class="context-menu__arrow" aria-hidden="true">▶</span>

        <div v-if="item.submenu" class="context-menu__submenu" role="menu">
          <button
            v-for="sub in item.submenu"
            :key="sub.label"
            class="context-menu__item"
            role="menuitem"
            @click.stop="sub.action?.(); open = false"
          >
            <span class="context-menu__item-label">{{ sub.label }}</span>
          </button>
        </div>
      </button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/ContextMenu.scss';
</style>