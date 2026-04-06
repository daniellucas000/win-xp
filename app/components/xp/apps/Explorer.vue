<script setup lang="ts">
import type { WindowState } from '~/stores/windows'
import { useSounds } from '~/composables/useSounds'
import { useFileSystem } from '~/composables/useFileSystem'
import type { FileSystemItem } from '~/data/fileSystem'

const { playOpen, playClick } = useSounds()

interface Props {
  win?: WindowState
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const fileSystem = useFileSystem()
const winStore = useWindowsStore()
const notifStore = useNotificationsStore()

const drives: FileSystemItem[] = [
  { id: -1, parentId: null, name: 'Disco Local (C:)', type: 'folder', icon: '/images/xp/icons/hd-drive.png', size: '40 GB', modified: '' },
  { id: -2, parentId: null, name: 'Disco Local (D:)', type: 'folder', icon: '/images/xp/icons/hd-drive.png', size: '80 GB', modified: '' },
  { id: -3, parentId: null, name: 'DVD Drive (E:)', type: 'folder', icon: '/images/xp/icons/dvd-drive.png', size: '', modified: '' },
]

function fileTypeLabel(type: string) {
  const labels: Record<string, string> = {
    folder: 'Pasta de Arquivos',
    txt: 'Arquivo de Texto',
    jpg: 'Imagem JPEG',
    mp3: 'Arquivo de Áudio',
    exe: 'Aplicativo',
  }
  return labels[type] ?? 'Arquivo'
}

const isTrashMode = computed(() => (props.win?.folderId ?? 0) < 0)

const currentFolderId = ref<number | null>(isTrashMode.value ? null : (props.win?.folderId ?? null))
const history = ref<(number | null)[]>([null])
const historyIndex = ref(0)

const trashItems = ref<FileSystemItem[]>([])
const selectedItem = ref<number | null>(null)

const selectedItems = ref<Set<number>>(new Set())

const view = ref<'icons' | 'list'>('icons')
const renamingItem = ref<number | null>(null)
const renameInput = ref('')
const isCreatingFolder = ref(false)
const isCreatingFile = ref(false)
const newItemName = ref('')
const sortColumn = ref<'name' | 'size' | 'type' | 'modified'>('name')
const sortAsc = ref(true)
const contextMenu = ref({ open: false, x: 0, y: 0, itemId: null as number | null })
const clipboard = ref<{ mode: 'cut' | 'copy'; ids: number[] } | null>(null)

const TRASH_KEY = 'xp-desktop-trash'

watch(() => props.win?.folderId, () => {
  currentFolderId.value = isTrashMode.value ? null : (props.win?.folderId ?? null)
  history.value = [currentFolderId.value]
  historyIndex.value = 0
  selectedItem.value = null
  selectedItems.value = new Set()
  updateWindowTitle()
})

watch(currentFolderId, () => {
  updateWindowTitle()
})

function updateWindowTitle() {
  if (!props.win?.id) return

  const folderNames: Record<string, string> = {
    null: 'Meu computador',
    '0': props.win?.title || 'Explorer',
  }

  const title = isTrashMode.value
    ? 'Lixeira'
    : folderNames[String(currentFolderId.value)] ?? (() => {
        const folder = fileSystem.getItem(currentFolderId.value)
        return folder?.name || 'Explorer'
      })()

  winStore.updateWindowTitle(props.win.id, title, '/images/xp/icons/folder.png')
}

function loadTrashItems() {
  if (typeof window === 'undefined') return
  const saved = localStorage.getItem(TRASH_KEY)
  if (saved) {
    try {
      trashItems.value = JSON.parse(saved).map((item: any) => ({
        id: item.id || Date.now(),
        parentId: null,
        name: item.label || item.name,
        type: item.type === 'folder' ? 'folder' : 'txt',
        icon: item.icon || '/images/xp/icons/file-text.png',
        size: item.size || '',
        modified: new Date(item.modifiedAt).toLocaleDateString('pt-BR'),
        content: item.content,
      }))
    } catch {
      trashItems.value = []
    }
  }
}

function onStorageChange(e: StorageEvent) {
  if (e.key === TRASH_KEY && isTrashMode.value) loadTrashItems()
}

const breadcrumbs = computed(() => {
  if (isTrashMode.value) return [{ name: 'Lixeira' }]
  if (currentFolderId.value === null) return [{ name: 'Meu Computador' }]

  const root = [{ name: 'C:' }, { name: 'daniel' }]
  const path: { name: string }[] = []
  let current = fileSystem.getItem(currentFolderId.value)
  let iterations = 0
  const MAX_DEPTH = 50

  while (current && iterations++ < MAX_DEPTH) {
    path.push({ name: current.name })
    if (current.parentId === null) break
    current = fileSystem.getItem(current.parentId)
  }

  return [...root, ...path.reverse()]
})

const currentPathText = computed(() =>
  breadcrumbs.value.map(p => p.name).join('/')
)

const currentPathIcon = computed(() => {
  if (isTrashMode.value) return '/images/xp/icons/recycle-bin-empty.png'
  if (currentFolderId.value === null) return '/images/xp/icons/mycomputer.png'

  const item = fileSystem.getItem(currentFolderId.value)
  return item?.icon ?? '/images/xp/icons/folder.png'
})

const rawItems = computed(() => {
  if (isTrashMode.value) return trashItems.value
  if (currentFolderId.value === null) return drives
  return fileSystem.getChildrenOf(currentFolderId.value)
})

const sortedItems = computed(() => {
  const items = [...rawItems.value]
  items.sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1
    if (a.type !== 'folder' && b.type === 'folder') return 1
    let cmp = 0
    if (sortColumn.value === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortColumn.value === 'size') cmp = (a.size || '').localeCompare(b.size || '')
    else if (sortColumn.value === 'type') cmp = a.type.localeCompare(b.type)
    else if (sortColumn.value === 'modified') cmp = (a.modified || '').localeCompare(b.modified || '')
    return sortAsc.value ? cmp : -cmp
  })
  return items
})

