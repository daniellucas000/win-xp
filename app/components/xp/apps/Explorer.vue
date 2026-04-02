<script setup lang="ts">
import type { WindowState } from '~/stores/windows'
import { useSounds } from '~/composables/useSounds'

const { playOpen } = useSounds()

interface FileItem {
  id: number
  name: string
  type: 'folder' | 'file'
  icon: string
  size?: string
  modified?: string
  content?: string
}

interface Props {
  win?: WindowState
}

const props = defineProps<Props>()

const TRASH_KEY = 'xp-desktop-trash'
const FOLDERS_KEY = 'xp-desktop-folders'

const isTrashMode = computed(() => props.win?.folderId === 0)

const currentFolderId = ref<number | null>(isTrashMode.value ? null : (props.win?.folderId || null))
const currentPath = ref(props.win?.title || 'Meu computador')

const history = ref<string[]>([])
const historyIndex = ref(-1)

const folders = ref<FileItem[]>([])
const trashItems = ref<FileItem[]>([])
const selectedItem = ref<number | null>(null)
const view = ref<'icons' | 'list'>('icons')
const renamingItem = ref<number | null>(null)
const renameInput = ref('')
const isCreatingFolder = ref(false)
const isCreatingFile = ref(false)
const newItemName = ref('')

const drives: FileItem[] = [
  { id: 1, name: 'Disco Local (C:)',  type: 'folder', icon: '/images/xp/icons/hd-drive.png',      size: '40 GB' },
  { id: 2, name: 'Disco Local (D:)',  type: 'folder', icon: '/images/xp/icons/hd-drive.png',      size: '80 GB' },
  { id: 3, name: 'DVD Drive (E:)',   type: 'folder', icon: '/images/xp/icons/dvd-drive.png',    size: '' },
]

function loadFolders() {
  if (typeof window === 'undefined') return
  
  const saved = localStorage.getItem(FOLDERS_KEY)
  if (saved) {
    try {
      folders.value = JSON.parse(saved)
    } catch {
      folders.value = []
    }
  } else {
    folders.value = []
  }
}

function saveFolders() {
  if (typeof window === 'undefined') return
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders.value))
}

function loadTrashItems() {
  if (typeof window === 'undefined') return
  
  const saved = localStorage.getItem(TRASH_KEY)
  if (saved) {
    try {
      trashItems.value = JSON.parse(saved).map((item: any) => ({
        ...item,
        name: item.label || item.name,
        modified: new Date(item.modifiedAt).toLocaleDateString('pt-BR')
      }))
    } catch {
      trashItems.value = []
    }
  } else {
    trashItems.value = []
  }
}

function saveTrashItems() {
  if (typeof window === 'undefined') return
  localStorage.setItem(TRASH_KEY, JSON.stringify(trashItems.value))
}

function restoreItem(id: number) {
  const itemIndex = trashItems.value.findIndex(i => i.id === id)
  if (itemIndex === -1) return
  
  const item = trashItems.value[itemIndex]
  
  const desktopSaved = localStorage.getItem('xp-desktop-icons')
  const desktopItems = desktopSaved ? JSON.parse(desktopSaved) : []
  
  desktopItems.push({
    ...item,
    isDeleted: false,
    modifiedAt: new Date().toISOString()
  })
  
  localStorage.setItem('xp-desktop-icons', JSON.stringify(desktopItems))
  
  trashItems.value.splice(itemIndex, 1)
  saveTrashItems()
  
  loadTrashItems()
}

function deletePermanently(id: number) {
  const itemIndex = trashItems.value.findIndex(i => i.id === id)
  if (itemIndex === -1) return
  
  trashItems.value.splice(itemIndex, 1)
  saveTrashItems()
}

