<script setup lang="ts">
import { systemIcons, type DesktopIcon } from '~/data/desktop'
import { useWindowlessApps } from '~/composables/useWindowlessApps'
import { useSounds } from '~/composables/useSounds'
import { useFileSystem } from '~/composables/useFileSystem'

const store = useWindowsStore()
const { isWindowlessAppOpen, openWindowlessApp } = useWindowlessApps()
const { playOpen, playNotification } = useSounds()
const notifStore = useNotificationsStore()
const fileSystem = useFileSystem()

const contextMenu = ref({ open: false, x: 0, y: 0, selectedIcon: null as DesktopIcon | null })

const renamingItem = ref<number | null>(null)
const renameInput = ref('')
const focusedIconIndex = ref<number | null>(null)
const desktopRef = ref<HTMLElement | null>(null)
const iconElements = ref<Map<number, HTMLElement>>(new Map())
const renameInputs = ref<Map<number, HTMLInputElement>>(new Map())

const STORAGE_KEY = 'xp-desktop-icons'
const TRASH_KEY = 'xp-desktop-trash'

const selectedIcons = ref<Set<number>>(new Set())
const selectionBox = ref<{ x: number; y: number; width: number; height: number } | null>(null)
let selectionStart = { x: 0, y: 0 }
let isSelecting = false

const showAltTab = ref(false)

function loadFromStorage() {
  if (typeof window === 'undefined') return
  
  const saved = localStorage.getItem(STORAGE_KEY)
  const trashSaved = localStorage.getItem(TRASH_KEY)
  
  const userIcons = saved ? JSON.parse(saved).map((icon: DesktopIcon) => ({
    ...icon,
    modifiedAt: new Date(icon.modifiedAt)
  })) : []
  
  const trashIcons = trashSaved ? JSON.parse(trashSaved).map((icon: DesktopIcon) => ({
    ...icon,
    modifiedAt: new Date(icon.modifiedAt),
    isDeleted: true
  })) : []
  
  desktopIcons.value = [...systemIcons, ...userIcons, ...trashIcons]
  updateTrashIcon()
}

function saveToStorage() {
  if (typeof window === 'undefined') return
  
  const userIcons = desktopIcons.value.filter(icon => !icon.isSystem && !icon.isDeleted)
  const trashIcons = desktopIcons.value.filter(icon => icon.isDeleted)
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userIcons))
  localStorage.setItem(TRASH_KEY, JSON.stringify(trashIcons))
  updateTrashIcon()
}

function updateTrashIcon() {
  const trashIcon = desktopIcons.value.find(icon => icon.type === 'trash')
  if (trashIcon) {
    const trashCount = desktopIcons.value.filter(icon => icon.isDeleted).length
    trashIcon.icon = trashCount > 0 
      ? '/images/xp/icons/recycle-bin-full.png' 
      : '/images/xp/icons/recycle-bin-empty.png'
  }
}

function deleteIcon(id: number) {
  const item = desktopIcons.value.find(i => i.id === id)
  if (!item || item.isSystem || item.isProtected) return
  
  item.isDeleted = true
  item.modifiedAt = new Date()
  fileSystem.deleteItem(id)
  selectedIcons.value.delete(id)
  saveToStorage()
}

function deleteSelectedIcons() {
  const toDelete = [...selectedIcons.value]
  for (const id of toDelete) {
    deleteIcon(id)
  }
  if (toDelete.length > 0) {
    playNotification()
    notifStore.show('Lixeira', `${toDelete.length} item(ns) movido(s) para a Lixeira.`, { icon: 'info' })
  }
}

function restoreFromTrash(id: number) {
  const item = desktopIcons.value.find(i => i.id === id)
  if (!item || !item.isDeleted) return
  
  item.isDeleted = false
  item.modifiedAt = new Date()
  saveToStorage()
}

function emptyTrash() {
  desktopIcons.value = desktopIcons.value.filter(icon => !icon.isDeleted)
  saveToStorage()
}

onMounted(() => {
  loadFromStorage()
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('keyup', handleGlobalKeyup)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('keyup', handleGlobalKeyup)
})

const desktopIcons = ref<DesktopIcon[]>([...systemIcons])

