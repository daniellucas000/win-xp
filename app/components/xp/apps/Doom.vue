<script setup lang="ts">
import { DOOM } from 'wasm-doom';
import type { WindowState } from '~/stores/windows';

interface Props {
  win?: WindowState;
}
const props = defineProps<Props>();

const winStore = useWindowsStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const isLoaded = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);
const scale = ref(1);

const NATIVE_WIDTH = 640;
const NATIVE_HEIGHT = 400;

let game: DOOM | null = null;

function calculateScale() {
  if (!containerRef.value) return;

  const containerWidth = containerRef.value.clientWidth;
  const containerHeight = containerRef.value.clientHeight;

  const scaleX = containerWidth / NATIVE_WIDTH;
  const scaleY = containerHeight - 50;

  scale.value = Math.min(scaleX, scaleY / NATIVE_HEIGHT, 3);
}

function stopKeyboardPropagation(e: KeyboardEvent) {
  e.stopPropagation();
}

onMounted(async () => {
  if (import.meta.server) return;

  await nextTick();

  if (!canvasRef.value) {
    error.value = 'Canvas not available';
    isLoading.value = false;
    return;
  }

  try {
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) {
      error.value = 'Failed to get canvas context';
      isLoading.value = false;
      return;
    }

    canvasRef.value.width = NATIVE_WIDTH;
    canvasRef.value.height = NATIVE_HEIGHT;

    game = new DOOM({
      screenWidth: NATIVE_WIDTH,
      screenHeight: NATIVE_HEIGHT,
      keyboardTarget: canvasRef.value,
      wasmURL: '/doom.wasm',
      onFrameRender: ({ screen }) => {
        if (!ctx) return;
        const frame = new ImageData(screen, NATIVE_WIDTH, NATIVE_HEIGHT);
        ctx.putImageData(frame, 0, 0);
      },
    });

    await game.start();

    isLoaded.value = true;
    isLoading.value = false;

    nextTick(() => {
      calculateScale();

      const resizeObserver = new ResizeObserver(() => {
        calculateScale();
      });

      if (containerRef.value) {
        resizeObserver.observe(containerRef.value);
      }

      setTimeout(() => {
        canvasRef.value?.focus();
      }, 100);
    });

    if (props.win?.id) {
      winStore.updateWindowTitle(props.win.id, 'DOOM', '/images/doom.png');
    }
  } catch (e) {
    console.error('[DOOM] Error loading game:', e);
    error.value = e instanceof Error ? e.message : 'Failed to load DOOM';
    isLoading.value = false;
  }
});

onUnmounted(() => {
  game = null;
});
</script>

<template>
  <div ref="containerRef" class="doom-container">
    <div v-if="isLoading" class="doom-loading">
      <span>Loading DOOM...</span>
    </div>
    <div class="canvas-wrapper" :style="{ transform: `scale(${scale})` }">
      <canvas
        v-show="isLoaded && !error"
        ref="canvasRef"
        class="doom-canvas"
        tabindex="0"
        @keydown.prevent="stopKeyboardPropagation"
        @keyup.prevent="stopKeyboardPropagation"
      />
    </div>
    <div v-if="isLoaded" class="doom-hint">
      Click inside to play • WASD/Arrows to move • Mouse to aim/click to fire •
      Enter to start
    </div>
  </div>
</template>

<style scoped>
.doom-container {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.canvas-wrapper {
  transform-origin: center center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doom-canvas {
  background: #000;
  outline: none;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border: 1px solid #222;
}

.doom-loading {
  color: #888;
  font-family: monospace;
  font-size: 14px;
}

.doom-error {
  color: #f00;
}

.doom-hint {
  position: absolute;
  bottom: 8px;
  color: #555;
  font-family: monospace;
  font-size: 11px;
  text-align: center;
}
</style>
