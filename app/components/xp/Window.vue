<script setup lang="ts">
import { useDrag } from '~/composables/useDrag'
import { useResize } from '~/composables/useResize'

const props = defineProps<{ windowId: string }>()

const windowsStore = useWindowsStore()
const { playClose } = useSounds()

const windowState = computed(() => windowsStore.windows.find(w => w.id === props.windowId))

const { start: startDrag } = useDrag(
  (x, y) => windowsStore.updatePosition(props.windowId, x, y)
)

const { start: startResize } = useResize(
  (x, y, w, h) => windowsStore.updatePositionAndSize(props.windowId, x, y, w, h)
)

const maximizeIcon = computed(() =>
  windowState.value?.maximized ? '/images/xp/icons/maximized.png' : '/images/xp/icons/maximize.png'
)

function onTitlebarMousedown(e: MouseEvent) {
  if (!windowState.value || windowState.value.maximized) return
  windowsStore.focusWindow(props.windowId)
  startDrag(e, windowState.value.x, windowState.value.y)
}

function onResizeMousedown(e: MouseEvent, dir: string) {
  if (!windowState.value) return
  windowsStore.focusWindow(props.windowId)
  startResize(e, dir as any, windowState.value.x, windowState.value.y, windowState.value.width, windowState.value.height)
}

function onClose() {
  playClose()
  windowsStore.close(props.windowId)
}

function onMinimize() {
  windowsStore.minimize(props.windowId)
}

function onMaximize() {
  windowsStore.maximize(props.windowId)
}
</script>

<template>
  <Transition name="window" @after-leave="() => {}">
    <div
      v-if="windowState && !windowState.minimized"
      class="window"
      :class="{ 'window--maximized': windowState.maximized, 'window--focused': windowState.focused }"
      role="dialog"
      :aria-label="windowState.title"
      :style="{
        left:   windowState.maximized ? '0'                    : `${windowState.x}px`,
        top:    windowState.maximized ? '0'                    : `${windowState.y}px`,
        width:  windowState.maximized ? '100vw'                : `${windowState.width}px`,
        height: windowState.maximized ? 'calc(100vh - 30px)'   : `${windowState.height}px`,
        zIndex: windowState.zIndex,
      }"
      @mousedown="windowsStore.focusWindow(windowState.id)"
    >
      <div
        class="window__titlebar"
        :class="windowState.focused ? 'window__titlebar--active' : 'window__titlebar--inactive'"
        @mousedown="onTitlebarMousedown"
        @dblclick="onMaximize"
      >
        <h4 class="window__title">
          <img
            :src="windowState.icon"
            alt=""
            aria-hidden="true"
          >
          {{ windowState.title }}
        </h4>

        <div class="window__controls">
          <button class="window__btn window__btn--minimize" aria-label="Minimizar" @click.stop="onMinimize">
            <img src="/images/xp/icons/minimize.png" alt="" aria-hidden="true">
          </button>
          <button class="window__btn window__btn--maximize" :aria-label="windowState.maximized ? 'Restaurar' : 'Maximizar'" @click.stop="onMaximize">
            <img :src="maximizeIcon" alt="" aria-hidden="true">
          </button>
          <button class="window__btn window__btn--close" aria-label="Fechar" @click.stop="onClose">
            <span><img src="/images/xp/icons/close.png" alt="" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <div class="window__body">
        <slot />
      </div>

      <div v-if="windowState.progress !== undefined" class="window__progress">
        <div class="window__progress-bar" :style="{ width: `${windowState.progress}%` }" />
      </div>

      <div v-if="!windowState.maximized" class="window__resize window__resize--n" @mousedown="onResizeMousedown($event, 'n')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--s" @mousedown="onResizeMousedown($event, 's')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--e" @mousedown="onResizeMousedown($event, 'e')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--w" @mousedown="onResizeMousedown($event, 'w')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--ne" @mousedown="onResizeMousedown($event, 'ne')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--nw" @mousedown="onResizeMousedown($event, 'nw')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--se" @mousedown="onResizeMousedown($event, 'se')" />
      <div v-if="!windowState.maximized" class="window__resize window__resize--sw" @mousedown="onResizeMousedown($event, 'sw')" />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/Window.scss';

.window-enter-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.window-leave-active {
  transition: opacity 0.12s ease-in, transform 0.12s ease-in;
}

.window-enter-from {
  opacity: 0;
  transform: scale(0.92);
}

.window-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.window__progress {
  height: 3px;
  background: #d8d2bd;
  position: relative;
  overflow: hidden;
}

.window__progress-bar {
  height: 100%;
  background: linear-gradient(180deg, #7ec050 0%, #5a9e2f 100%);
  transition: width 0.2s ease;
}
</style>
