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
  { name: 'Control Panel',   type: 'folder', icon: '/images/xp/icons/control-panel.png', size: '' },
]

const documents: FileItem[] = [
  { name: 'My Documents',  type: 'folder', icon: '/images/xp/icons/my-documents.png', modified: '1/1/2004' },
  { name: 'My Pictures',   type: 'folder', icon: '/images/xp/icons/my-pictures.png',  modified: '1/1/2004' },
  { name: 'My Music',      type: 'folder', icon: '/images/xp/icons/my-music.png',     modified: '1/1/2004' },
  { name: 'Desktop',       type: 'folder', icon: '/images/xp/icons/FolderClosed.png', modified: '1/1/2004' },
  { name: 'readme.txt',    type: 'file',   icon: '/images/xp/icons/TXT.png',          modified: '1/1/2004', size: '1 KB' },
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
      <span class="explorer__menu-item">Arquivo</span>
      <span class="explorer__menu-item">Editar</span>
      <span class="explorer__menu-item">Exibir</span>
      <span class="explorer__menu-item">Favoritos</span>
      <span class="explorer__menu-item">Ferramentas</span>
      <span class="explorer__menu-item">Ajuda</span>
    </div>

    <div class="explorer__toolbar">
      <button
        class="explorer__btn"
        :disabled="!canGoBack"
        @click="goBack"
      >
        <img src="/images/xp/icons/back.png" alt=""> Back
      </button>
      <button class="explorer__btn" disabled>Forward <img src="/images/xp/icons/forward.png" alt=""></button>
      <button class="explorer__btn" @click="goBack">⬆ Up</button>
      <div class="explorer__separator" />
      <button class="explorer__btn">🔍 Search</button>
      <button class="explorer__btn">📁 Folders</button>
      <div class="explorer__separator" />
      <button
        class="explorer__btn"
        :class="{ 'explorer__btn--active': view === 'icons' }"
        @click="view = 'icons'"
      >⊞</button>
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
          <a class="explorer__sidebar-link">View system information</a>
          <a class="explorer__sidebar-link">Add or remove programs</a>
          <a class="explorer__sidebar-link">Change a setting</a>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Other Places</div>
          <a class="explorer__sidebar-link">My Network Places</a>
          <a class="explorer__sidebar-link">My Documents</a>
          <a class="explorer__sidebar-link">Shared Documents</a>
          <a class="explorer__sidebar-link">Control Panel</a>
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

    <div class="explorer__statusbar">
      <span>{{ items.length }} object(s)</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $xp-bg;

  &__menubar {
    display: flex;
    flex-shrink: 0;
    padding: 2px 0;
    border-bottom: 1px solid $xp-border-dark;
  }

  &__menu-item {
    padding: 2px 6px;
    font-size: 11px;
    cursor: default;
    &:hover { background: #316ac5; color: white; }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px 4px;
    border-bottom: 1px solid $xp-border-dark;
    flex-shrink: 0;
  }

  &__btn {
    height: 24px;
    padding: 0 6px;
    font-size: 11px;
    cursor: default;
    background: $xp-bg;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    gap: 2px;
    white-space: nowrap;

    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #000000;

    &:hover:not(:disabled) {
      border-top-color: $xp-border-light;
      border-left-color: $xp-border-light;
      border-bottom-color: $xp-border-dark;
      border-right-color: $xp-border-dark;
    }

    &:disabled { color: $xp-border-dark; }

    &--active {
      border-top-color: $xp-border-dark;
      border-left-color: $xp-border-dark;
      border-bottom-color: $xp-border-light;
      border-right-color: $xp-border-light;
      background: #d0cdc4;
    }
  }

  &__separator {
    width: 1px;
    height: 20px;
    background: $xp-border-dark;
    margin: 0 2px;
  }

  &__addressbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 4px;
    border-bottom: 1px solid $xp-border-dark;
    flex-shrink: 0;
  }

  &__address-label {
    font-size: 11px;
    color: #444;
    white-space: nowrap;
  }

  &__address-input {
    flex: 1;
    height: 22px;
    border: 1px solid $xp-border-dark;
    background: white;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    font-size: 11px;
  }

  &__address-icon {
    width: 16px;
    height: 16px;
  }

  &__go-btn {
    height: 22px;
    padding: 0 8px;
    font-size: 11px;
    cursor: default;
    background: $xp-bg;
    border: 1px solid;
    border-top-color: $xp-border-light;
    border-left-color: $xp-border-light;
    border-bottom-color: $xp-border-dark;
    border-right-color: $xp-border-dark;
  }

  &__body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  &__sidebar {
    width: 160px;
    flex-shrink: 0;
    border-right: 1px solid $xp-border-dark;
    overflow-y: auto;
    background: #e8f0fb;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
  }

  &__sidebar-section {
    background: white;
    border: 1px solid #b0c4e8;
    border-radius: 4px;
    overflow: hidden;
  }

  &__sidebar-title {
    background: linear-gradient(to bottom, #4a90d9, #2a70b9);
    color: white;
    font-size: 11px;
    font-weight: bold;
    padding: 3px 6px;
  }

  &__sidebar-link {
    display: block;
    font-size: 11px;
    color: #316ac5;
    padding: 2px 6px;
    cursor: default;
    text-decoration: underline;
    &:hover { color: #ff6600; }
  }

  &__sidebar-detail {
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    font-size: 11px;
    gap: 2px;
  }

  &__content {
    flex: 1;
    overflow: auto;
    background: white;

    &--icons {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 4px;
      padding: 8px;
    }

    &--list {
      padding: 0;
    }
  }

  &__icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    padding: 4px;
    cursor: default;
    border: 1px solid transparent;
    border-radius: 2px;

    &:hover {
      background: #e8f0fb;
      border-color: #316ac5;
    }

    &--selected {
      background: #316ac5;
      border-color: #316ac5;

      .explorer__icon-label {
        color: white;
      }
    }
  }

  &__icon-img {
    width: 40px;
    height: 40px;
  }

  &__icon-label {
    font-size: 11px;
    text-align: center;
    color: black;
    margin-top: 4px;
    word-break: break-word;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  &__th {
    text-align: left;
    padding: 2px 8px;
    border-bottom: 1px solid $xp-border-dark;
    background: $xp-bg;
    font-weight: bold;
    cursor: default;
    white-space: nowrap;
    position: sticky;
    top: 0;

    &:hover { background: #d0cdc4; }
  }

  &__tr {
    cursor: default;
    &:hover { background: #e8f0fb; }
    &--selected { background: #316ac5; color: white; }
  }

  &__td {
    padding: 2px 8px;
    white-space: nowrap;
    display: table-cell;
    align-items: center;
    gap: 4px;
  }

  &__list-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 4px;
  }

  &__statusbar {
    height: 20px;
    flex-shrink: 0;
    border-top: 1px solid $xp-border-dark;
    display: flex;
    align-items: center;
    padding: 0 8px;
    font-size: 11px;
  }
}
</style>