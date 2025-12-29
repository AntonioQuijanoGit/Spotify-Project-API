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
  | 'country'
  | 'blues'
  | 'reggae'
  | 'soul'
  | 'folk';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    name: string;
    id?: string;
  }>;
  album: {
    name: string;
    id?: string;
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

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{
    name: string;
    id: string;
  }>;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  owner: {
    display_name: string;
    id: string;
  };
  tracks: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
  public: boolean;
}

export interface AudioFeatures {
  id: string;
  tempo: number; // BPM
  energy: number; // 0.0 to 1.0
  danceability: number; // 0.0 to 1.0
  valence: number; // 0.0 to 1.0 (musical positiveness)
  acousticness: number; // 0.0 to 1.0
  instrumentalness: number; // 0.0 to 1.0
  liveness: number; // 0.0 to 1.0
  speechiness: number; // 0.0 to 1.0
  loudness: number; // -60 to 0 dB
  key: number; // 0-11 (pitch class notation)
  mode: number; // 0 = minor, 1 = major
  time_signature: number; // 3-7
  duration_ms: number;
}

export interface TrackWithFeatures extends SpotifyTrack {
  audio_features?: AudioFeatures;
}

export type Mood = 
  | 'study' 
  | 'workout' 
  | 'relax' 
  | 'party' 
  | 'focus' 
  | 'sleep' 
  | 'happy' 
  | 'sad' 
  | 'energetic' 
  | 'calm';

export interface ListeningHistoryItem {
  trackId: string;
  trackName: string;
  artists: string[];
  genreId?: string;
  genreName?: string;
  timestamp: number;
  duration: number; // seconds listened
}

export interface PersonalCollection {
  id: string;
  name: string;
  description?: string;
  genreIds: string[];
  createdAt: number;
  color?: string;
}
