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
  onRename?: (id: number) => void
}

const props = defineProps<Props>()
const open = defineModel<boolean>('modelValue')

const menuRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

const sections = computed<MenuItem[][]>(() => {
  const icon = props.selectedIcon

  if (icon?.isDeleted) {
    return [[
      { label: 'Restaurar', action: () => props.onRestore?.(icon.id) },
      { label: 'Excluir',   action: () => props.onDelete?.(icon.id) },
    ]]
  }

  if (icon && !icon.isSystem) {
    return [
      [
        { label: 'Abrir' },
        { label: 'Explorar' },
      ],
      [
        { label: 'Excluir',  action: () => props.onDelete?.(icon.id) },
        { label: 'Renomear', action: () => props.onRename?.(icon.id) },
      ],
      [
        { label: 'Propriedades' },
      ],
    ]
  }

  if (icon?.isSystem && icon.type === 'trash') {
    return [
      [
        { label: 'Abrir',            action: () => {} },
        { label: 'Esvaziar lixeira', action: () => props.onEmptyTrash?.() },
      ],
      [
        { label: 'Propriedades' },
      ],
    ]
  }

  return contextMenuSections.base.map(section =>
    section.map(item => {
      if (item.label === 'Organizar ícones por' && item.submenu) {
        return {
          ...item,
          submenu: item.submenu.map((sub, idx) => ({
            ...sub,
            action: [
              props.onSortByName,
              props.onSortBySize,
              props.onSortByType,
              props.onSortByModified,
            ][idx],
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
})

const flatItems = computed(() => sections.value.flat())

function selectItem(item: MenuItem) {
  if (item.disabled || !item.action) return
  item.action()
  open.value = false
}

function moveFocus(direction: 1 | -1) {
  const total = flatItems.value.length
  focusedIndex.value = (focusedIndex.value + direction + total) % total
  nextTick(() => {
    const buttons = menuRef.value?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')
    buttons?.[focusedIndex.value]?.focus()
  })
}

function handleKeydown(e: KeyboardEvent) {
  const map: Record<string, () => void> = {
    Escape:    () => { open.value = false },
    ArrowDown: () => moveFocus(1),
    ArrowUp:   () => moveFocus(-1),
    Enter: () => {
      const index = focusedIndex.value
      if (index === null) return
      const item = flatItems.value[index]
      if (!item) return
      selectItem(item)
}

  }
  const action = map[e.key]
  if (action) {
    e.preventDefault()
    action()
  }
}

function handleClickOutside(e: MouseEvent) {
  if (!menuRef.value?.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    const buttons = menuRef.value?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')
    buttons?.[0]?.focus()
  })
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
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
        v-for="item in section"
        :key="item.label"
        class="context-menu__item"
        role="menuitem"
        :class="{ 
          'context-menu__item--disabled': item.disabled,
          'context-menu__item--focused': flatItems.indexOf(item) === focusedIndex
        }"
        :disabled="item.disabled"
        :aria-disabled="item.disabled"
        :tabindex="flatItems.indexOf(item) === focusedIndex ? 0 : -1"
        @click="selectItem(item)"
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