const visibleIcons = computed(() => desktopIcons.value.filter(icon => !icon.isDeleted))

function onRightClick(e: MouseEvent, icon?: DesktopIcon) {
  e.preventDefault()
  contextMenu.value = { open: true, x: e.clientX, y: e.clientY, selectedIcon: icon || null }
}

function onIconRightClick(e: MouseEvent, icon: DesktopIcon) {
  e.preventDefault()
  e.stopPropagation()
  contextMenu.value = { open: true, x: e.clientX, y: e.clientY, selectedIcon: icon }
}

function openItem(item: DesktopIcon) {
  playOpen()

  if (item.app === 'mediaplayer') {
    return openWindowlessApp(item.app)
  }

  const folderId = item.type === 'trash' ? -1 : item.type === 'folder' ? item.id : undefined
  const title = item.type === 'trash' ? 'Lixeira' : item.label

  store.open(item.app, { folderId, title, icon: item.icon })
}

function createFolder() {
  const name = 'Nova Pasta'
  
  const fsItem = fileSystem.createFolder(0, name)
  
  desktopIcons.value.push({ 
    id: fsItem.id, 
    icon: fsItem.icon, 
    label: fsItem.name, 
    app: 'explorer',
    size: 0,
    type: 'folder',
    modifiedAt: new Date(),
    isSystem: false
  })
  saveToStorage()
  startRename(fsItem.id, name)
}

function createTextDocument() {
  const name = 'Novo Documento de Texto'
  
  const fsItem = fileSystem.createFile(0, name, '')
  
  desktopIcons.value.push({ 
    id: fsItem.id, 
    icon: fsItem.icon, 
    label: fsItem.name, 
    app: 'notepad',
    size: 0,
    type: 'txt',
    modifiedAt: new Date(),
    isSystem: false
  })
  saveToStorage()
  startRename(fsItem.id, name)
  store.open('notepad')
}

function startRename(id: number, name: string) {
  renamingItem.value = id
  renameInput.value = name
  nextTick(() => {
    const input = renameInputs.value.get(id)
    input?.focus()
    input?.select()
  })
}

function saveRename(id: number) {
  const item = desktopIcons.value.find(i => i.id === id)
  if (item && renameInput.value.trim()) {
    item.label = renameInput.value.trim()
    item.modifiedAt = new Date()
    fileSystem.renameItem(id, renameInput.value.trim())
    saveToStorage()
  }
  renamingItem.value = null
}

function cancelRename() {
  renamingItem.value = null
  focusedIconIndex.value = null
}

function handleDesktopKeydown(e: KeyboardEvent) {
  if (renamingItem.value !== null) return
  if (contextMenu.value.open) return
  
  const icons = visibleIcons.value
  if (icons.length === 0) return

  const currentIndex = focusedIconIndex.value
  const item = currentIndex !== null ? icons[currentIndex] : null

  const actions: Record<string, () => void> = {
    ArrowRight: () => { focusedIconIndex.value = (currentIndex === null ? 0 : (currentIndex + 1) % icons.length) },
    ArrowDown:  () => { focusedIconIndex.value = (currentIndex === null ? 0 : (currentIndex + 1) % icons.length) },
    ArrowLeft:  () => { focusedIconIndex.value = (currentIndex === null ? icons.length - 1 : (currentIndex - 1 + icons.length) % icons.length) },
    ArrowUp:    () => { focusedIconIndex.value = (currentIndex === null ? icons.length - 1 : (currentIndex - 1 + icons.length) % icons.length) },
    Enter:      () => { item && openItem(item) },
    F2:         () => { item && !item.isSystem && !item.isProtected && startRename(item.id, item.label) },
  }

  const action = actions[e.key]
  if (action) {
    e.preventDefault()
    action()
  }
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.key === 'Tab') && e.altKey) {
    e.preventDefault()
    if (store.windows.length > 0) {
      showAltTab.value = true
    }
  }
  
  if (e.key === 'Delete') {
    if (selectedIcons.value.size > 0) {
      deleteSelectedIcons()
    } else if (focusedIconIndex.value !== null) {
      const icon = visibleIcons.value[focusedIconIndex.value]
      if (icon && !icon.isSystem && !icon.isProtected) {
        deleteIcon(icon.id)
        playNotification()
        notifStore.show('Lixeira', `Item movido para a Lixeira.`, { icon: 'info' })
      }
    }
  }

  if ((e.key === 'r' || e.key === 'R') && e.metaKey) {
    e.preventDefault()
    notifStore.show('Executar', 'Digite o nome de um programa para abrir.', { icon: 'info', appIcon: '/images/xp/icons/mycomputer-small.png' })
  }
}

