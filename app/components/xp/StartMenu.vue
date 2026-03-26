<script setup lang="ts">
import type { AppName } from '~/stores/windows'

const emit = defineEmits<{ close: [] }>()
const store = useWindowsStore()

const pinnedApps: { icon: string; label: string; app: AppName; bold?: boolean }[] = [
  { icon: '/images/xp/icons/iexplorer.png', label: 'Internet Explorer',  app: 'ie',          bold: true },
  { icon: '/images/xp/icons/MSWord.png',            label: 'Microsoft Word 2003', app: 'notepad',     bold: true },
  { icon: '/images/xp/icons/MSNMessenger.png',      label: 'Internet Messenger',  app: 'ie' },
  { icon: '/images/xp/icons/media-player.png',               label: 'Media Player Classic', app: 'mediaplayer' },
  { icon: '/images/xp/icons/FoxitReader.png',       label: 'Foxit Reader',         app: 'notepad' },
  { icon: '/images/xp/icons/paint.png',             label: 'Paint',                app: 'paint' },
  { icon: '/images/xp/icons/TourXP.png',            label: 'Tour Windows XP',      app: 'ie' },
]

const rightApps: { icon: string; label: string; app: AppName; bold?: boolean }[] = [
  { icon: '/images/xp/icons/my-pictures.png',      label: 'My Pictures',       app: 'explorer',     bold: true },
  { icon: '/images/xp/icons/my-musics.png',         label: 'My Music',          app: 'mediaplayer',  bold: true },
  { icon: '/images/xp/icons/mycomputer.png',      label: 'My Computer',       app: 'explorer',     bold: true },
  { icon: '/images/xp/icons/DisplayProperties.png', label: 'Display Properties', app: 'explorer' },
  { icon: '/images/xp/icons/Programs.png',        label: 'Installer',         app: 'explorer' },
  { icon: '/images/xp/icons/HelpandSupport.png',  label: 'Help and Support',  app: 'notepad' },
  { icon: '/images/xp/icons/Run.png',             label: 'Run...',            app: 'notepad' },
]

const allPrograms: { icon: string; label: string; app: AppName }[] = [
  { icon: '/images/xp/icons/minesweeper.png', label: 'Minesweeper',   app: 'minesweeper' },
  { icon: '/images/xp/icons/paint.png',       label: 'Paint',         app: 'paint' },
  { icon: '/images/xp/icons/notepad.png',     label: 'Notepad',       app: 'notepad' },
  { icon: '/images/xp/icons/media-player.png',         label: 'Media Player',  app: 'mediaplayer' },
]

const showAllPrograms = ref(false)

function launch(app: AppName) {
  store.open(app)
  emit('close')
}
</script>

<template>
  <div class="start-menu">
    <div class="start-menu__header">
      <!-- <img src="/files/profiles/chess.png" class="start-menu__avatar" /> -->
      <span class="start-menu__username">Administrator</span>
    </div>

    <div class="start-menu__header-divider" />

    <div class="start-menu__body">

      <div class="start-menu__left">
        <button
          v-for="app in pinnedApps"
          :key="app.label"
          class="start-menu__item"
          :class="{ 'start-menu__item--bold': app.bold }"
          @click="launch(app.app)"
        >
          <img :src="app.icon" class="start-menu__item-icon start-menu__item-icon--lg" />
          <span>{{ app.label }}</span>
        </button>

        <div class="start-menu__divider" />

        <div
          class="start-menu__item start-menu__item--all-programs"
          :class="{ 'start-menu__item--active': showAllPrograms }"
          @mouseenter="showAllPrograms = true"
          @mouseleave="showAllPrograms = false"
        >
          <span class="start-menu__item--bold">All Programs</span>
          <span class="start-menu__arrow">▶</span>

          <div v-if="showAllPrograms" class="start-menu__all-programs">
            <button
              v-for="prog in allPrograms"
              :key="prog.label"
              class="start-menu__item"
              @click="launch(prog.app)"
            >
              <img :src="prog.icon" class="start-menu__item-icon" />
              <span>{{ prog.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="start-menu__col-divider" />

      <div class="start-menu__right">
        <button
          v-for="app in rightApps"
          :key="app.label"
          class="start-menu__item"
          :class="{ 'start-menu__item--bold': app.bold }"
          @click="launch(app.app)"
        >
          <img :src="app.icon" class="start-menu__item-icon" />
          <span>{{ app.label }}</span>
        </button>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="start-menu__footer">
      <button class="start-menu__footer-btn">
        <img src="/images/xp/icons/log-off.png" class="start-menu__item-icon" />
        <span>Log Off</span>
      </button>
      <button class="start-menu__footer-btn">
        <img src="/images/xp/icons/power-off.png" class="start-menu__item-icon" />
        <span>Turn Off Computer</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.start-menu {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 380px;
  height: 500px;
  display: flex;
  flex-direction: column;
  background: #4282d6;
  border-radius: 8px 8px 0 0;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.5);
  z-index: 9999;

  &__header {
    position: relative;
    height: 65px;
    flex-shrink: 0;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(to right, #245cdc, #3d7fe8);
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    position: absolute;
    top: 9px;
    left: 9px;
    border: 2px solid white;
  }

  &__username {
    position: absolute;
    left: 80px;
    top: 22px;
    color: white;
    font-weight: bold;
    font-size: 14px;
    font-family: 'Trebuchet MS', sans-serif;
    text-shadow: 2px 2px rgba(0, 0, 0, 0.5);
  }

  &__header-divider {
    height: 3px;
    flex-shrink: 0;
    background: linear-gradient(to right, transparent, #da884a, transparent);
  }

  &__body {
    flex: 1;
    display: flex;
    background: #f8f8f0;
    margin: 0 2px;
    overflow: hidden;
  }

  &__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #d3e5fa;
    overflow: hidden;
  }

  &__col-divider {
    width: 1px;
    background: #c0c0c0;
    flex-shrink: 0;
  }

  &__divider {
    height: 1px;
    background: #c0c0c0;
    margin: 2px 8px;
    flex-shrink: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    cursor: default;
    font-size: 11px;
    color: black;
    background: none;
    border: none;
    text-align: left;
    width: 100%;
    flex-shrink: 0;

    &:hover {
      background: #316ac5;
      color: white;
    }

    &--bold span {
      font-weight: bold;
    }

    &--all-programs {
      position: relative;
      margin-top: auto;
      padding: 6px 8px;

      &:hover {
        background: #316ac5;
        color: white;
      }
    }

    &--active {
      background: #316ac5;
      color: white;
    }
  }

  &__item-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;

    &--lg {
      width: 32px;
      height: 32px;
    }
  }

  &__arrow {
    margin-left: auto;
    font-size: 9px;
  }

  &__all-programs {
    position: absolute;
    left: 100%;
    bottom: 0;
    width: 200px;
    background: #f8f8f0;
    border: 1px solid #316ac5;
    border-left-width: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10000;
  }

  &__footer {
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 8px;
    gap: 8px;
    background: linear-gradient(to bottom, #4282d6, #0f61cb);
  }

  &__footer-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: none;
    border: none;
    color: white;
    font-size: 11px;
    cursor: default;
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>