<script setup lang="ts">
import type { WindowState } from '~/stores/windows';
import type { FileSystemItem } from '~/data/fileSystem';
import { useFileSystem } from '~/composables/useFileSystem';
import { useExplorerNav } from '~/composables/explorer/useExplorerNav';
import { useExplorerSelection } from '~/composables/explorer/useExplorerSelection';
import { useExplorerClipboard } from '~/composables/explorer/useExplorerClipboard';
import { useExplorerItems } from '~/composables/explorer/useExplorerItems';
import { useExplorerKeyboard } from '~/composables/explorer/useExplorerKeyboard';
import { STORAGE_KEYS } from '~/constants/storage';
import ExplorerToolbar from './ExplorerToolbar.vue';
import ExplorerContextMenu from './ExplorerContextMenu.vue';

const props = defineProps<{ win?: WindowState }>();

const fileSystem = useFileSystem();
const winStore = useWindowsStore();
const isTrashMode = computed(() => (props.win?.folderId ?? 0) < 0);
const initialFolderId = computed(() =>
  isTrashMode.value ? null : (props.win?.folderId ?? null)
);

const nav = useExplorerNav(initialFolderId, isTrashMode);
const sel = useExplorerSelection();
const items = useExplorerItems(nav.currentFolderId, isTrashMode, fileSystem);
const clip = useExplorerClipboard(fileSystem, sel.activeIds);

const view = ref<'icons' | 'list'>('icons');
const renamingItem = ref<number | null>(null);
const renameInput = ref('');
const isCreatingFolder = ref(false);
const isCreatingFile = ref(false);
const newItemName = ref('');
const isWindowFocused = ref(false);
const contextMenu = ref({
  open: false,
  x: 0,
  y: 0,
  itemId: null as number | null,
});

useExplorerKeyboard({
  isWindowFocused,
  renamingItem,
  isCreatingFolder,
  isCreatingFile,
  contextMenuOpen: computed({
    get: () => contextMenu.value.open,
    set: (v) => (contextMenu.value.open = v),
  }),
  canGoUp: nav.canGoUp,
  selectedItem: sel.selectedItem,
  deleteSelectedItems,
  startRename,
  cutItems: clip.cutItems,
  copyItems: clip.copyItems,
  pasteItems: () => clip.pasteItems(nav.currentFolderId.value),
  goUp: () => nav.goUp(fileSystem.getItem),
});

watch(
  () => props.win?.folderId,
  () => {
    nav.reset(initialFolderId.value);
    sel.clearSelection();
    updateWindowTitle();
  }
);

watch(nav.currentFolderId, () => updateWindowTitle());

function updateWindowTitle() {
  if (!props.win?.id) return;
  const title = isTrashMode.value
    ? 'Lixeira'
    : nav.currentFolderId.value === null
      ? 'Meu computador'
      : fileSystem.getItem(nav.currentFolderId.value)?.name ||
        props.win?.title ||
        'Explorer';
  winStore.updateWindowTitle(
    props.win.id,
    title,
    '/images/xp/icons/folder.png'
  );
}

function navigateTo(folderId: number | null) {
  nav.navigateTo(folderId);
  sel.clearSelection();
}

function goBack() {
  nav.goBack();
  sel.clearSelection();
}

function goForward() {
  nav.goForward();
  sel.clearSelection();
}

function goUp() {
  nav.goUp(fileSystem.getItem);
  sel.clearSelection();
}

function openItem(item: FileSystemItem) {
  const handlers: Record<string, () => void> = {
    folder: () => navigateTo(item.id),
    txt: () =>
      winStore.open('notepad', {
        folderId: item.id,
        title: item.name + ' - Notepad',
      }),
    exe: () => resolveExeAssociation(item.name),
    jpg: () => {},
    mp3: () => {},
  };
  const handler = handlers[item.type];
  if (handler) handler();
}

function resolveExeAssociation(name: string) {
  if (name.toLowerCase().includes('explorer')) return winStore.open('ie');
  const execMap: Record<string, () => void> = {
    'iexplore.exe': () => winStore.open('ie'),
    'notepad.exe': () => winStore.open('notepad'),
  };
  const handler = execMap[name];
  if (handler) return handler();
}

function startRename(id: number) {
  const item = fileSystem.getItem(id);
  if (!item || item.isSystem) return;
  renamingItem.value = id;
  renameInput.value = item.name;
  nextTick(() =>
    (
      document.querySelector('.explorer__icon-input') as HTMLInputElement
    )?.focus()
  );
}

function saveRename() {
  if (renamingItem.value !== null && renameInput.value.trim()) {
    fileSystem.renameItem(renamingItem.value, renameInput.value.trim());
  }
  renamingItem.value = null;
}

