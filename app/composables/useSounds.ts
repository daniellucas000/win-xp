type SoundName = 'open' | 'close' | 'error' | 'notification' | 'startup' | 'shutdown' | 'click' | 'menuPopup'

const sounds: Partial<Record<SoundName, HTMLAudioElement>> = {}

function initSounds() {
  if (typeof window === 'undefined') return

  const soundFiles: SoundName[] = ['open', 'close', 'error', 'notification', 'startup', 'shutdown', 'click', 'menuPopup']
  for (const name of soundFiles) {
    const audio = new Audio(`/sounds/${name}.wav`)
    audio.preload = 'auto'
    sounds[name] = audio
  }
}

if (typeof window !== 'undefined') {
  initSounds()
}

export function useSounds() {
  const play = (name: SoundName, volume = 0.3) => {
    const audio = sounds[name]
    if (!audio) return
    const clone = audio.cloneNode() as HTMLAudioElement
    clone.volume = volume
    clone.play().catch(() => {})
  }

  return {
    playOpen: () => play('open'),
    playClose: () => play('close'),
    playError: () => play('error'),
    playNotification: () => play('notification'),
    playStartup: () => play('startup'),
    playShutdown: () => play('shutdown'),
    playClick: () => play('click'),
    playMenuPopup: () => play('menuPopup'),
  }
}