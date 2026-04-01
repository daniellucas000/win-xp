<script setup lang="ts">
import { systemIcons, type DesktopIcon } from '~/data/desktop'

const store = useWindowsStore()

const contextMenu = ref({ open: false, x: 0, y: 0, selectedIcon: null as DesktopIcon | null })

const renamingItem = ref<number | null>(null)
const renameInput = ref('')

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
  if (item.type === 'folder') {
    store.open('explorer', { folderId: item.id, title: item.label })
  } else if (item.type === 'trash') {
    store.open('explorer', { folderId: 0, title: 'Lixeira' })
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
}

function sortByName() {
  desktopIcons.value.sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1
    if (!a.isSystem && b.isSystem) return 1
    return a.label.localeCompare(b.label)
  })
}

function sortBySize() {
  desktopIcons.value.sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1
    if (!a.isSystem && b.isSystem) return 1
    return a.size - b.size
  })
}

function sortByType() {
  const typeOrder: Record<string, number> = { folder: 0, app: 1, txt: 2 }
  desktopIcons.value.sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1
    if (!a.isSystem && b.isSystem) return 1
    const aOrder = typeOrder[a.type] ?? 3
    const bOrder = typeOrder[b.type] ?? 3
    return aOrder - bOrder
  })
}

function sortByModified() {
  desktopIcons.value.sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1
    if (!a.isSystem && b.isSystem) return 1
    return b.modifiedAt.getTime() - a.modifiedAt.getTime()
  })
}


</script>

<template>
  <div
    class="desktop"
    @contextmenu="onRightClick"
    @click="contextMenu.open = false"
  >
    <div class="desktop__wallpaper" />

    <div class="desktop__icons">
      <button
        v-for="item in visibleIcons"
        :key="item.id"
        class="desktop__icon"
        :class="{ 
          'desktop__icon--renaming': renamingItem === item.id
        }"
        @dblclick="openItem(item)"
        @contextmenu="onIconRightClick($event, item)"
      >
        <img :src="item.icon" class="desktop__icon-img" />
        <input
          v-if="renamingItem === item.id"
          v-model="renameInput"
          class="desktop__icon-input"
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
      <XpAppsMediaPlayer  :win="win" v-if="win.app === 'mediaplayer'" />
      <XpAppsExplorer     :win="win" v-if="win.app === 'explorer'" />
      <XpAppsMsn          :win="win" v-if="win.app === 'msn'" />
    </XpWindow>

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
</style>