function startCreate(type: 'folder' | 'file') {
  isCreatingFolder.value = type === 'folder';
  isCreatingFile.value = type === 'file';
  newItemName.value =
    type === 'folder' ? 'Nova Pasta' : 'Novo Documento de Texto.txt';
  nextTick(() => {
    const input = document.querySelector(
      '.explorer__new-item-input'
    ) as HTMLInputElement;
    input?.focus();
    input?.select();
  });
}

function confirmCreate(type: 'folder' | 'file') {
  if (!newItemName.value.trim() || nav.currentFolderId.value === null) return;
  type === 'folder'
    ? fileSystem.createFolder(
        nav.currentFolderId.value,
        newItemName.value.trim()
      )
    : fileSystem.createFile(
        nav.currentFolderId.value,
        newItemName.value.trim(),
        ''
      );
  isCreatingFolder.value = false;
  isCreatingFile.value = false;
  newItemName.value = '';
}

function cancelCreate() {
  isCreatingFolder.value = false;
  isCreatingFile.value = false;
  newItemName.value = '';
}

function deleteSelectedItems() {
  const ids = sel.activeIds.value;
  for (const id of ids) {
    const item = fileSystem.getItem(id);
    if (item && !item.isSystem) fileSystem.deleteItem(id);
  }
  sel.clearSelection();
  if (ids.length > 0) {
    notifStore.show(
      'Lixeira',
      `${ids.length} item(ns) movido(s) para a Lixeira.`,
      { icon: 'info' }
    );
  }
}

function onRightClick(e: MouseEvent, item?: FileSystemItem) {
  e.preventDefault();
  e.stopPropagation();
  contextMenu.value = {
    open: true,
    x: e.clientX,
    y: e.clientY,
    itemId: item?.id ?? null,
  };
  if (item) sel.selectItem(item.id);
}

function onStorageChange(e: StorageEvent) {
  if (e.key === STORAGE_KEYS.TRASH && isTrashMode.value) items.loadTrashItems();
}

const selectedItemDetails = computed(() => {
  if (sel.selectedItem.value === null) return null;
  return (
    fileSystem.getItem(sel.selectedItem.value) ??
    items.sortedItems.value.find((i) => i.id === sel.selectedItem.value) ??
    null
  );
});

onMounted(() => {
  if (isTrashMode.value) items.loadTrashItems();
  window.addEventListener('storage', onStorageChange);
});

