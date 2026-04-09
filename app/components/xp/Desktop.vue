<script setup lang="ts">
import { useWindowlessApps } from '~/composables/useWindowlessApps'
import { useSounds } from '~/composables/useSounds'
import {
  useDesktopIcons,
  useDesktopSelection,
  useDesktopRename,
  useDesktopTrash,
  useDesktopShortcuts
} from '~/composables/desktop'

const store = useWindowsStore()
const { isWindowlessAppOpen, openWindowlessApp } = useWindowlessApps()
const { playOpen, playNotification } = useSounds()
const notifStore = useNotificationsStore()

const desktopRef = ref<HTMLElement | null>(null)

const currentRenameInput = computed(() => {
  if (!renamingItem.value) return null
  const iconEl = document.querySelector(`[data-desktop-icon-id="${renamingItem.value}"]`)
  const input = iconEl?.querySelector('input')
  return input as HTMLInputElement | null
})

const {
  desktopIcons,
  visibleIcons,
  contextMenu,
  loadFromStorage,
  saveToStorage,
  onRightClick,
  onIconRightClick,
  openItem,
  createFolder,
  createTextDocument,
  sortByName,
  sortBySize,
  sortByType,
  sortByModified,
} = useDesktopIcons({ store, openWindowlessApp, playOpen })

const {
  renamingItem,
  renameInput,
  startRename,
  saveRename,
  cancelRename,
} = useDesktopRename({
  desktopIcons,
  saveToStorage,
  getInputElement: () => currentRenameInput.value,
  onCancel: () => { focusedIconIndex.value = null },
})

const {
  selectedIcons,
  focusedIconIndex,
  iconElements,
  selectionBox,
  toggleIconSelection,
  onDesktopMouseDown,
  onDesktopMouseMove,
  onDesktopMouseUp,
  handleDesktopKeydown,
} = useDesktopSelection({
  visibleIcons,
  renamingItem,
  contextMenu,
  openItem,
  startRename,
})

const {
  deleteIcon,
  restoreFromTrash,
  emptyTrash,
} = useDesktopTrash({
  desktopIcons,
  saveToStorage,
  selectedIcons,
  playNotification,
  notifStore,
})

useDesktopShortcuts({
  selectedIcons,
  focusedIconIndex,
  visibleIcons,
  deleteIcon,
  playNotification,
  notifStore,
})

onMounted(() => {
  loadFromStorage()
})

function handleDesktopClick() {
  contextMenu.value.open = false
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
    @click="handleDesktopClick"
    @keydown="handleDesktopKeydown"
    @mousedown="onDesktopMouseDown($event, desktopRef)"
    @mousemove="onDesktopMouseMove($event)"
    @mouseup="onDesktopMouseUp"
  >
    <div class="desktop__wallpaper" />

    <div class="desktop__icons" role="toolbar" aria-label="Ícones da área de trabalho">
      <button
        v-for="(item, index) in visibleIcons"
        :key="item.id"
        :ref="el => { if (el) iconElements.set(item.id, el as HTMLElement) }"
        :data-desktop-icon-id="item.id"
        :class="['desktop__icon', {
          'desktop__icon--renaming': renamingItem === item.id,
          'desktop__icon--focused': focusedIconIndex === index,
          'desktop__icon--selected': selectedIcons.has(item.id)
        }]"
        :aria-label="`${item.label}, clique duas vezes para abrir`"
        :tabindex="focusedIconIndex === index || (focusedIconIndex === null && index === 0) ? 0 : -1"
        @dblclick="openItem(item)"
        @contextmenu="onIconRightClick($event, item)"
        @click="toggleIconSelection(item.id, $event)"
        @focus="focusedIconIndex = index"
      >
        <span class="desktop__icon-img-wrapper" :style="{ '--icon-mask': `url(${item.icon})` }">
          <img :src="item.icon" class="desktop__icon-img" :alt="item.label" />
        </span>

        <template v-if="renamingItem === item.id">
          <label :for="`desktop-rename-${item.id}`" class="visually-hidden">
            Renomear {{ item.label }}
          </label>
          <input
            :id="`desktop-rename-${item.id}`"
            v-model="renameInput"
            class="desktop__icon-input"
            :aria-label="`Renomear para ${item.label}`"
            @blur="saveRename(item.id)"
            @keyup.enter="saveRename(item.id)"
            @keyup.escape="cancelRename"
          />
        </template>
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

    <XpWindow v-for="win in store.openWindows" :key="win.id" :window-id="win.id">
      <XpAppsNotepad     :win="win" v-if="win.app === 'notepad'" />
      <XpAppsMinesweeper :win="win" v-if="win.app === 'minesweeper'" />
      <XpAppsPaint       :win="win" v-if="win.app === 'paint'" />
      <XpAppsIe          :win="win" v-if="win.app === 'ie'" />
      <XpAppsExplorer    :win="win" v-if="win.app === 'explorer'" />
      <XpAppsMsn         :win="win" v-if="win.app === 'msn'" />
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
      :on-rename="startRename"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/Desktop.scss';
</style>