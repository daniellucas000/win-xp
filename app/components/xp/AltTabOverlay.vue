<script setup lang="ts">
const winStore = useWindowsStore()
const { playClick } = useSounds()

const selectedIndex = ref(0)

const visibleWindows = computed(() => winStore.windows.filter(w => !w.minimized))

function selectWindow(index: number) {
  selectedIndex.value = index
}

function activateWindow() {
  const win = visibleWindows.value[selectedIndex.value]
  if (win) {
    playClick()
    winStore.focusWindow(win.id)
    emit('close')
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const dir = e.shiftKey ? -1 : 1
    const len = visibleWindows.value.length
    selectedIndex.value = (selectedIndex.value + dir + len) % len
  } else if (e.key === 'Enter') {
    activateWindow()
  }
}

const emit = defineEmits<{ close: [] }>()

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="alt-tab-overlay" @click="emit('close')">
    <div class="alt-tab-box" @click.stop>
      <div class="alt-tab-windows">
        <button
          v-for="(win, index) in visibleWindows"
          :key="win.id"
          class="alt-tab-item"
          :class="{ 'alt-tab-item--selected': index === selectedIndex }"
          @click="selectWindow(index)"
          @dblclick="activateWindow()"
        >
          <div class="alt-tab-item__preview">
            <img src="/images/xp/icons/mycomputer-small.png" alt="" />
          </div>
          <span class="alt-tab-item__title">{{ win.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/_variables.scss';

.alt-tab-overlay {
  position: fixed;
  inset: 0;
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
}

.alt-tab-box {
  background: $xp-bg;
  border: 1px solid $xp-border-darker;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.alt-tab-windows {
  display: flex;
  gap: 8px;
}

.alt-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 8px 4px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-family: $xp-font;
  font-size: 11px;

  &--selected {
    background: #e8e8e8;
    border-color: $xp-taskbar-blue;
  }

  &:hover {
    border-color: $xp-taskbar-blue;
  }
}

.alt-tab-item__preview {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;

  img {
    width: 32px;
    height: 32px;
  }
}

.alt-tab-item__title {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  color: #000;
}
</style>
