<script setup lang="ts">
const store = useWindowsStore()
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


</script>

<template>
  <div class="taskbar" @click.stop>

    <button class="taskbar__start" @click="toggleStart" />

    <div class="taskbar__windows">
      <button
        v-for="win in store.taskbarWindows"
        :key="win.id"
        class="taskbar__window-btn"
        :class="{ 'taskbar__window-btn--active': win.focused && !win.minimized }"
        @click="store.minimize(win.id)"
      >
        <span class="taskbar__window-title">{{ win.title }}</span>
      </button>
    </div>

    <div class="taskbar__tray">
      <img src="/images/xp/icons/tour-xp-small.png" class="taskbar__tray-icon" />
      <img src="/images/xp/icons/sound-small.png" class="taskbar__tray-icon" />
      <span class="taskbar__time">{{ currentTime }}</span>
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
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/TaskBar.scss';
</style>
