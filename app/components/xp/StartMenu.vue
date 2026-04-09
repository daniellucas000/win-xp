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
      <img
        src="/images/xp/avatar.jpg"
        class="start-menu__avatar"
        alt="Foto do usuário"
      />
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
          <img :src="app.icon" class="start-menu__item-icon start-menu__item-icon--lg" :alt="app.label" />
          <span>{{ app.label }}</span>
        </button>

        <div class="start-menu__divider" role="separator" />

        <div
          class="start-menu__item start-menu__item--all-programs"
          :class="{ 'start-menu__item--active': showAllPrograms }"
          @mouseenter="showAllPrograms = true"
          @mouseleave="showAllPrograms = false"
        >
          <button
            class="start-menu__all-programs-trigger"
            :aria-expanded="showAllPrograms"
            aria-haspopup="true"
          >
            <span class="start-menu__item--bold">All Programs</span>
            <img src="/images/xp/icons/program-arrow.png" alt="" aria-hidden="true" />
          </button>

          <div
            v-if="showAllPrograms"
            class="start-menu__all-programs"
            role="menu"
          >
            <button
              v-for="prog in allPrograms"
              :key="prog.label"
              class="start-menu__item"
              role="menuitem"
              @click="launch(prog.app)"
            >
              <img :src="prog.icon" class="start-menu__item-icon" :alt="prog.label" />
              <span>{{ prog.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="start-menu__col-divider" role="separator" />

      <div class="start-menu__right">
        <button
          v-for="app in rightApps"
          :key="app.label"
          class="start-menu__item"
          :class="{ 'start-menu__item--bold': app.bold }"
          @click="launch(app.app)"
        >
          <img :src="app.icon" class="start-menu__item-icon" :alt="app.label" />
          <span>{{ app.label }}</span>
        </button>
      </div>
    </div>

    <div class="start-menu__footer">
      <button class="start-menu__footer-btn">
        <img src="/images/xp/icons/log-off.png" class="start-menu__item-icon" alt="" aria-hidden="true" />
        <span>Log Off</span>
      </button>
      <button class="start-menu__footer-btn">
        <img src="/images/xp/icons/power-off.png" class="start-menu__item-icon" alt="" aria-hidden="true" />
        <span>Turn Off Computer</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/StartMenu.scss';
</style>