const canGoBack = computed(() => historyIndex.value > 0 && !isTrashMode.value)
const canGoForward = computed(() => historyIndex.value < history.value.length - 1 && !isTrashMode.value)
const canGoUp = computed(() => currentFolderId.value !== null && !isTrashMode.value)

const selectedItemDetails = computed(() => {
  if (selectedItem.value === null) return null
  if (isTrashMode.value) return trashItems.value.find(i => i.id === selectedItem.value)
  if (currentFolderId.value === null) return drives.find(i => i.id === selectedItem.value)
  return fileSystem.getItem(selectedItem.value)
})

function navigateTo(folderId: number | null) {
  playOpen()
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(folderId)
  historyIndex.value++
  currentFolderId.value = folderId
  selectedItem.value = null
  selectedItems.value = new Set() 
}

function goBack() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    currentFolderId.value = history.value[historyIndex.value] ?? null
    selectedItem.value = null
    selectedItems.value = new Set() 
  }
}

function goForward() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    currentFolderId.value = history.value[historyIndex.value] ?? null
    selectedItem.value = null
    selectedItems.value = new Set()
  }
}

function goUp() {
  if (currentFolderId.value === null) return
  const item = fileSystem.getItem(currentFolderId.value)
  if (item) {
    navigateTo(item.parentId)
  }
}

function openItem(item: FileSystemItem) {
  playOpen()

  const handlers: Record<string, () => void> = {
    folder: () => navigateTo(item.id),
    txt: () => openInNotepad(item),
    exe: () => resolveExeAssociation(item.name),
    jpg: () => notifStore.show('Visualizador de Imagens', 'Visualizador de Imagens do Windows (em breve)', { icon: 'info', appIcon: '/images/xp/icons/image-file.png' }),
    mp3: () => notifStore.show('Windows Media Player', 'Reproduzindo: ' + item.name, { icon: 'info', appIcon: '/images/xp/icons/media-player.png' }),
  }

  const handler = handlers[item.type]
  if (handler) {
    handler()
  } else {
    notifStore.show('Abrir com', 'Nenhum programa associado a este tipo de arquivo.', { icon: 'warning' })
  }
}

