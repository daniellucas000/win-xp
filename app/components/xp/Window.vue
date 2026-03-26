<script setup lang="ts">
import type { WindowState } from '~/stores/windows'
import { useDrag } from '~/composables/useDrag'

const props = defineProps<{ win: WindowState }>()

const store = useWindowsStore()

const { start } = useDrag(
  (x, y) => store.updatePosition(props.win.id, x, y)
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
    <!-- Titlebar -->
    <div
      class="window__titlebar"
      :class="win.focused ? 'window__titlebar--active' : 'window__titlebar--inactive'"
      @mousedown="onTitlebarMousedown"
      @dblclick="store.maximize(win.id)"
    >
      <span class="window__title">{{ win.title }}</span>

      <div class="window__controls">
        <button class="window__btn window__btn--minimize" @click.stop="store.minimize(win.id)">
          <span>_</span>
        </button>
        <button class="window__btn window__btn--maximize" @click.stop="store.maximize(win.id)">
          <span>{{ win.maximized ? '❐' : '□' }}</span>
        </button>
        <button class="window__btn window__btn--close" @click.stop="store.close(win.id)">
          <span>✕</span>
        </button>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="window__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 2px solid $xp-border-darker;
  border-radius: 8px 8px 0 0;
  overflow: hidden;

  &--focused {
    border-color: #0055e5;
  }

  &__titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    padding: 0 4px;
    cursor: default;
    flex-shrink: 0;

    &--active {
      background: radial-gradient(circle at 0 20%, #0032c1 0, #0032c188 1%, #0032c100 2%, #0032c100 100%), radial-gradient(circle at 100% 20%, #0032c1 0, #0032c188 1%, #0032c100 2%, #0032c100 100%), linear-gradient(to bottom, #3d95ff 0, #2b90ff 7%, #0372ff 9%, #0054e3 18%, #0054e3 19%, #0058ee 50%, #026afe 80%, #026afe 90%, #0065fd 93%, #71aaff 96%, #c4d6ff 100%);
      box-shadow: inset -1px -1px 1px #0026acaa, inset -2px -1px 1px #0020c8aa, inset -3px -1px 1px #003be0aa, inset 1px -1px 1px #0020c8aa, inset 2px -1px 1px #0038d8aa, inset 3px -1px 1px #0046e4aa, inset 0 -1px red;
    }

    &--inactive {
      background: linear-gradient(
        to bottom,
        #7a96df 0%,
        #5a7fce 3%,
        #5a7fce 90%,
        #4a6fbe 100%
      );
    }
  }

  &__title {
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  &__controls {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
    margin-left: 4px;
  }

  &__btn {
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    cursor: default;
    border: 1px solid;
    border-top-color: #fff;
    border-left-color: #fff;
    border-bottom-color: $xp-border-dark;
    border-right-color: $xp-border-dark;
    background: linear-gradient(to bottom, #f0f0ea, #d8d0c4);
    color: black;

    &:active {
      border-top-color: $xp-border-dark;
      border-left-color: $xp-border-dark;
      border-bottom-color: #fff;
      border-right-color: #fff;
    }

    &--close {
      background: linear-gradient(to bottom, #e05020, #c03010);
      color: white;
    }
  }

  &__body {
    flex: 1;
    background: $xp-bg;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>