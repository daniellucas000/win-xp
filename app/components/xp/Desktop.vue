<script setup lang="ts">
import type { AppName } from '~/stores/windows'

const store = useWindowsStore()

const contextMenu = ref({ open: false, x: 0, y: 0 })

const desktopIcons: { icon: string; label: string; app: AppName }[] = [
  { icon: '/images/xp/icons/recycle-bin-empty.png',   label: 'Lixeira',       app: 'explorer' },
  { icon: '/images/xp/icons/mycomputer.png',        label: 'Meu computador',       app: 'explorer' },
  { icon: '/images/xp/icons/iexplorer.png', label: 'Internet Explorer', app: 'ie' },
  { icon: '/images/xp/icons/notepad.png',           label: 'Bloco de notas',           app: 'notepad' },
  { icon: '/images/xp/icons/paint.png',             label: 'Paint',             app: 'paint' },
  { icon: '/images/xp/icons/minesweeper.png',       label: 'Campo minado',       app: 'minesweeper' },
  { icon: '/images/xp/icons/media-player.png',               label: 'Media Player',      app: 'mediaplayer' },
]

function onRightClick(e: MouseEvent) {
  e.preventDefault()
  contextMenu.value = { open: true, x: e.clientX, y: e.clientY }
}

function closeContext() {
  contextMenu.value.open = false
}
</script>

<template>
  <div
    class="desktop"
    @contextmenu="onRightClick"
    @click="closeContext"
  >
    <!-- Wallpaper -->
    <div class="desktop__wallpaper" />

    <!-- Ícones -->
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
      <XpAppsMinesweeper  v-else-if="win.app === 'minesweeper'" />
      <XpAppsPaint        v-else-if="win.app === 'paint'" />
      <XpAppsIe           v-else-if="win.app === 'ie'" />
      <XpAppsMediaPlayer  v-else-if="win.app === 'mediaplayer'" />
      <XpAppsExplorer     v-else-if="win.app === 'explorer'" />
    </XpWindow>

    <!-- Context Menu -->
    <XpContextMenu
      v-if="contextMenu.open"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @close="closeContext"
    />
  </div>
</template>

<style lang="scss" scoped>
.desktop {
  position: absolute;
  inset: 0;
  bottom: 30px;
  overflow: hidden;

  &__wallpaper {
    position: absolute;
    inset: 0;
    background-image: url('/images/wallpapers/Bliss.jpg');
    background-size: cover;
    background-position: center;
  }

  &__icons {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 8px;
    gap: 4px;
  }

  &__icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    height: 80px;
    padding: 4px;
    cursor: default;
    border-radius: 4px;
    background: none;
    border: none;

    &:hover {
      background: rgba(49, 106, 197, 0.3);
    }

    &:focus {
      background: rgba(49, 106, 197, 0.5);
      outline: 1px dotted white;
    }
  }

  &__icon-img {
    width: 40px;
    height: 40px;
  }

  &__icon-label {
    color: white;
    font-size: 11px;
    text-align: center;
    text-shadow: 1px 1px 2px black;
    line-height: 1.2;
    margin-top: 4px;
    word-break: break-word;
    max-width: 100%;
  }
}
</style>