function openInNotepad(item: FileSystemItem) {
  winStore.open('notepad', { title: item.name + ' - Notepad' })
  nextTick(() => {
    const notepadWin = winStore.windows.find(w => w.app === 'notepad' && !w.closing)
    if (!notepadWin) return
    const textarea = document.querySelector(`[data-window-id="${notepadWin.id}"] textarea`) as HTMLTextAreaElement
    if (textarea) textarea.value = item.content || ''
  })
}

function resolveExeAssociation(name: string) {
  const execMap: Record<string, () => void> = {
    'iexplore.exe': () => winStore.open('ie'),
    'notepad.exe': () => winStore.open('notepad'),
  }

  if (name.toLowerCase().includes('explorer')) return winStore.open('ie')

  const handler = execMap[name]
  if (handler) return handler()

  const message = name === 'cmd.exe'
    ? 'Comando não disponível nesta versão.'
    : `Não foi possível abrir ${name}.`

  notifStore.show('Executar', message, { icon: 'warning' })
}

function selectItem(id: number, e?: MouseEvent) {
  if (e && e.ctrlKey) {
    const set = new Set(selectedItems.value)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    selectedItems.value = set 
    selectedItem.value = id
  } else {
    selectedItems.value = new Set()
    selectedItem.value = id
  }
}

function handleSort(col: 'name' | 'size' | 'type' | 'modified') {
  if (sortColumn.value === col) {
    sortAsc.value = !sortAsc.value
  } else {
    sortColumn.value = col
    sortAsc.value = true
  }
}

function sortIcon(col: string) {
  if (sortColumn.value !== col) return ''
  return sortAsc.value ? ' ▲' : ' ▼'
}

