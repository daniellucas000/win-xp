<script setup lang="ts">
type FileItem = {
  name: string
  type: 'folder' | 'file'
  icon: string
  size?: string
  modified?: string
}

const currentPath = ref('My Computer')

const drives: FileItem[] = [
  { name: 'Local Disk (C:)',  type: 'folder', icon: '/images/xp/icons/hd-drive.png',      size: '40 GB' },
  { name: 'Local Disk (D:)',  type: 'folder', icon: '/images/xp/icons/hd-drive.png',      size: '80 GB' },
  { name: 'DVD Drive (E:)',   type: 'folder', icon: '/images/xp/icons/dvd-drive.png',    size: '' },
]

const documents: FileItem[] = [
  { name: 'Meus Documentos', type: 'folder', icon: '/images/xp/icons/my-documents.png', modified: '01/01/2004' },
  { name: 'Minhas Imagens',  type: 'folder', icon: '/images/xp/icons/my-pictures.png',  modified: '01/01/2004' },
  { name: 'Minhas Músicas',  type: 'folder', icon: '/images/xp/icons/my-musics.png',     modified: '01/01/2004' },
  { name: 'Área de Trabalho',type: 'folder', icon: '/images/xp/icons/desktop.png', modified: '01/01/2004' },
  { name: 'leia-me.txt',     type: 'file',   icon: '/images/xp/icons/file-text.png',          modified: '01/01/2004', size: '1 KB' },
]

const items = computed(() =>
  currentPath.value === 'My Computer' ? drives : documents
)

const selectedItem = ref<string | null>(null)
const view = ref<'icons' | 'list'>('icons')

function selectItem(name: string) {
  selectedItem.value = name
}

function openItem(item: FileItem) {
  if (item.type === 'folder') {
    currentPath.value = item.name
    selectedItem.value = null
  }
}

function goBack() {
  currentPath.value = 'My Computer'
  selectedItem.value = null
}

const canGoBack = computed(() => currentPath.value !== 'My Computer')
</script>

<template>
  <div class="explorer">
    <div class="explorer__menubar">
      <div>
        <span class="explorer__menu-item">Arquivo</span>
        <span class="explorer__menu-item">Editar</span>
        <span class="explorer__menu-item">Exibir</span>
        <span class="explorer__menu-item">Favoritos</span>
        <span class="explorer__menu-item">Ferramentas</span>
        <span class="explorer__menu-item">Ajuda</span>
      </div>
      <span class="explorer__menu-item--flag">
        <img src="/images/xp/icons/browserflag.png" alt="">
      </span>
    </div>

    <div class="explorer__toolbar">
      <button
        class="explorer__btn"
        :disabled="!canGoBack"
        @click="goBack"
      >
        <img src="/images/xp/icons/back.png" alt=""> Voltar
      </button>
      <button class="explorer__btn" disabled>Avançar <img src="/images/xp/icons/forward.png" alt=""></button>
      <button class="explorer__btn" @click="goBack"><img src="/images/xp/icons/folder-up.png" alt=""></button>
      <div class="explorer__separator" />
      <button class="explorer__btn"><img src="/images/xp/icons/search.png" alt="">Search</button>
      <button class="explorer__btn"><img src="/images/xp/icons/folders.png" alt="">Folders</button>
      <div class="explorer__separator" />
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'icons' }"
        @click="view = 'icons'"
      ><img src="/images/xp/icons/views.png" alt=""></button>
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'list' }"
        @click="view = 'list'"
      >☰</button>
    </div>

    <div class="explorer__addressbar">
      <span class="explorer__address-label">Address</span>
      <div class="explorer__address-input">
        <img src="/images/xp/icons/mycomputer.png" class="explorer__address-icon" />
        <span>{{ currentPath }}</span>
      </div>
      <button class="explorer__go-btn">Go</button>
    </div>

    <div class="explorer__body">
      <div class="explorer__sidebar">
        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">System Tasks</div>
          <div class="explorer__sidebar-content">
            <a class="explorer__sidebar-link">View system information</a>
            <a class="explorer__sidebar-link">Add or remove programs</a>
            <a class="explorer__sidebar-link">Change a setting</a>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Other Places</div>
          <div class="explorer__sidebar-content">
            <a class="explorer__sidebar-link">My Network Places</a>
            <a class="explorer__sidebar-link">My Documents</a>
            <a class="explorer__sidebar-link">Shared Documents</a>
            <a class="explorer__sidebar-link">Control Panel</a>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Details</div>
          <div class="explorer__sidebar-detail">
            <strong>My Computer</strong>
            <span>System Folder</span>
          </div>
        </div>
      </div>

      <div
        v-if="view === 'icons'"
        class="explorer__content explorer__content--icons"
      >
        <div
          v-for="item in items"
          :key="item.name"
          class="explorer__icon"
          :class="{ 'explorer__icon--selected': selectedItem === item.name }"
          @click="selectItem(item.name)"
          @dblclick="openItem(item)"
        >
          <img :src="item.icon" class="explorer__icon-img" />
          <span class="explorer__icon-label">{{ item.name }}</span>
        </div>
      </div>

      <div v-else class="explorer__content explorer__content--list">
        <table class="explorer__table">
          <thead>
            <tr>
              <th class="explorer__th">Name</th>
              <th class="explorer__th">Size</th>
              <th class="explorer__th">Type</th>
              <th class="explorer__th">Date Modified</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.name"
              class="explorer__tr"
              :class="{ 'explorer__tr--selected': selectedItem === item.name }"
              @click="selectItem(item.name)"
              @dblclick="openItem(item)"
            >
              <td class="explorer__td">
                <img :src="item.icon" class="explorer__list-icon" />
                {{ item.name }}
              </td>
              <td class="explorer__td">{{ item.size }}</td>
              <td class="explorer__td">{{ item.type === 'folder' ? 'File Folder' : 'File' }}</td>
              <td class="explorer__td">{{ item.modified }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/apps/Explorer.scss';
</style>