<script setup lang="ts">
import type { AppName } from '~/stores/windows'

const store = useWindowsStore()

const contextMenu = ref({ open: false, x: 0, y: 0 })

const desktopIcons: { icon: string; label: string; app: AppName }[] = [
  { icon: '/images/xp/icons/recycle-bin-empty.png',   label: 'Lixeira',       app: 'explorer' },
  { icon: '/images/xp/icons/mycomputer.png',        label: 'Meu computador',       app: 'explorer' },
  { icon: '/images/xp/icons/iexplorer.png', label: 'Internet Explorer', app: 'ie' },
  { icon: '/images/xp/icons/msn.png', label: 'MSN Messenger', app: 'msn' },
  { icon: '/images/xp/icons/notepad.png',           label: 'Bloco de notas',           app: 'notepad' },
  { icon: '/images/xp/icons/paint.png',             label: 'Paint',             app: 'paint' },
  { icon: '/images/xp/icons/minesweeper.png',       label: 'Campo minado',       app: 'minesweeper' },
  { icon: '/images/xp/icons/media-player.png',               label: 'Media Player',      app: 'mediaplayer' },
]

function onRightClick(e: MouseEvent) {
  e.preventDefault()
  contextMenu.value = { open: true, x: e.clientX, y: e.clientY }
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
        v-for="item in desktopIcons"
        :key="item.label"
        class="desktop__icon"
        @dblclick="store.open(item.app)"
      >
        <img :src="item.icon" class="desktop__icon-img" />
        <span class="desktop__icon-label">{{ item.label }}</span>
      </button>
    </div>

    <!-- Janelas abertas -->
    <XpWindow
      v-for="win in store.openWindows"
      :key="win.id"
      :win="win"
    >
      <XpAppsNotepad      v-if="win.app === 'notepad'" />
      <XpAppsMinesweeper  v-if="win.app === 'minesweeper'" />
      <XpAppsPaint        v-if="win.app === 'paint'" />
      <XpAppsIe           v-if="win.app === 'ie'" />
      <XpAppsMediaPlayer  v-if="win.app === 'mediaplayer'" />
      <XpAppsExplorer     v-if="win.app === 'explorer'" />
      <XpAppsMsn          v-if="win.app === 'msn'" />
    </XpWindow>

    <XpContextMenu
      v-if="contextMenu.open"
      v-model="contextMenu.open"
      :x="contextMenu.x"
      :y="contextMenu.y"
    />
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/Desktop.scss';
</style>