function handleGlobalKeyup(e: KeyboardEvent) {
  if (e.key === 'Alt' || e.key === 'Tab') {
    if (showAltTab.value) {
      showAltTab.value = false
    }
  }
}

function sortByName() {
  desktopIcons.value.sort((iconA, iconB) => {
    if (iconA.isSystem && !iconB.isSystem) return -1
    if (!iconA.isSystem && iconB.isSystem) return 1
    return iconA.label.localeCompare(iconB.label)
  })
}

function sortBySize() {
  desktopIcons.value.sort((iconA, iconB) => {
    if (iconA.isSystem && !iconB.isSystem) return -1
    if (!iconA.isSystem && iconB.isSystem) return 1
    return iconA.size - iconB.size
  })
}

function sortByType() {
  const typeOrder: Record<string, number> = { folder: 0, app: 1, txt: 2 }
  desktopIcons.value.sort((iconA, iconB) => {
    if (iconA.isSystem && !iconB.isSystem) return -1
    if (!iconA.isSystem && iconB.isSystem) return 1
    const orderA = typeOrder[iconA.type] ?? 3
    const orderB = typeOrder[iconB.type] ?? 3
    return orderA - orderB
  })
}

function sortByModified() {
  desktopIcons.value.sort((iconA, iconB) => {
    if (iconA.isSystem && !iconB.isSystem) return -1
    if (!iconA.isSystem && iconB.isSystem) return 1
    return iconB.modifiedAt.getTime() - iconA.modifiedAt.getTime()
  })
}

function onDesktopMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  const target = e.target as HTMLElement
  if (target.closest('.desktop__icon')) return

  isSelecting = true
  const desktopRect = desktopRef.value?.getBoundingClientRect()
  if (!desktopRect) return

  selectionStart = { x: e.clientX - desktopRect.left, y: e.clientY - desktopRect.top }
  selectionBox.value = { x: selectionStart.x, y: selectionStart.y, width: 0, height: 0 }

  if (!e.ctrlKey) {
    selectedIcons.value.clear()
  }
}

function onDesktopMouseMove(e: MouseEvent) {
  if (!isSelecting) return
  const desktopRect = desktopRef.value?.getBoundingClientRect()
  if (!desktopRect) return

  const currentX = e.clientX - desktopRect.left
  const currentY = e.clientY - desktopRect.top

  const x = Math.min(selectionStart.x, currentX)
  const y = Math.min(selectionStart.y, currentY)
  const width = Math.abs(currentX - selectionStart.x)
  const height = Math.abs(currentY - selectionStart.y)

  selectionBox.value = { x, y, width, height }
}

function onDesktopMouseUp() {
  if (!isSelecting || !selectionBox.value) {
    isSelecting = false
    return
  }

  const box = selectionBox.value
  const desktopRect = desktopRef.value?.getBoundingClientRect()
  if (!desktopRect) return

  iconElements.value.forEach((iconEl, id) => {
    const rect = iconEl.getBoundingClientRect()
    const iconX = rect.left - desktopRect.left
    const iconY = rect.top - desktopRect.top
    const iconW = rect.width
    const iconH = rect.height

    const intersects = !(
      iconX + iconW < box.x ||
      iconX > box.x + box.width ||
      iconY + iconH < box.y ||
      iconY > box.y + box.height
    )

    if (intersects) {
      selectedIcons.value.add(id)
    } else if (box.width > 5 || box.height > 5) {
      selectedIcons.value.delete(id)
    }
  })

  isSelecting = false
  selectionBox.value = null
}

