import { useState, useEffect } from 'react';
import { getRecommendationsByGenre } from '../utils/spotify';
import type { SpotifyTrack } from '../types';

interface UseSpotifyTracksResult {
  tracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
}

export function useSpotifyTracks(genreId: string): UseSpotifyTracksResult {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTracks() {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedTracks = await getRecommendationsByGenre(genreId, 5);
        
        if (isMounted) {
          setTracks(fetchedTracks);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load tracks');
          setTracks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTracks();

    return () => {
      isMounted = false;
    };
  }, [genreId]);

  return { tracks, loading, error };
}
