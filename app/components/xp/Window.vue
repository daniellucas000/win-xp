<script setup lang="ts">
import type { WindowState } from '~/stores/windows'
import { useDrag } from '~/composables/useDrag'
import { useResize } from '~/composables/useResize'

const props = defineProps<{ win: WindowState }>()

const store = useWindowsStore()
const { playClose } = useSounds()

const { start: startDrag } = useDrag(
  (x, y) => store.updatePosition(props.win.id, x, y)
)

const { start: startResize } = useResize(
  (x, y, w, h) => store.updatePositionAndSize(props.win.id, x, y, w, h)
)

const maximizeIcon = computed(() =>
  props.win.maximized ? '/images/xp/icons/maximized.png' : '/images/xp/icons/maximize.png'
)

function onTitlebarMousedown(e: MouseEvent) {
  if (props.win.maximized) return
  store.focusWindow(props.win.id)
  startDrag(e, props.win.x, props.win.y)
}

function onResizeMousedown(e: MouseEvent, dir: string) {
  store.focusWindow(props.win.id)
  startResize(e, dir as any, props.win.x, props.win.y, props.win.width, props.win.height)
}

function onClose() {
  playClose()
  store.close(props.win.id)
}

function onMinimize() {
  store.minimize(props.win.id)
}

function onMaximize() {
  store.maximize(props.win.id)
}
</script>

<template>
  <Transition name="window" @after-leave="() => {}">
    <div
      v-if="!win.minimized"
      class="window"
      :class="{ 'window--maximized': win.maximized, 'window--focused': win.focused }"
      role="dialog"
      :aria-label="win.title"
      :style="{
        left:   win.maximized ? '0'                    : `${win.x}px`,
        top:    win.maximized ? '0'                    : `${win.y}px`,
        width:  win.maximized ? '100vw'                : `${win.width}px`,
        height: win.maximized ? 'calc(100vh - 30px)'   : `${win.height}px`,
        zIndex: win.zIndex,
      }"
      @mousedown="store.focusWindow(win.id)"
    >
      <div
        class="window__titlebar"
        :class="win.focused ? 'window__titlebar--active' : 'window__titlebar--inactive'"
        @mousedown="onTitlebarMousedown"
        @dblclick="onMaximize"
      >
        <h4 class="window__title">
          <img src="/images/xp/icons/mycomputer-small.png" alt="" aria-hidden="true">
          {{ win.title }}
        </h4>

        <div class="window__controls">
          <button class="window__btn window__btn--minimize" aria-label="Minimizar" @click.stop="onMinimize">
            <img src="/images/xp/icons/minimize.png" alt="" aria-hidden="true">
          </button>
          <button class="window__btn window__btn--maximize" :aria-label="win.maximized ? 'Restaurar' : 'Maximizar'" @click.stop="onMaximize">
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

      <div v-if="win.progress !== undefined" class="window__progress">
        <div class="window__progress-bar" :style="{ width: `${win.progress}%` }" />
      </div>

      <div v-if="!win.maximized" class="window__resize window__resize--n" @mousedown="onResizeMousedown($event, 'n')" />
      <div v-if="!win.maximized" class="window__resize window__resize--s" @mousedown="onResizeMousedown($event, 's')" />
      <div v-if="!win.maximized" class="window__resize window__resize--e" @mousedown="onResizeMousedown($event, 'e')" />
      <div v-if="!win.maximized" class="window__resize window__resize--w" @mousedown="onResizeMousedown($event, 'w')" />
      <div v-if="!win.maximized" class="window__resize window__resize--ne" @mousedown="onResizeMousedown($event, 'ne')" />
      <div v-if="!win.maximized" class="window__resize window__resize--nw" @mousedown="onResizeMousedown($event, 'nw')" />
      <div v-if="!win.maximized" class="window__resize window__resize--se" @mousedown="onResizeMousedown($event, 'se')" />
      <div v-if="!win.maximized" class="window__resize window__resize--sw" @mousedown="onResizeMousedown($event, 'sw')" />
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
