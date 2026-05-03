const SOUND_NAMES = ['click'] as const

type SoundName = typeof SOUND_NAMES[number]

const DEFAULT_VOLUME = 0.3

const sounds: Partial<Record<SoundName, HTMLAudioElement>> = {}

if (typeof window !== 'undefined') {
  for (const name of SOUND_NAMES) {
    const audio = new Audio(`/sounds/${name}.wav`)
    audio.preload = 'auto'
    sounds[name] = audio
  }
}

export function useSounds() {
  function play(name: SoundName, volume = DEFAULT_VOLUME) {
    const audio = sounds[name]
    if (!audio) return
    const clone = audio.cloneNode() as HTMLAudioElement
    clone.volume = volume
    clone.play().catch(() => {})
  }

  return {
    playClick: () => play('click'),
  }
}