function startCreateFolder() {
  isCreatingFolder.value = true
  isCreatingFile.value = false
  newItemName.value = 'Nova Pasta'
  nextTick(() => {
    const input = document.querySelector('.explorer__new-item-input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function startCreateFile() {
  isCreatingFile.value = true
  isCreatingFolder.value = false
  newItemName.value = 'Novo Documento de Texto.txt'
  nextTick(() => {
    const input = document.querySelector('.explorer__new-item-input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function confirmCreateFolder() {
  if (!newItemName.value.trim() || currentFolderId.value === null) return
  fileSystem.createFolder(currentFolderId.value, newItemName.value.trim())
  isCreatingFolder.value = false
  newItemName.value = ''
}

function confirmCreateFile() {
  if (!newItemName.value.trim() || currentFolderId.value === null) return
  fileSystem.createFile(currentFolderId.value, newItemName.value.trim(), '')
  isCreatingFile.value = false
  newItemName.value = ''
}

function cancelCreate() {
  isCreatingFolder.value = false
  isCreatingFile.value = false
  newItemName.value = ''
}

function startRename(id: number) {
  const item = fileSystem.getItem(id)
  if (!item || item.isSystem) return
  renamingItem.value = id
  renameInput.value = item.name
  nextTick(() => {
    const input = document.querySelector('.explorer__icon-input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function saveRename() {
  if (renamingItem.value !== null && renameInput.value.trim()) {
    fileSystem.renameItem(renamingItem.value, renameInput.value.trim())
  }
  renamingItem.value = null
}

function cancelRename() {
  renamingItem.value = null
}

function deleteSelectedItems() {
  const ids = selectedItems.value.size > 0 ? [...selectedItems.value] : (selectedItem.value !== null ? [selectedItem.value] : [])
  for (const id of ids) {
    const item = fileSystem.getItem(id)
    if (item && !item.isSystem) {
      fileSystem.deleteItem(id)
    }
  }
  selectedItem.value = null
  selectedItems.value = new Set()
  if (ids.length > 0) {
    notifStore.show('Lixeira', `${ids.length} item(ns) movido(s) para a Lixeira.`, { icon: 'info' })
  }
}

function onRightClick(e: MouseEvent, item?: FileSystemItem) {
  e.preventDefault()
  e.stopPropagation()
  if (item) {
    contextMenu.value = { open: true, x: e.clientX, y: e.clientY, itemId: item.id }
    selectItem(item.id)
  } else {
    contextMenu.value = { open: true, x: e.clientX, y: e.clientY, itemId: null }
  }
}

function cutItems() {
  if (selectedItem.value !== null) {
    clipboard.value = { mode: 'cut', ids: [selectedItem.value] }
  } else if (selectedItems.value.size > 0) {
    clipboard.value = { mode: 'cut', ids: [...selectedItems.value] }
  }
  playClick()
}

function copyItems() {
  if (selectedItem.value !== null) {
    clipboard.value = { mode: 'copy', ids: [selectedItem.value] }
  } else if (selectedItems.value.size > 0) {
    clipboard.value = { mode: 'copy', ids: [...selectedItems.value] }
  }
  playClick()
}

function pasteItems() {
  if (!clipboard.value || currentFolderId.value === null) return
  for (const id of clipboard.value.ids) {
    const item = fileSystem.getItem(id)
    if (!item) continue
    if (clipboard.value.mode === 'cut') {
      if (item.parentId !== currentFolderId.value) {
        fileSystem.moveItem(id, currentFolderId.value)
      }
    } else {
      const copy = { ...item, id: Date.now() + Math.random(), parentId: currentFolderId.value, name: `Cópia de ${item.name}` }
      fileSystem.items.value.push(copy)
    }
  }
  if (clipboard.value.mode === 'cut') clipboard.value = null
  playClick()
}

const isWindowFocused = ref(false)

function handleGlobalKeydown(e: KeyboardEvent) {
  if (!isWindowFocused.value) return
  if (renamingItem.value !== null || isCreatingFolder.value || isCreatingFile.value) return

  if (e.key === 'Escape') {
    if (contextMenu.value.open) {
      contextMenu.value.open = false
      return
    }
  }

  if (contextMenu.value.open) return

  if (e.key === 'Delete') {
    e.preventDefault()
    deleteSelectedItems()
  }
  if (e.key === 'F2' && selectedItem.value !== null) {
    e.preventDefault()
    startRename(selectedItem.value)
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
    e.preventDefault()
    cutItems()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    e.preventDefault()
    copyItems()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
    e.preventDefault()
    pasteItems()
  }
  if (e.key === 'Backspace' && canGoUp.value) {
    e.preventDefault()
    goUp()
  }
}

onMounted(() => {
  if (isTrashMode.value) loadTrashItems()
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('storage', onStorageChange) 
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('storage', onStorageChange) 
})

</script>

<template>
  <div
    class="explorer"
    role="application"
    aria-label="Explorador de arquivos"
    @focusin="isWindowFocused = true"
    @focusout="isWindowFocused = false"
  >
    <div class="explorer__menubar" role="menubar" aria-label="Menu">
      <div class="explorer__menu-left">
        <div class="explorer__menu-wrapper">
          <button class="explorer__menu-item" role="menuitem">Arquivo</button>
          <div class="explorer__menu-dropdown" role="menu">
            <button
              v-if="currentFolderId !== null && !isTrashMode"
              class="explorer__menu-dropdown-item"
              role="menuitem"
              @click="startCreateFolder"
            >
              <img src="/images/xp/icons/folder.png" alt="" aria-hidden="true"> Nova Pasta
            </button>
            <button
              v-if="currentFolderId !== null && !isTrashMode"
              class="explorer__menu-dropdown-item"
              role="menuitem"
              @click="startCreateFile"
            >
              <img src="/images/xp/icons/file-text.png" alt="" aria-hidden="true"> Novo Documento de Texto
            </button>
            <div v-if="currentFolderId !== null && !isTrashMode" class="explorer__menu-divider" role="separator"></div>
            <button class="explorer__menu-dropdown-item" role="menuitem" @click="emit('close')"> Fechar</button>
          </div>
        </div>
        <button class="explorer__menu-item" role="menuitem">Editar</button>
        <button class="explorer__menu-item" role="menuitem">Exibir</button>
        <button class="explorer__menu-item" role="menuitem">Favoritos</button>
        <button class="explorer__menu-item" role="menuitem">Ferramentas</button>
        <button class="explorer__menu-item" role="menuitem">Ajuda</button>
      </div>
      <span class="explorer__menu-item--flag" aria-hidden="true">
        <img src="/images/xp/icons/browserflag.png" alt="">
      </span>
    </div>

    <div class="explorer__toolbar" role="toolbar" aria-label="Barra de ferramentas">
      <!-- melhoria 11: tabindex="-1" em botões desabilitados -->
      <button
        class="explorer__btn"
        :disabled="!canGoBack || isTrashMode"
        :tabindex="!canGoBack || isTrashMode ? -1 : 0"
        aria-label="Voltar"
        @click="goBack"
      >
        <img src="/images/xp/icons/back.png" alt="" aria-hidden="true"> Voltar
      </button>
      <button
        class="explorer__btn"
        :disabled="!canGoForward || isTrashMode"
        :tabindex="!canGoForward || isTrashMode ? -1 : 0"
        aria-label="Avançar"
        @click="goForward"
      >
        Avançar <img src="/images/xp/icons/forward.png" alt="" aria-hidden="true">
      </button>
      <button
        class="explorer__btn"
        :disabled="!canGoUp || isTrashMode"
        :tabindex="!canGoUp || isTrashMode ? -1 : 0"
        aria-label="Pasta acima"
        @click="goUp"
      >
        <img src="/images/xp/icons/folder-up.png" alt="" aria-hidden="true">
      </button>
      <div class="explorer__separator" aria-hidden="true" />
      <button class="explorer__btn" aria-label="Pesquisar">
        <img src="/images/xp/icons/search.png" alt="" aria-hidden="true"> Pesquisar
      </button>
      <button class="explorer__btn" aria-label="Pastas">
        <img src="/images/xp/icons/folders.png" alt="" aria-hidden="true"> Pastas
      </button>
      <div class="explorer__separator" aria-hidden="true" />
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'icons' }"
        aria-label="Visualização em ícones"
        @click="view = 'icons'"
      >
        <img src="/images/xp/icons/views.png" alt="" aria-hidden="true">
      </button>
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'list' }"
        aria-label="Visualização em lista"
        @click="view = 'list'"
      >
        ☰
      </button>
    </div>

    <div class="explorer__addressbar">
      <span class="explorer__address-label" id="address-label">Endereço</span>
      <div class="explorer__address-input" aria-labelledby="address-label">
        <img :src="currentPathIcon" class="explorer__address-icon" alt="" aria-hidden="true" />
        <span class="explorer__address-text">{{ currentPathText }}</span>
      </div>
      <button class="explorer__go-btn" aria-label="Ir para endereço">Ir</button>
    </div>

    <div class="explorer__body">
      <div class="explorer__sidebar" aria-label="Painel lateral">
        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Tarefas de Arquivo e Pasta</div>
          <div class="explorer__sidebar-content">
            <button v-if="currentFolderId !== null && !isTrashMode" class="explorer__sidebar-link" @click="startCreateFolder">Criar nova pasta</button>
            <button v-if="currentFolderId !== null && !isTrashMode" class="explorer__sidebar-link" @click="startCreateFile">Criar novo arquivo</button>
            <button class="explorer__sidebar-link">Publicar esta pasta na Web</button>
            <button class="explorer__sidebar-link">Compartilhar esta pasta</button>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Outros Locais</div>
          <div class="explorer__sidebar-content">
            <button class="explorer__sidebar-link" @click="navigateTo(null)">Meu Computador</button>
            <button class="explorer__sidebar-link" @click="navigateTo(1)">Meus Documentos</button>
            <button class="explorer__sidebar-link" @click="navigateTo(2)">Documentos Compartilhados</button>
            <button class="explorer__sidebar-link" @click="navigateTo(0)">Lixeira</button>
            <button class="explorer__sidebar-link">Painel de Controle</button>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Detalhes</div>
          <div v-if="selectedItemDetails" class="explorer__sidebar-detail">
            <strong>{{ selectedItemDetails.name }}</strong>
            <span>{{ selectedItemDetails.type === 'folder' ? 'Pasta de arquivos' : 'Arquivo' }}</span>
            <span v-if="selectedItemDetails.size">Tamanho: {{ selectedItemDetails.size }}</span>
            <span v-if="selectedItemDetails.modified">Modificado em: {{ selectedItemDetails.modified }}</span>
          </div>
          <div v-else class="explorer__sidebar-detail">
            <strong>{{ currentPathText }}</strong>
            <span>{{ currentFolderId === null ? 'Pasta do Sistema' : 'Pasta de arquivos' }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="view === 'icons'"
        class="explorer__content explorer__content--icons"
        role="grid"
        aria-label="Arquivos e pastas"
        @contextmenu="onRightClick($event)"
      >
        <div v-if="isCreatingFolder" class="explorer__icon explorer__icon--creating">
          <div class="explorer__icon-wrapper">
            <img src="/images/xp/icons/folder.png" class="explorer__icon-img" alt="" aria-hidden="true" />
            <label for="new-folder-name" class="visually-hidden">Nome da nova pasta</label>
            <input
              id="new-folder-name"
              v-model="newItemName"
              class="explorer__new-item-input"
              aria-label="Nome da nova pasta"
              @blur="confirmCreateFolder"
              @keyup.enter="confirmCreateFolder"
              @keyup.escape="cancelCreate"
            />
          </div>
        </div>

        <div v-else-if="isCreatingFile" class="explorer__icon explorer__icon--creating">
          <div class="explorer__icon-wrapper">
            <img src="/images/xp/icons/file-text.png" class="explorer__icon-img" alt="" aria-hidden="true" />
            <label for="new-file-name" class="visually-hidden">Nome do novo documento</label>
            <input
              id="new-file-name"
              v-model="newItemName"
              class="explorer__new-item-input"
              aria-label="Nome do novo documento"
              @blur="confirmCreateFile"
              @keyup.enter="confirmCreateFile"
              @keyup.escape="cancelCreate"
            />
          </div>
        </div>

        <button
          v-for="item in sortedItems"
          :key="item.id"
          class="explorer__icon"
          role="gridcell"
          :class="{
            'explorer__icon--selected': selectedItem === item.id || selectedItems.has(item.id),
            'explorer__icon--renaming': renamingItem === item.id,
            'explorer__icon--trash': isTrashMode
          }"
          :aria-selected="selectedItem === item.id || selectedItems.has(item.id)"
          @click="selectItem(item.id, $event)"
          @dblclick="openItem(item)"
          @contextmenu="onRightClick($event, item)"
        >
          <div class="explorer__icon-wrapper">
            <img :src="item.icon" class="explorer__icon-img" alt="" aria-hidden="true" />
            <label v-if="renamingItem === item.id" :for="`rename-${item.id}`" class="visually-hidden">Renomear {{ item.name }}</label>
            <input
              v-if="renamingItem === item.id"
              :id="`rename-${item.id}`"
              v-model="renameInput"
              class="explorer__icon-input"
              @blur="saveRename"
              @keyup.enter="saveRename"
              @keyup.escape="cancelRename"
            />
            <span v-else class="explorer__icon-label">{{ item.name }}</span>
          </div>
        </button>

        <div v-if="sortedItems.length === 0 && !isCreatingFolder && !isCreatingFile" class="explorer__empty">
          <p>Esta pasta está vazia.</p>
        </div>
      </div>

      <div v-else class="explorer__content explorer__content--list" role="grid" aria-label="Lista de arquivos">
        <table class="explorer__table">
          <thead>
            <tr>
              <th class="explorer__th" scope="col" @click="handleSort('name')">
                Nome<span class="explorer__sort-arrow">{{ sortIcon('name') }}</span>
              </th>
              <th class="explorer__th" scope="col" @click="handleSort('size')">
                Tamanho<span class="explorer__sort-arrow">{{ sortIcon('size') }}</span>
              </th>
              <th class="explorer__th" scope="col" @click="handleSort('type')">
                Tipo<span class="explorer__sort-arrow">{{ sortIcon('type') }}</span>
              </th>
              <th class="explorer__th" scope="col" @click="handleSort('modified')">
                Data de Modificação<span class="explorer__sort-arrow">{{ sortIcon('modified') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in sortedItems"
              :key="item.id"
              class="explorer__tr"
              role="row"
              :class="{ 'explorer__tr--selected': selectedItem === item.id || selectedItems.has(item.id) }"
              :aria-selected="selectedItem === item.id || selectedItems.has(item.id)"
              @click="selectItem(item.id, $event)"
              @dblclick="openItem(item)"
              @contextmenu="onRightClick($event, item)"
            >
              <td class="explorer__td" role="gridcell">
                <img :src="item.icon" class="explorer__list-icon" alt="" aria-hidden="true" />
                {{ item.name }}
              </td>
              <td class="explorer__td" role="gridcell">{{ item.size || '' }}</td>
              <!-- melhoria 5: usando fileTypeLabel() -->
              <td class="explorer__td" role="gridcell">{{ fileTypeLabel(item.type) }}</td>
              <td class="explorer__td" role="gridcell">{{ item.modified }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="sortedItems.length === 0" class="explorer__empty">
          <p>Esta pasta está vazia.</p>
        </div>
      </div>
    </div>

    <!-- melhoria 10: aria-label no context menu -->
    <div
      v-if="contextMenu.open"
      class="context-menu"
      role="menu"
      aria-label="Menu de contexto"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      @click.stop
    >
      <template v-if="contextMenu.itemId !== null">
        <button class="context-menu__item" role="menuitem" @click="openItem(fileSystem.getItem(contextMenu.itemId)!); contextMenu.open = false">Abrir</button>
        <button v-if="currentFolderId !== null && !isTrashMode" class="context-menu__item" role="menuitem" @click="startRename(contextMenu.itemId!); contextMenu.open = false">Renomear</button>
        <button v-if="!isTrashMode" class="context-menu__item" role="menuitem" @click="cutItems(); contextMenu.open = false">Recortar</button>
        <button v-if="!isTrashMode" class="context-menu__item" role="menuitem" @click="copyItems(); contextMenu.open = false">Copiar</button>
        <div class="context-menu__divider" role="separator"></div>
        <button v-if="!isTrashMode" class="context-menu__item context-menu__item--danger" role="menuitem" @click="deleteSelectedItems(); contextMenu.open = false">Excluir</button>
        <button class="context-menu__item" role="menuitem" @click="contextMenu.open = false">Propriedades</button>
      </template>
      <template v-else>
        <button v-if="clipboard && currentFolderId !== null" class="context-menu__item" role="menuitem" @click="pasteItems(); contextMenu.open = false">Colar</button>
        <div v-if="currentFolderId !== null && !isTrashMode" class="context-menu__divider" role="separator"></div>
        <button v-if="currentFolderId !== null && !isTrashMode" class="context-menu__item" role="menuitem" @click="startCreateFolder(); contextMenu.open = false">Novo > Pasta</button>
        <button v-if="currentFolderId !== null && !isTrashMode" class="context-menu__item" role="menuitem" @click="startCreateFile(); contextMenu.open = false">Novo > Documento de Texto</button>
        <div v-if="!isTrashMode" class="context-menu__divider" role="separator"></div>
        <button class="context-menu__item" role="menuitem" @click="contextMenu.open = false">Propriedades</button>
      </template>
    </div>
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
@import '~/assets/css/components/xp/apps/Explorer.scss';

.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #888;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  z-index: 10000;
  padding: 2px 0;
}

.context-menu__item {
  display: block;
  width: 100%;
  padding: 4px 20px;
  font-size: 11px;
  text-align: left;
  background: none;
  border: none;
  cursor: default;

  &:hover {
    background: #316ac5;
    color: white;
  }

  &--danger:hover {
    background: #cc0000;
    color: white;
  }
}

.context-menu__divider {
  height: 1px;
  background: #c0c0c0;
  margin: 2px 0;
}

.explorer__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #888;
  font-size: 12px;
}

.explorer__address-input {
  display: flex;
  align-items: center;
  gap: 4px;
}

.explorer__address-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.explorer__address-text {
  font-size: 11px;
  color: #000;
  padding: 2px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.explorer__sort-arrow {
  font-size: 8px;
  margin-left: 4px;
  color: #666;
}
</style>