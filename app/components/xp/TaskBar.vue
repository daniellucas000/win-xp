<script setup lang="ts">
const winStore = useWindowsStore()
const startMenuOpen = ref(false)
const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

function toggleStart() {
  startMenuOpen.value = !startMenuOpen.value
}

function handleShowDesktop() {
  winStore.toggleShowDesktop()
}
</script>

<template>
  <div class="taskbar" @click.stop>

    <button class="taskbar__start" aria-label="Menu Iniciar" @click="toggleStart" />

    <button
      class="taskbar__show-desktop"
      aria-label="Mostrar desktop"
      title="Mostrar desktop"
      @click="handleShowDesktop"
    >
      <img src="/images/xp/icons/desktop.png" alt="" />
    </button>

    <div class="taskbar__windows" role="toolbar" aria-label="Janelas abertas">
      <button
        v-for="win in winStore.taskbarWindows"
        :key="win.id"
        class="taskbar__window-btn"
        :class="{ 'taskbar__window-btn--active': win.focused && !win.minimized }"
        :aria-label="`${win.title}, clique para minimizar`"
        @click="winStore.minimize(win.id)"
      >
        <span class="taskbar__window-title">{{ win.title }}</span>
        <div v-if="win.progress !== undefined" class="taskbar__window-progress">
          <div class="taskbar__window-progress-bar" :style="{ width: `${win.progress}%` }" />
        </div>
      </button>
    </div>

    <div class="taskbar__tray" aria-label="Área de notificação">
      <img src="/images/xp/icons/tour-xp-small.png" class="taskbar__tray-icon" alt="" aria-hidden="true" />
      <img src="/images/xp/icons/sound-small.png" class="taskbar__tray-icon" alt="" aria-hidden="true" />
      <time class="taskbar__time" :aria-label="`Hora atual: ${currentTime}`">{{ currentTime }}</time>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="start-menu">
      <XpStartMenu v-if="startMenuOpen" v-model="startMenuOpen" />
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="startMenuOpen"
      class="start-overlay"
      @click="startMenuOpen = false"
    />
  </Teleport>

  <XpNotificationBalloon />
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/TaskBar.scss';
</style>
