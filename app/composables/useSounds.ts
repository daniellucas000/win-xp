let folderOpenSound: HTMLAudioElement | null = null

function initSounds() {
  if (typeof window === 'undefined') return
  
  folderOpenSound = new Audio('/sounds/start.wav')
  folderOpenSound.preload = 'auto'
}

if (typeof window !== 'undefined') {
  initSounds()
}

export function useSounds() {
  const playOpen = () => {
    if (!folderOpenSound) return
    
    const audio = folderOpenSound.cloneNode() as HTMLAudioElement
    audio.volume = 0.3
    audio.play().catch(() => {})
  }

  return { playOpen }
}