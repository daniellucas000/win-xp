export interface Track {
  metaData: {
    artist: string
    title: string
  }
  url: string
}

export const initialTracks: Track[] = [
  {
    metaData: {
      artist: 'Brian Eno',
      title: 'Windows XP Startup',
    },
    url: 'https://archive.org/download/windows-xp-startup_202401/Windows%20XP%20Startup.wav',
  },
]
