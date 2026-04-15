<script setup lang="ts">
import type { WindowState } from '~/stores/windows'

interface Props {
  win?: WindowState
}
const props = defineProps<Props>()

const fileSystem = useFileSystem()
const winStore = useWindowsStore()
const text = ref('')
const originalText = ref('')
const isDirty = ref(false)
const activeMenu = ref<string | null>(null)
const showSaveDialog = ref(false)
const saveFileName = ref('')
const cursorLine = ref(1)
const cursorCol = ref(1)

const fileId = computed(() => props.win?.folderId ?? null)
const currentFile = computed(() => fileId.value !== null ? fileSystem.getItem(fileId.value) : null)
const fileName = computed(() => currentFile.value?.name || 'Sem título')

const displayTitle = computed(() => {
  const base = fileName.value.endsWith('.txt') ? fileName.value.replace('.txt', '') : fileName.value
  const dirty = isDirty.value ? ' *' : ''
  return `${base}${dirty} - Notepad`
})

let lastTitle = ''

watch(displayTitle, (newTitle) => {
  if (props.win?.id && newTitle !== lastTitle) {
    lastTitle = newTitle
    winStore.updateWindowTitle(props.win.id, newTitle, '/images/xp/icons/notepad.png')
  }
})

onMounted(() => {
  if (fileId.value !== null) {
    const file = fileSystem.getItem(fileId.value)
    if (file?.content !== undefined) {
      text.value = file.content
      originalText.value = file.content
    }
  }
  lastTitle = displayTitle.value
  winStore.updateWindowTitle(props.win!.id, displayTitle.value, '/images/xp/icons/notepad.png')
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

function handleClickOutside() {
  activeMenu.value = null
}

function updateCursorPosition() {
  const textarea = document.querySelector(`[data-window-id="${props.win?.id}"] textarea`) as HTMLTextAreaElement
  if (!textarea) return
  const pos = textarea.selectionStart
  const before = text.value.substring(0, pos)
  const lines = before.split('\n')
  cursorLine.value = lines.length
  cursorCol.value = lines[lines.length - 1].length + 1
}

function markDirty() {
  if (!isDirty.value) {
    isDirty.value = true
  }
}

function saveFile() {
  if (fileId.value !== null) {
    fileSystem.updateContent(fileId.value, text.value)
    originalText.value = text.value
    isDirty.value = false
  } else {
    showSaveDialog.value = true
    saveFileName.value = 'Documento.txt'
  }
}

function saveAsFile() {
  showSaveDialog.value = true
  saveFileName.value = fileName.value.endsWith('.txt') ? fileName.value : 'Documento.txt'
}

function confirmSaveAs() {
  if (!saveFileName.value.trim()) return
  const name = saveFileName.value.trim().endsWith('.txt') ? saveFileName.value.trim() : saveFileName.value.trim() + '.txt'
  const parentId = fileId.value !== null ? fileSystem.getItem(fileId.value)?.parentId ?? 0 : 0
  fileSystem.createFile(parentId, name, text.value)
  originalText.value = text.value
  isDirty.value = false
  showSaveDialog.value = false
}

function newFile() {
  text.value = ''
  originalText.value = ''
  isDirty.value = false
  winStore.updateWindowTitle(props.win!.id, 'Sem título - Notepad', '/images/xp/icons/notepad.png')
  activeMenu.value = null
}

function closeWindow() {
  activeMenu.value = null
}

function undo() {
  const textarea = document.querySelector(`[data-window-id="${props.win?.id}"] textarea`) as HTMLTextAreaElement
  if (textarea) {
    document.execCommand('undo')
    text.value = textarea.value
  }
  activeMenu.value = null
}

function cut() {
  document.execCommand('cut')
  activeMenu.value = null
}

function copy() {
  document.execCommand('copy')
  activeMenu.value = null
}

function paste() {
  navigator.clipboard.readText().then((clip) => {
    const textarea = document.querySelector(`[data-window-id="${props.win?.id}"] textarea`) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      text.value = text.value.substring(0, start) + clip + text.value.substring(end)
      nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + clip.length
      })
    }
  }).catch(() => {})
  activeMenu.value = null
}

function selectAll() {
  const textarea = document.querySelector(`[data-window-id="${props.win?.id}"] textarea`) as HTMLTextAreaElement
  if (textarea) textarea.select()
  activeMenu.value = null
}

function toggleWordWrap() {
  activeMenu.value = null
}

function toggleStatusBar() {
  activeMenu.value = null
}
</script>

