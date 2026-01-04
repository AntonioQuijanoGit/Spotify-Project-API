import { getSpotifyToken } from './spotify';
import type { SpotifyTrack, AudioFeatures, TrackWithFeatures } from '../types';

/**
 * Get audio features for a track
 */
export async function getTrackAudioFeatures(trackId: string): Promise<AudioFeatures | null> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
}

/**
 * Get audio features for multiple tracks (max 100)
 */
export async function getTracksAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
  if (trackIds.length === 0) {
    console.log('getTracksAudioFeatures: No track IDs provided');
    return [];
  }
  
  if (trackIds.length > 100) {
    // Batch requests if more than 100
    const batches = [];
    for (let i = 0; i < trackIds.length; i += 100) {
      batches.push(trackIds.slice(i, i + 100));
    }
    const results = await Promise.all(batches.map(batch => getTracksAudioFeatures(batch)));
    return results.flat();
  }

  try {
    const token = await getSpotifyToken();
    console.log('Fetching audio features for tracks:', trackIds);

    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API error:', response.status, response.statusText, errorText);
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Spotify API response:', data);
    
    if (!data.audio_features) {
      console.error('No audio_features in response:', data);
      return [];
    }
    
    const features = data.audio_features.filter((f: AudioFeatures | null) => f !== null) as AudioFeatures[];
    console.log('Filtered features:', features);
    return features;
  } catch (error) {
    console.error('Error in getTracksAudioFeatures:', error);
    throw error;
  }
}

/**
 * Get tracks with their audio features
 */
export async function getTracksWithFeatures(tracks: SpotifyTrack[]): Promise<TrackWithFeatures[]> {
  const trackIds = tracks.map(t => t.id);
  const features = await getTracksAudioFeatures(trackIds);
  
  const featuresMap = new Map<string, AudioFeatures>();
  features.forEach(f => {
    if (f) featuresMap.set(f.id, f);
  });

  return tracks.map(track => ({
    ...track,
    audio_features: featuresMap.get(track.id),
  }));
}

/**
 * Get recommendations with audio feature filters
 */
export async function getRecommendationsWithFeatures(
  genre: string,
  limit: number = 10,
  filters?: {
    min_energy?: number;
    max_energy?: number;
    min_danceability?: number;
    max_danceability?: number;
    min_tempo?: number;
    max_tempo?: number;
    min_valence?: number;
    max_valence?: number;
    target_energy?: number;
    target_danceability?: number;
    target_tempo?: number;
    target_valence?: number;
  }
): Promise<TrackWithFeatures[]> {
  const token = await getSpotifyToken();

  const genreMap: Record<string, string> = {
    'classic-rock': 'rock',
    'alternative': 'alt-rock',
    'punk': 'punk',
    'hard-rock': 'hard-rock',
    'house': 'house',
    'techno': 'techno',
    'ambient': 'ambient',
    'hip-hop': 'hip-hop',
    'trap': 'trap',
    'jazz': 'jazz',
    'bebop': 'jazz',
    'pop': 'pop',
    'synth-pop': 'synth-pop',
    'indie-rock': 'indie',
    'indie-pop': 'indie-pop',
    'metal': 'metal',
    'classical': 'classical',
    'salsa': 'salsa',
    'reggaeton': 'reggaeton',
    'bachata': 'latin',
    'country': 'country',
    'bluegrass': 'bluegrass',
    'blues': 'blues',
    'blues-rock': 'blues-rock',
    'reggae': 'reggae',
    'dancehall': 'dancehall',
    'soul': 'soul',
    'r-n-b': 'r-n-b',
    'folk': 'folk',
    'indie-folk': 'indie-folk',
  };

  const spotifyGenre = genreMap[genre] || genre;
  const requestLimit = Math.min(limit * 5, 100);

  try {
    const params = new URLSearchParams({
      seed_genres: spotifyGenre,
      limit: requestLimit.toString(),
    });

    if (filters) {
      if (filters.min_energy !== undefined) params.append('min_energy', filters.min_energy.toString());
      if (filters.max_energy !== undefined) params.append('max_energy', filters.max_energy.toString());
      if (filters.min_danceability !== undefined) params.append('min_danceability', filters.min_danceability.toString());
      if (filters.max_danceability !== undefined) params.append('max_danceability', filters.max_danceability.toString());
      if (filters.min_tempo !== undefined) params.append('min_tempo', filters.min_tempo.toString());
      if (filters.max_tempo !== undefined) params.append('max_tempo', filters.max_tempo.toString());
      if (filters.min_valence !== undefined) params.append('min_valence', filters.min_valence.toString());
      if (filters.max_valence !== undefined) params.append('max_valence', filters.max_valence.toString());
      if (filters.target_energy !== undefined) params.append('target_energy', filters.target_energy.toString());
      if (filters.target_danceability !== undefined) params.append('target_danceability', filters.target_danceability.toString());
      if (filters.target_tempo !== undefined) params.append('target_tempo', filters.target_tempo.toString());
      if (filters.target_valence !== undefined) params.append('target_valence', filters.target_valence.toString());
    }

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    let tracks = data.tracks.filter((t: SpotifyTrack) => t.preview_url);
    tracks = tracks.slice(0, limit);
    
    return await getTracksWithFeatures(tracks);
  } catch (error) {
    return [];
  }
}

