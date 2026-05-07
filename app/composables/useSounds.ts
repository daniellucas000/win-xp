const DEFAULT_VOLUME = 0.3

let clickAudio: HTMLAudioElement | null = null

if (typeof window !== 'undefined') {
  clickAudio = new Audio('/sounds/click.wav')
  clickAudio.preload = 'auto'
}

export function useSounds() {
  function playClick(volume = DEFAULT_VOLUME) {
    if (!clickAudio) return
    const clone = clickAudio.cloneNode() as HTMLAudioElement
    clone.volume = volume
    clone.play().catch(() => {})
  }

  return { playClick }
}