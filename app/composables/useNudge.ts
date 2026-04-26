import { useWindowsStore } from '~/stores/windows';
import type { WindowState } from '~/stores/windows';

interface UseNudgeOptions {
  window: WindowState;
}

export function useNudge({ window }: UseNudgeOptions) {
  const isNudging = ref(false);
  const windowsStore = useWindowsStore();

  function handleNudge() {
    if (isNudging.value) return;

    isNudging.value = true;

    const originalX = window.x;
    const originalY = window.y;
    const offset = 5;
    const interval = 25;
    const duration = 1500;

    const positions: { x: number; y: number }[] = [
      { x: originalX, y: originalY - offset },
      { x: originalX + offset, y: originalY - offset },
      { x: originalX + offset, y: originalY },
      { x: originalX + offset, y: originalY + offset },
      { x: originalX, y: originalY + offset },
      { x: originalX - offset, y: originalY + offset },
      { x: originalX - offset, y: originalY },
      { x: originalX - offset, y: originalY - offset },
    ];

    let index = 0;
    const startTime = Date.now();

    const nudgeInterval = setInterval(() => {
      const position = positions[index];

      if (!position) {
        clearInterval(nudgeInterval);
        windowsStore.updatePosition(window.id, originalX, originalY);
        isNudging.value = false;
        return;
      }

      windowsStore.updatePosition(window.id, position.x, position.y);

      index = (index + 1) % positions.length;

      if (Date.now() - startTime >= duration) {
        clearInterval(nudgeInterval);
        windowsStore.updatePosition(window.id, originalX, originalY);
        isNudging.value = false;
      }
    }, interval);
  }

  return {
    isNudging,
    handleNudge,
  };
}