function startCreateFolder() {
  isCreatingFolder.value = true
  newItemName.value = 'Nova Pasta'
  nextTick(() => {
    const input = document.querySelector('.explorer__new-item-input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function startCreateFile() {
  isCreatingFile.value = true
  newItemName.value = 'Novo Documento de Texto.txt'
  nextTick(() => {
    const input = document.querySelector('.explorer__new-item-input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function confirmCreateFolder() {
  if (!newItemName.value.trim() || !currentFolderId.value) return
  
  const newFolder: FileItem = {
    id: Date.now(),
    name: newItemName.value.trim(),
    type: 'folder',
    icon: '/images/xp/icons/folder.png',
    modified: new Date().toLocaleDateString('pt-BR')
  }
  
  folders.value.push(newFolder)
  saveFolders()
  
  isCreatingFolder.value = false
  newItemName.value = ''
}

function confirmCreateFile() {
  if (!newItemName.value.trim() || !currentFolderId.value) return
  
  const newFile: FileItem = {
    id: Date.now(),
    name: newItemName.value.trim(),
    type: 'file',
    icon: '/images/xp/icons/file-text.png',
    size: '0 KB',
    modified: new Date().toLocaleDateString('pt-BR'),
    content: ''
  }
  
  folders.value.push(newFile)
  saveFolders()
  
  isCreatingFile.value = false
  newItemName.value = ''
}

function cancelCreate() {
  isCreatingFolder.value = false
  isCreatingFile.value = false
  newItemName.value = ''
}

onMounted(() => {
  loadFolders()
  if (isTrashMode.value) {
    loadTrashItems()
  }
})

const items = computed(() => {
  if (isTrashMode.value) {
    return trashItems.value
  }
  if (currentFolderId.value === null) {
    return drives
  }
  return folders.value
})

const canGoBack = computed(() => historyIndex.value > 0 && !isTrashMode.value)
const canGoUp = computed(() => currentFolderId.value !== null && !isTrashMode.value)

function selectItem(id: number) {
  selectedItem.value = id
}

const selectedItemDetails = computed(() => {
  if (selectedItem.value === null) return null
  
  if (isTrashMode.value) {
    return trashItems.value.find(i => i.id === selectedItem.value)
  }
  if (currentFolderId.value === null) {
    return drives.find(i => i.id === selectedItem.value)
  }
  return folders.value.find(i => i.id === selectedItem.value)
})

function openItem(item: FileItem) {
  playOpen()
  if (item.type === 'folder') {
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    history.value.push(item.name)
    historyIndex.value++
    
    currentFolderId.value = item.id
    currentPath.value = item.name
    selectedItem.value = null
  }
}

function goBack() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    currentPath.value = history.value[historyIndex.value] ?? 'Meu computador'
    selectedItem.value = null
  }
}

function goUp() {
  if (currentFolderId.value !== null) {
    currentFolderId.value = null
    currentPath.value = 'Meu computador'
    selectedItem.value = null
  }
}

function saveRename() {
  if (renamingItem.value !== null) {
    const item = folders.value.find(f => f.id === renamingItem.value)
    if (item && renameInput.value.trim()) {
      item.name = renameInput.value.trim()
      saveFolders()
    }
    renamingItem.value = null
  }
}

function cancelRename() {
  renamingItem.value = null
}
</script>

<template>
  <div class="explorer" role="application" aria-label="Explorador de arquivos">
    <div class="explorer__menubar" role="menubar" aria-label="Menu">
      <div>
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
            <button class="explorer__menu-dropdown-item" role="menuitem" @click="$emit('close')"> Fechar</button>
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
      <button
        class="explorer__btn"
        :disabled="!canGoBack || isTrashMode"
        aria-label="Voltar"
        @click="goBack"
      >
        <img src="/images/xp/icons/back.png" alt="" aria-hidden="true"> Voltar
      </button>
      <button class="explorer__btn" disabled aria-label="Avançar">Avançar <img src="/images/xp/icons/forward.png" alt="" aria-hidden="true"></button>
      <button class="explorer__btn" :disabled="!canGoUp || isTrashMode" aria-label="Pasta acima" @click="goUp"><img src="/images/xp/icons/folder-up.png" alt="" aria-hidden="true"></button>
      <div class="explorer__separator" aria-hidden="true" />
      <button class="explorer__btn" aria-label="Pesquisar"><img src="/images/xp/icons/search.png" alt="" aria-hidden="true">Pesquisar</button>
      <button class="explorer__btn" aria-label="Pastas"><img src="/images/xp/icons/folders.png" alt="" aria-hidden="true">Pastas</button>
      <div class="explorer__separator" aria-hidden="true" />
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'icons' }"
        aria-label="Visualização em ícones"
        @click="view = 'icons'"
      ><img src="/images/xp/icons/views.png" alt="" aria-hidden="true"></button>
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'list' }"
        aria-label="Visualização em lista"
        @click="view = 'list'"
      >☰</button>
    </div>

    <div class="explorer__addressbar">
      <span class="explorer__address-label" id="address-label">Endereço</span>
      <div class="explorer__address-input" aria-labelledby="address-label">
        <img src="/images/xp/icons/mycomputer.png" class="explorer__address-icon" alt="" aria-hidden="true" />
        <span>{{ currentPath }}</span>
      </div>
      <button class="explorer__go-btn" aria-label="Ir para endereço">Ir</button>
    </div>

    <div class="explorer__body">
      <div class="explorer__sidebar" aria-label="Painel lateral">
        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Tarefas do Sistema</div>
          <div class="explorer__sidebar-content">
            <button class="explorer__sidebar-link">Exibir informações do sistema</button>
            <button class="explorer__sidebar-link">Adicionar ou remover programas</button>
            <button class="explorer__sidebar-link">Alterar uma configuração</button>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Outros Locais</div>
          <div class="explorer__sidebar-content">
            <button class="explorer__sidebar-link">Meus Locais de Rede</button>
            <button class="explorer__sidebar-link">Meus Documentos</button>
            <button class="explorer__sidebar-link">Documentos Compartilhados</button>
            <button class="explorer__sidebar-link">Painel de Controle</button>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Detalhes</div>
          <div v-if="selectedItemDetails" class="explorer__sidebar-detail" :aria-label="`Detalhes de ${selectedItemDetails.name}`">
            <strong>{{ selectedItemDetails.name }}</strong>
            <span>{{ selectedItemDetails.type === 'folder' ? 'Pasta de arquivos' : 'Arquivo' }}</span>
            <span v-if="selectedItemDetails.size">{{ selectedItemDetails.size }}</span>
            <span v-if="selectedItemDetails.modified">Modificado: {{ selectedItemDetails.modified }}</span>
          </div>
          <div v-else class="explorer__sidebar-detail" :aria-label="`Detalhes de ${currentPath}`">
            <strong>{{ currentPath }}</strong>
            <span>{{ currentFolderId === null ? 'Pasta do Sistema' : 'Pasta de arquivos' }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="view === 'icons'"
        class="explorer__content explorer__content--icons"
        role="grid"
        aria-label="Arquivos e pastas"
      >
        <div
          v-if="isCreatingFolder"
          class="explorer__icon explorer__icon--creating"
        >
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
        <div
          v-else-if="isCreatingFile"
          class="explorer__icon explorer__icon--creating"
        >
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
          v-for="item in items"
          :key="item.id"
          class="explorer__icon"
          role="gridcell"
          :class="{ 
            'explorer__icon--selected': selectedItem === item.id,
            'explorer__icon--renaming': renamingItem === item.id,
            'explorer__icon--trash': isTrashMode
          }"
          :aria-selected="selectedItem === item.id"
          :aria-label="`${item.name}, ${item.type === 'folder' ? 'pasta' : 'arquivo'}`"
          @click="selectItem(item.id)"
          @dblclick="isTrashMode ? restoreItem(item.id) : openItem(item)"
        >
          <div class="explorer__icon-wrapper">
            <div v-if="isTrashMode" class="explorer__trash-actions">
              <button class="explorer__trash-btn" aria-label="Restaurar" @click.stop="restoreItem(item.id)">↩</button>
              <button class="explorer__trash-btn explorer__trash-btn--delete" aria-label="Excluir permanentemente" @click.stop="deletePermanently(item.id)">✕</button>
            </div>
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
      </div>

      <div v-else class="explorer__content explorer__content--list" role="grid" aria-label="Lista de arquivos">
        <table class="explorer__table">
          <thead>
            <tr>
              <th class="explorer__th" scope="col">Nome</th>
              <th class="explorer__th" scope="col">Tamanho</th>
              <th class="explorer__th" scope="col">Tipo</th>
              <th class="explorer__th" scope="col">Data de Modificação</th>
              <th v-if="isTrashMode" class="explorer__th" scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              class="explorer__tr"
              role="row"
              :class="{ 'explorer__tr--selected': selectedItem === item.id }"
              :aria-selected="selectedItem === item.id"
              @click="selectItem(item.id)"
              @dblclick="isTrashMode ? restoreItem(item.id) : openItem(item)"
            >
              <td class="explorer__td" role="gridcell">
                <img :src="item.icon" class="explorer__list-icon" alt="" aria-hidden="true" />
                {{ item.name }}
              </td>
              <td class="explorer__td" role="gridcell">{{ item.size }}</td>
              <td class="explorer__td" role="gridcell">{{ item.type === 'folder' ? 'Pasta de Arquivos' : 'Arquivo' }}</td>
              <td class="explorer__td" role="gridcell">{{ item.modified }}</td>
              <td v-if="isTrashMode" class="explorer__td explorer__td--actions" role="gridcell">
                <button class="explorer__trash-btn" aria-label="Restaurar" @click.stop="restoreItem(item.id)">↩ Restaurar</button>
                <button class="explorer__trash-btn explorer__trash-btn--delete" aria-label="Excluir permanentemente" @click.stop="deletePermanently(item.id)">✕ Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
</style>
