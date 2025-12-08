export interface Genre {
  id: string;
  name: string;
  category: GenreCategory;
  description: string;
  characteristics: string[];
  originYear?: string;
  keyArtists?: string[];
  relatedGenres: string[];
  color: string;
  spotifyGenre: string;
}

export type GenreCategory = 
  | 'rock' 
  | 'electronic' 
  | 'hip-hop' 
  | 'jazz' 
  | 'pop' 
  | 'indie' 
  | 'metal' 
  | 'classical'
  | 'latin'
  | 'country';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}
