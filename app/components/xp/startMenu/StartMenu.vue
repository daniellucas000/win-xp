<script setup lang="ts">
import { ref } from 'vue';
import { pinnedApps, rightApps, allPrograms } from '~/data/startMenu';
import type { AppName } from '~/stores/windows';
import { useWindowlessApps } from '~/composables/useWindowlessApps';
import StartMenuItem from './StartMenuItem.vue';
import StartMenuAllPrograms from './StartMenuAllPrograms.vue';

const open = defineModel<boolean>();
const store = useWindowsStore();
const { openWindowlessApp } = useWindowlessApps();

const WINDOWLESS_APPS = new Set<AppName>(['mediaplayer']);

const showAllPrograms = ref(false);
let timeout: number | null = null;

function openAllPrograms() {
  if (timeout) clearTimeout(timeout);
  showAllPrograms.value = true;
}

function closeAllPrograms() {
  timeout = window.setTimeout(() => {
    showAllPrograms.value = false;
  }, 150);
}

function launch(app: AppName) {
  if (WINDOWLESS_APPS.has(app)) {
    openWindowlessApp(app);
  } else {
    store.open(app);
  }

  open.value = false;
}
</script>

<template>
  <div class="start-menu">
    <!-- Header -->
    <div class="start-menu__header">
      <img
        src="/images/xp/avatar.jpg"
        class="start-menu__avatar"
        alt="Foto do usuário"
      />
      <span class="start-menu__username">Daniel</span>
    </div>

    <div class="start-menu__header-divider" />

    <!-- Body -->
    <div class="start-menu__body">
      <!-- LEFT -->
      <div class="start-menu__left">
        <StartMenuItem
          v-for="app in pinnedApps"
          :key="app.id"
          v-bind="app"
          large
          @click="launch"
        />

        <div class="start-menu__divider" role="separator" />

        <StartMenuAllPrograms
          :items="allPrograms"
          :open="showAllPrograms"
          @open="openAllPrograms"
          @close="closeAllPrograms"
          @select="launch"
        />
      </div>

      <div class="start-menu__col-divider" role="separator" />

      <!-- RIGHT -->
      <div class="start-menu__right">
        <StartMenuItem
          v-for="app in rightApps"
          :key="app.id"
          v-bind="app"
          @click="launch"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="start-menu__footer">
      <button class="start-menu__footer-btn">
        <img
          src="/images/xp/icons/log-off.png"
          class="start-menu__item-icon"
          alt=""
          aria-hidden="true"
        />
        <span>Fazer logoff</span>
      </button>

      <button class="start-menu__footer-btn">
        <img
          src="/images/xp/icons/power-off.png"
          class="start-menu__item-icon"
          alt=""
          aria-hidden="true"
        />
        <span>Desligar o computador</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/css/components/xp/StartMenu.scss';
</style>