function toggleIconSelection(id: number, e: MouseEvent) {
  if (selectedIcons.value.has(id)) {
    selectedIcons.value.delete(id)
  } else {
    if (!e.ctrlKey) {
      selectedIcons.value.clear()
    }
    selectedIcons.value.add(id)
  }
}

function closeAltTab() {
  showAltTab.value = false
}
</script>

<template>
  <div
    ref="desktopRef"
    class="desktop"
    role="application"
    aria-label="Área de trabalho"
    tabindex="-1"
    @contextmenu="onRightClick"
    @click="contextMenu.open = false"
    @keydown="handleDesktopKeydown"
    @mousedown="onDesktopMouseDown"
    @mousemove="onDesktopMouseMove"
    @mouseup="onDesktopMouseUp"
  >
    <div class="desktop__wallpaper" />

    <div class="desktop__icons" role="toolbar" aria-label="Ícones da área de trabalho">
      <button
        v-for="(item, index) in visibleIcons"
        :key="item.id"
        class="desktop__icon"
        :ref="el => { if (el) iconElements.set(item.id, el as HTMLElement) }"
        :class="{ 
          'desktop__icon--renaming': renamingItem === item.id,
          'desktop__icon--focused': focusedIconIndex === index,
          'desktop__icon--selected': selectedIcons.has(item.id)
        }"
        role="button"
        :aria-label="`${item.label}, clique duas vezes para abrir`"
        :tabindex="focusedIconIndex === index || (focusedIconIndex === null && index === 0) ? 0 : -1"
        @dblclick="openItem(item)"
        @contextmenu="onIconRightClick($event, item)"
        @click="toggleIconSelection(item.id, $event)"
        @focus="focusedIconIndex = index"
      >
        <img :src="item.icon" class="desktop__icon-img" :alt="item.label" />
        <label v-if="renamingItem === item.id" :for="`desktop-rename-${item.id}`" class="visually-hidden">Renomear {{ item.label }}</label>
        <input
          v-if="renamingItem === item.id"
          :id="`desktop-rename-${item.id}`"
          :ref="el => { if (el) renameInputs.set(item.id, el as HTMLInputElement) }"
          v-model="renameInput"
          class="desktop__icon-input"
          :aria-label="`Renomear para ${item.label}`"
          @blur="saveRename(item.id)"
          @keyup.enter="saveRename(item.id)"
          @keyup.escape="cancelRename"
        />
        <span v-else class="desktop__icon-label">{{ item.label }}</span>
      </button>
    </div>

    <div
      v-if="selectionBox && (selectionBox.width > 2 || selectionBox.height > 2)"
      class="selection-box"
      :style="{
        left: `${selectionBox.x}px`,
        top: `${selectionBox.y}px`,
        width: `${selectionBox.width}px`,
        height: `${selectionBox.height}px`,
      }"
    />

    <XpWindow
      v-for="win in store.openWindows"
      :key="win.id"
      :window-id="win.id"
    >
      <XpAppsNotepad      :win="win" v-if="win.app === 'notepad'" />
      <XpAppsMinesweeper  :win="win" v-if="win.app === 'minesweeper'" />
      <XpAppsPaint        :win="win" v-if="win.app === 'paint'" />
      <XpAppsIe           :win="win" v-if="win.app === 'ie'" />
      <XpAppsExplorer     :win="win" v-if="win.app === 'explorer'" />
      <XpAppsMsn          :win="win" v-if="win.app === 'msn'" />
    </XpWindow>

    <XpAppsMediaPlayer v-if="isWindowlessAppOpen('mediaplayer')" />

    <XpContextMenu
      v-if="contextMenu.open"
      v-model="contextMenu.open"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :selected-icon="contextMenu.selectedIcon"
      :on-create-folder="createFolder"
      :on-create-text-document="createTextDocument"
      :on-sort-by-name="sortByName"
      :on-sort-by-size="sortBySize"
      :on-sort-by-type="sortByType"
      :on-sort-by-modified="sortByModified"
      :on-delete="deleteIcon"
      :on-restore="restoreFromTrash"
      :on-empty-trash="emptyTrash"
    />

    <XpAltTabOverlay v-if="showAltTab" @close="closeAltTab" />
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/Desktop.scss';
</style>
