<script setup lang="ts">
import type { WindowState } from '~/stores/windows'
import { useDrag } from '~/composables/useDrag'

const props = defineProps<{ win: WindowState }>()

const store = useWindowsStore()

const { start } = useDrag(
  (x, y) => store.updatePosition(props.win.id, x, y)
)

const maximizeIcon = computed(() =>
  props.win.maximized ? '/images/xp/icons/maximized.png' : '/images/xp/icons/maximize.png'
)

function onTitlebarMousedown(e: MouseEvent) {
  if (props.win.maximized) return
  store.focusWindow(props.win.id)
  start(e, props.win.x, props.win.y)
}
</script>

<template>
  <div
    v-if="!win.minimized"
    class="window"
    :class="{ 'window--maximized': win.maximized, 'window--focused': win.focused }"
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
      @dblclick="store.maximize(win.id)"
    >
      <h4 class="window__title"><img src="/images/xp/icons/mycomputer-small.png" alt="">{{ win.title }}</h4>

      <div class="window__controls">
        <button class="window__btn window__btn--minimize" @click.stop="store.minimize(win.id)">
          <img src="/images/xp/icons/minimize.png" alt="">
        </button>
        <button class="window__btn window__btn--maximize" @click.stop="store.maximize(win.id)">
            <img :src="maximizeIcon" alt="">
        </button>
        <button class="window__btn window__btn--close" @click.stop="store.close(win.id)">
          <span><img src="/images/xp/icons/close.png" alt=""></span>
        </button>
      </div>
    </div>

    <div class="window__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/Window.scss';
</style>
