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
    <!-- Titlebar -->
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
  border: 1px solid;
  border-color: #778edb #7586dc #7586dc #758cdc;
  box-shadow: -1px 0 0 #758cdd, 1px 0 0 #7588de, 0 1px 0 #6d74cd;
  border-radius: 8px 8px 0 0;
  overflow: hidden;

  &--focused {
    border-color: #0144d0 #003ddc #0048f1 #0855dd;
    box-shadow: -1px 0 2px 0 #5d8aee, 1px 0 2px 1px #003ddc, 0 1px 2px 1px #003ddc;
  }

  &__titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    padding: 5px;
    cursor: default;
    flex-shrink: 0;
    border-radius: 8px 8px 0px 0px;
    
    &--active {
      background: linear-gradient(180deg, #3D95FF 6.7%, #0372FF 10.36%, #0365F1 13.89%, #0053E1 25.84%, #0058EE 56.29%, #026AFE 74.1%, #026AFE 84.7%, #0060FC 90.79%, #0043CF 96.43%);
      box-shadow: inset 8px 0px 5px -5px rgba(34, 37, 46, 0.54), inset -8px 0px 5px -5px rgba(0, 15, 102, 0.66);
    }

    &--inactive {
      background: radial-gradient(circle at 0 25%, #7276d1 0, #7276d1aa 1%, #7276d100 2%, #7276d100 100%), radial-gradient(circle at 100% 25%, #7276d1 0, #7276d1aa 1%, #7276d100 2%, #7276d100 100%), linear-gradient(to bottom, #9ab4e9 0, #9db9eb 7%, #8bb0e9 9%, #7b9de1 18%, #7996de 19%, #7a96e0 50%, #7fa2e6 80%, #80a5e6 90%, #7fa2e5 91%, #7b99e1 94%, #778edb 100%);
      box-shadow: inset 2px 0 0 #747cd566, inset 1px 0 0 #747cd5, inset -2px 0 0 #6e6dc566, inset -1px 0 0 #6e6dc5;
      color: #d8e4f8;
      text-shadow: none;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    color: #FFFFFF;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  }

  &__controls {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
    margin-left: 4px;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #245FF5 33%, #256BF8 66%);
    border: 1px solid #FFFFFF;
    box-shadow: inset -2px -3px 5px #0844C3, inset 10px 2px 8px rgba(255, 255, 255, 0.33);
    border-radius: 2px;
    height: 21px;
    width: 21px;

    &:active {
      border-top-color: $xp-border-dark;
      border-left-color: $xp-border-dark;
      border-bottom-color: #fff;
      border-right-color: #fff;
    }

    &--close {
      background: linear-gradient(180deg, #E46446 0%, #E65D32 100%);
      border: 1px solid #FFFFFF;
      box-shadow: inset -2px -3px 5px #AA2300, inset 10px 2px 8px -2px rgba(255, 255, 255, 0.1);
      border-radius: 2px;
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