<template>
  <div class="notepad">
    <div class="notepad__menubar" role="menubar" aria-label="Menu">
      <div class="notepad__menu-wrapper">
        <button class="notepad__menu-item" :class="{ 'notepad__menu-item--active': activeMenu === 'file' }" role="menuitem" @click="activeMenu = activeMenu === 'file' ? null : 'file'">File</button>
        <div v-if="activeMenu === 'file'" class="notepad__menu-dropdown" role="menu" @click.stop>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="newFile">New</button>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="saveFile">Save</button>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="saveAsFile">Save As...</button>
          <div class="notepad__menu-divider" role="separator"></div>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="closeWindow">Exit</button>
        </div>
      </div>
      <div class="notepad__menu-wrapper">
        <button class="notepad__menu-item" :class="{ 'notepad__menu-item--active': activeMenu === 'edit' }" role="menuitem" @click="activeMenu = activeMenu === 'edit' ? null : 'edit'">Edit</button>
        <div v-if="activeMenu === 'edit'" class="notepad__menu-dropdown" role="menu" @click.stop>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="undo">Undo</button>
          <div class="notepad__menu-divider" role="separator"></div>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="cut">Cut</button>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="copy">Copy</button>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="paste">Paste</button>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="selectAll">Select All</button>
        </div>
      </div>
      <div class="notepad__menu-wrapper">
        <button class="notepad__menu-item" :class="{ 'notepad__menu-item--active': activeMenu === 'format' }" role="menuitem" @click="activeMenu = activeMenu === 'format' ? null : 'format'">Format</button>
        <div v-if="activeMenu === 'format'" class="notepad__menu-dropdown" role="menu" @click.stop>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="toggleWordWrap">Word Wrap</button>
        </div>
      </div>
      <div class="notepad__menu-wrapper">
        <button class="notepad__menu-item" :class="{ 'notepad__menu-item--active': activeMenu === 'view' }" role="menuitem" @click="activeMenu = activeMenu === 'view' ? null : 'view'">View</button>
        <div v-if="activeMenu === 'view'" class="notepad__menu-dropdown" role="menu" @click.stop>
          <button class="notepad__menu-dropdown-item" role="menuitem" @click="toggleStatusBar">Status Bar</button>
        </div>
      </div>
      <div class="notepad__menu-wrapper">
        <button class="notepad__menu-item" role="menuitem" @click="activeMenu = null">Help</button>
      </div>
    </div>

    <label for="notepad-textarea" class="visually-hidden">Conteúdo do documento</label>
    <textarea
      id="notepad-textarea"
      v-model="text"
      class="notepad__textarea"
      spellcheck="false"
      :data-window-id="win?.id"
      aria-label="Conteúdo do documento"
      @input="markDirty"
      @click="updateCursorPosition"
      @keyup="updateCursorPosition"
    />

    <div class="notepad__statusbar" aria-label="Status">
      <span>Ln {{ cursorLine }}, Col {{ cursorCol }}</span>
    </div>

    <Teleport to="body">
      <div v-if="showSaveDialog" class="notepad__save-overlay" @click="showSaveDialog = false">
        <div class="notepad__save-dialog" @click.stop>
          <div class="notepad__save-title">Save As</div>
          <label class="notepad__save-label" for="save-filename">File name:</label>
          <input
            id="save-filename"
            v-model="saveFileName"
            class="notepad__save-input"
            @keyup.enter="confirmSaveAs"
            @keyup.escape="showSaveDialog = false"
          />
          <div class="notepad__save-actions">
            <button class="notepad__save-btn" @click="confirmSaveAs">Save</button>
            <button class="notepad__save-btn" @click="showSaveDialog = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
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

<style lang="scss" scoped>
@import '~/assets/css/components/xp/apps/Notepad.scss';

.notepad__save-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.notepad__save-dialog {
  background: #ece9d8;
  border: 2px solid #0054e3;
  border-radius: 8px 8px 0 0;
  padding: 16px;
  min-width: 320px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4);
}

.notepad__save-title {
  font-size: 13px;
  font-weight: 700;
  color: #003399;
  margin-bottom: 12px;
  text-align: center;
}

.notepad__save-label {
  font-size: 11px;
  color: #000;
  display: block;
  margin-bottom: 4px;
}

.notepad__save-input {
  width: 100%;
  padding: 4px 6px;
  font-size: 12px;
  border: 1px solid #7f9db9;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.notepad__save-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.notepad__save-btn {
  padding: 4px 20px;
  font-size: 11px;
  background: #fff;
  border: 1px solid #003c74;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #e8e4d8;
  }
}
</style>
