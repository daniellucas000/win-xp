<script setup lang="ts">
import { pinnedApps, rightApps, allPrograms } from '~/data/startMenu'
import type { AppName } from '~/stores/windows'
import { useWindowlessApps } from '~/composables/useWindowlessApps'

const open = defineModel<boolean>()
const store = useWindowsStore()
const { openWindowlessApp } = useWindowlessApps()

const showAllPrograms = ref(false)

function launch(app: AppName) {
  if (app === 'mediaplayer') {
    openWindowlessApp(app)
  } else {
    store.open(app)
  }
  open.value = false
}
</script>

<template>
  <div class="start-menu">
    <div class="start-menu__header">
      <img src="https://preview.redd.it/windows-xp-account-picture-in-full-resolution-the-original-v0-tbzkv5zf8oc51.jpg?width=2800&format=pjpg&auto=webp&s=eedf636413fc123036e992d628678562a379ecb7" class="start-menu__avatar" />
      <span class="start-menu__username">Daniel</span>
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
          <span class="start-menu__arrow">
            <span class="start-menu__item--bold">All Programs</span>
            <img src="/images/xp/icons/program-arrow.png" alt="">
          </span>

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
@import '~/assets/css/components/xp/StartMenu.scss';
</style>
