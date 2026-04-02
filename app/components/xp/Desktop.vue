<script setup lang="ts">
import { systemIcons, type DesktopIcon } from '~/data/desktop'
import { useWindowlessApps } from '~/composables/useWindowlessApps'
import { useSounds } from '~/composables/useSounds'

const store = useWindowsStore()
const { isWindowlessAppOpen, openWindowlessApp } = useWindowlessApps()
const { playOpen } = useSounds()

const contextMenu = ref({ open: false, x: 0, y: 0, selectedIcon: null as DesktopIcon | null })

const renamingItem = ref<number | null>(null)
const renameInput = ref('')
const focusedIconIndex = ref<number | null>(null)
const desktopRef = ref<HTMLElement | null>(null)

const STORAGE_KEY = 'xp-desktop-icons'
const TRASH_KEY = 'xp-desktop-trash'

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
  saveToStorage()
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
  if (item.type === 'folder') {
    store.open('explorer', { folderId: item.id, title: item.label })
  } else if (item.type === 'trash') {
    store.open('explorer', { folderId: 0, title: 'Lixeira' })
  } else if (item.app === 'mediaplayer') {
    openWindowlessApp(item.app)
  } else {
    store.open(item.app)
  }
}

function createFolder() {
  const name = 'Nova Pasta'
  const id = Date.now()
  desktopIcons.value.push({ 
    id, 
    icon: '/images/xp/icons/folder.png', 
    label: name, 
    app: 'explorer',
    size: 0,
    type: 'folder',
    modifiedAt: new Date(),
    isSystem: false
  })
  saveToStorage()
  startRename(id, name)
}

function createTextDocument() {
  const name = 'Novo Documento de Texto'
  const id = Date.now()
  desktopIcons.value.push({ 
    id, 
    icon: '/images/xp/icons/file-text.png', 
    label: name, 
    app: 'notepad',
    size: 0,
    type: 'txt',
    modifiedAt: new Date(),
    isSystem: false
  })
  saveToStorage()
  startRename(id, name)
  store.open('notepad')
}

function startRename(id: number, name: string) {
  renamingItem.value = id
  renameInput.value = name
  nextTick(() => {
    const input = document.querySelector('.desktop__icon--renaming input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function saveRename(id: number) {
  const item = desktopIcons.value.find(i => i.id === id)
  if (item && renameInput.value.trim()) {
    item.label = renameInput.value.trim()
    item.modifiedAt = new Date()
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
  
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    const nextIndex = currentIndex === null ? 0 : (currentIndex + 1) % icons.length
    focusedIconIndex.value = nextIndex
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    const prevIndex = currentIndex === null ? icons.length - 1 : (currentIndex - 1 + icons.length) % icons.length
    focusedIconIndex.value = prevIndex
  } else if (e.key === 'Enter' && currentIndex !== null) {
    e.preventDefault()
    openItem(icons[currentIndex])
  } else if (e.key === 'F2' && currentIndex !== null) {
    e.preventDefault()
    const item = icons[currentIndex]
    if (!item.isSystem && !item.isProtected) {
      startRename(item.id, item.label)
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
  >
    <div class="desktop__wallpaper" />

    <div class="desktop__icons" role="toolbar" aria-label="Ícones da área de trabalho">
      <button
        v-for="(item, index) in visibleIcons"
        :key="item.id"
        class="desktop__icon"
        role="button"
        :aria-label="`${item.label}, clique duas vezes para abrir`"
        :class="{ 
          'desktop__icon--renaming': renamingItem === item.id,
          'desktop__icon--focused': focusedIconIndex === index
        }"
        :tabindex="focusedIconIndex === index || (focusedIconIndex === null && index === 0) ? 0 : -1"
        @dblclick="openItem(item)"
        @contextmenu="onIconRightClick($event, item)"
        @focus="focusedIconIndex = index"
      >
        <img :src="item.icon" class="desktop__icon-img" :alt="item.label" />
        <label v-if="renamingItem === item.id" :for="`desktop-rename-${item.id}`" class="visually-hidden">Renomear {{ item.label }}</label>
        <input
          v-if="renamingItem === item.id"
          :id="`desktop-rename-${item.id}`"
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

    <XpWindow
      v-for="win in store.openWindows"
      :key="win.id"
      :win="win"
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
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/Desktop.scss';

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
