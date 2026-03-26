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

function closeStart() {
  startMenuOpen.value = false
}
</script>

<template>
  <div class="taskbar" @click.stop>

    <!-- Botão Start -->
    <button class="taskbar__start" @click="toggleStart" />

    <!-- Janelas abertas -->
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

    <!-- System Tray -->
    <div class="taskbar__tray">
      <img src="/images/xp/icons/TourXP.png"      class="taskbar__tray-icon" />
      <img src="/images/xp/icons/SecurityError.png" class="taskbar__tray-icon" />
      <img src="/images/xp/icons/Volume.png"       class="taskbar__tray-icon" />
      <span class="taskbar__time">{{ currentTime }}</span>
    </div>
  </div>

  <!-- Start Menu fora do taskbar -->
  <Teleport to="body">
    <Transition name="start-menu">
      <XpStartMenu v-if="startMenuOpen" @close="closeStart" />
    </Transition>
  </Teleport>

  <!-- Overlay para fechar o menu ao clicar fora -->
  <Teleport to="body">
    <div
      v-if="startMenuOpen"
      class="start-overlay"
      @click="closeStart"
    />
  </Teleport>
</template>

<style lang="scss" scoped>
.taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 9998;
  background: linear-gradient(
    to bottom,
    #1f6fd4 0%,
    #3b85e8 4%,
    #2970d8 6%,
    #2970d8 90%,
    #1a4faa 100%
  );

  &__start {
    width: 100px;
    height: 100%;
    flex-shrink: 0;
    cursor: default;
    background-image: url('/images/xp/start_btn_normal.png');
    background-size: cover;
    background-repeat: no-repeat;
    border: none;

    &:hover {
      filter: brightness(1.1);
    }

    &:active {
      filter: brightness(0.95);
    }
  }

  &__windows {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    padding: 3px 2px 0;
    overflow: hidden;
  }

  &__window-btn {
    height: 22px;
    min-width: 100px;
    max-width: 150px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    cursor: default;
    border-radius: 3px 3px 0 0;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: linear-gradient(to bottom, #1a55b0, #2a65c0);
    color: white;
    font-size: 11px;

    &--active {
      background: linear-gradient(to bottom, #3a70d4, #4a80e0);
      border-color: rgba(255, 255, 255, 0.5);
    }

    &:hover {
      filter: brightness(1.1);
    }
  }

  &__window-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  &__tray {
    flex-shrink: 0;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 8px;
    gap: 4px;
    background: linear-gradient(to bottom, #1252a4, #1f5fbe);
    border-left: 1px solid #0a3d8f;
  }

  &__tray-icon {
    width: 16px;
    height: 16px;
  }

  &__time {
    color: white;
    font-size: 11px;
    white-space: nowrap;
    padding: 0 4px;
  }
}

.start-overlay {
  position: fixed;
  inset: 0;
  z-index: 9997;
}
</style>

<style>
.start-menu-enter-active,
.start-menu-leave-active {
  transition: opacity 0.1s, transform 0.1s;
}
.start-menu-enter-from,
.start-menu-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>