onUnmounted(() => {
  window.removeEventListener('storage', onStorageChange);
});
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
        <button class="explorer__menu-item" role="menuitem">Arquivo</button>
        <button class="explorer__menu-item" role="menuitem">Editar</button>
        <button class="explorer__menu-item" role="menuitem">Exibir</button>
        <button class="explorer__menu-item" role="menuitem">Favoritos</button>
        <button class="explorer__menu-item" role="menuitem">Ferramentas</button>
        <button class="explorer__menu-item" role="menuitem">Ajuda</button>
      </div>
      <span class="explorer__menu-item--flag" aria-hidden="true">
        <img src="/images/xp/icons/browserflag.png" alt="" />
      </span>
    </div>

    <ExplorerToolbar
      :can-go-back="nav.canGoBack.value"
      :can-go-forward="nav.canGoForward.value"
      :can-go-up="nav.canGoUp.value"
      :is-trash-mode="isTrashMode"
      :view="view"
      :current-path-text="items.currentPathText.value"
      :current-path-icon="items.currentPathIcon.value"
      @back="goBack"
      @forward="goForward"
      @up="goUp"
      @change-view="(v) => (view = v)"
    />

    <div class="explorer__body">
      <div class="explorer__sidebar" aria-label="Painel lateral">
        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Tarefas de Arquivo e Pasta</div>
          <div class="explorer__sidebar-content">
            <button
              class="explorer__sidebar-link"
              @click="startCreate('folder')"
            >
              <img src="/images/xp/icons/new-folder.png" alt="" />
              Criar nova pasta
            </button>
            <button class="explorer__sidebar-link" @click="startCreate('file')">
              <img src="/images/xp/icons/file-text.png" alt="" />
              Criar novo arquivo
            </button>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Outros Locais</div>
          <div class="explorer__sidebar-content">
            <button class="explorer__sidebar-link" @click="navigateTo(null)">
              <img src="/images/xp/icons/mycomputer.png" alt="" />
              Meu Computador
            </button>
            <button class="explorer__sidebar-link" @click="navigateTo(1)">
              <img src="/images/xp/icons/my-documents.png" alt="" />
              Meus Documentos
            </button>
            <button class="explorer__sidebar-link" @click="navigateTo(0)">
              <img src="/images/xp/icons/recycle-bin-full.png" alt="" />
              Lixeira
            </button>
          </div>
        </div>

        <div class="explorer__sidebar-section">
          <div class="explorer__sidebar-title">Detalhes</div>
          <div v-if="selectedItemDetails" class="explorer__sidebar-detail">
            <strong>{{ selectedItemDetails.name }}</strong>
            <span>{{
              selectedItemDetails.type === 'folder'
                ? 'Pasta de arquivos'
                : 'Arquivo'
            }}</span>
          </div>
          <div v-else class="explorer__sidebar-detail">
            <strong>{{ items.currentPathText.value }}</strong>
            <span>{{
              nav.currentFolderId.value === null
                ? 'Pasta do Sistema'
                : 'Pasta de arquivos'
            }}</span>
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
        <div
          v-if="isCreatingFolder"
          class="explorer__icon explorer__icon--creating"
        >
          <div class="explorer__icon-wrapper">
            <img
              src="/images/xp/icons/folder.png"
              class="explorer__icon-img"
              alt=""
              aria-hidden="true"
            />
            <input
              v-model="newItemName"
              class="explorer__new-item-input"
              aria-label="Nome da nova pasta"
              @blur="confirmCreate('folder')"
              @keyup.enter="confirmCreate('folder')"
              @keyup.escape="cancelCreate"
            />
          </div>
        </div>

        <div
          v-else-if="isCreatingFile"
          class="explorer__icon explorer__icon--creating"
        >
          <div class="explorer__icon-wrapper">
            <img
              src="/images/xp/icons/file-text.png"
              class="explorer__icon-img"
              alt=""
              aria-hidden="true"
            />
            <input
              v-model="newItemName"
              class="explorer__new-item-input"
              aria-label="Nome do novo documento"
              @blur="confirmCreate('file')"
              @keyup.enter="confirmCreate('file')"
              @keyup.escape="cancelCreate"
            />
          </div>
        </div>

        <button
          v-for="item in items.sortedItems.value"
          :key="item.id"
          class="explorer__icon"
          role="gridcell"
          :class="{
            'explorer__icon--selected':
              sel.selectedItem.value === item.id ||
              sel.selectedItems.value.has(item.id),
            'explorer__icon--renaming': renamingItem === item.id,
            'explorer__icon--trash': isTrashMode,
          }"
          :aria-selected="
            sel.selectedItem.value === item.id ||
            sel.selectedItems.value.has(item.id)
          "
          @click="sel.selectItem(item.id, $event)"
          @dblclick="openItem(item)"
          @contextmenu="onRightClick($event, item)"
        >
          <div class="explorer__icon-wrapper">
            <span
              class="explorer__icon-img-wrapper"
              :style="{ '--icon-mask': `url(${item.icon})` }"
            >
              <img
                :src="item.icon"
                class="explorer__icon-img"
                alt=""
                aria-hidden="true"
              />
            </span>
            <input
              v-if="renamingItem === item.id"
              v-model="renameInput"
              class="explorer__icon-input"
              :aria-label="`Renomear ${item.name}`"
              @blur="saveRename"
              @keyup.enter="saveRename"
              @keyup.escape="renamingItem = null"
            />
            <span v-else class="explorer__icon-label">{{ item.name }}</span>
          </div>
        </button>

        <div
          v-if="
            items.sortedItems.value.length === 0 &&
            !isCreatingFolder &&
            !isCreatingFile
          "
          class="explorer__empty"
        >
          <p>Esta pasta está vazia.</p>
        </div>
      </div>

      <div
        v-else
        class="explorer__content explorer__content--list"
        role="grid"
        aria-label="Lista de arquivos"
      >
        <table class="explorer__table">
          <tbody>
            <tr
              v-for="item in items.sortedItems.value"
              :key="item.id"
              class="explorer__tr"
              :class="{
                'explorer__tr--selected':
                  sel.selectedItem.value === item.id ||
                  sel.selectedItems.value.has(item.id),
              }"
              :aria-selected="
                sel.selectedItem.value === item.id ||
                sel.selectedItems.value.has(item.id)
              "
              @click="sel.selectItem(item.id, $event)"
              @dblclick="openItem(item)"
              @contextmenu="onRightClick($event, item)"
            >
              <td class="explorer__td">
                <img
                  :src="item.icon"
                  class="explorer__list-icon"
                  alt=""
                  aria-hidden="true"
                />
                {{ item.name }}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="items.sortedItems.value.length === 0"
          class="explorer__empty"
        >
          <p>Esta pasta está vazia.</p>
        </div>
      </div>
    </div>

    <ExplorerContextMenu
      v-if="contextMenu.open"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :item-id="contextMenu.itemId"
      :is-trash-mode="isTrashMode"
      :current-folder-id="nav.currentFolderId.value"
      :has-clipboard="!!clip.clipboard.value"
      :get-item="(id) => fileSystem.getItem(id)"
      @open="openItem"
      @rename="startRename"
      @cut="clip.cutItems"
      @copy="clip.copyItems"
      @paste="clip.pasteItems(nav.currentFolderId.value)"
      @delete="deleteSelectedItems"
      @create-folder="startCreate('folder')"
      @create-file="startCreate('file')"
      @close="contextMenu.open = false"
    />
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
