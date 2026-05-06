export interface Track {
  metaData: {
    artist: string;
    title: string;
  };
  url: string;
}

export const initialTracks: Track[] = [
  {
    metaData: {
      artist: 'Black Sabbath',
      title: 'Neon Knights',
    },
    url: 'https://dn720709.ca.archive.org/0/items/heaven-and-hell_202506/01.%20Neon%20Knights.mp3',
  },
];
