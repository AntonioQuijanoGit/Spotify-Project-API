import type { SpotifyTrack, SpotifyPlaylist } from '../types';

const CLIENT_ID = '3c4e3dede7494520ba3ff068b36b9f5e';
const CLIENT_SECRET = 'abd8f3204aa040ea813b55b7b3644d31';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Spotify access token using Client Credentials flow
 */
export async function getSpotifyToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Set expiry 5 minutes before actual expiry for safety
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return cachedToken as string;
}

/**
 * Search for tracks
 */
export async function searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }

  const data = await response.json();
  return data.tracks.items;
}

/**
 * Search for tracks by genre
 */
export async function searchTracksByGenre(
  genre: string,
  limit: number = 10
): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();

  // Search query: genre name + common artists/characteristics
  const searchQuery = `genre:"${genre}"`;

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }

  const data = await response.json();
  return data.tracks.items;
}

/**
 * Get recommendations based on seed genres
 */
export async function getRecommendationsByGenre(
  genre: string,
  limit: number = 10
): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();

  // Map our genre names to Spotify's genre seeds
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

  // Request significantly more tracks to increase chances of getting previews
  const requestLimit = Math.min(limit * 5, 100); // Request 5x more, max 100

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_genres=${spotifyGenre}&limit=${requestLimit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // If recommendations fail, fall back to search
      return searchTracksByGenre(genre, limit);
    }

    const data = await response.json();
    let tracks = data.tracks;

    // Filter tracks with previews first
    const tracksWithPreview = tracks.filter((track: SpotifyTrack) => track.preview_url);
    const tracksWithoutPreview = tracks.filter((track: SpotifyTrack) => !track.preview_url);

    // If we don't have enough tracks with previews, try search as supplement
    if (tracksWithPreview.length < limit) {
      try {
        const searchTracks = await searchTracksByGenre(genre, limit * 2);
        const searchTracksWithPreview = searchTracks.filter((track: SpotifyTrack) => track.preview_url);
        
        // Combine and deduplicate by track ID
        const allTracksWithPreview = [...tracksWithPreview];
        const existingIds = new Set(tracksWithPreview.map((t: SpotifyTrack) => t.id));
        
        for (const track of searchTracksWithPreview) {
          if (!existingIds.has(track.id) && allTracksWithPreview.length < limit) {
            allTracksWithPreview.push(track);
            existingIds.add(track.id);
          }
        }
        
        // Fill remaining slots with tracks without previews if needed
        const result = [
          ...allTracksWithPreview.slice(0, limit),
          ...tracksWithoutPreview.slice(0, Math.max(0, limit - allTracksWithPreview.length))
        ];
        
        return result.slice(0, limit);
      } catch (searchError) {
        // If search also fails, return what we have
        if (import.meta.env.DEV) {
          console.warn('Search fallback failed:', searchError);
        }
      }
    }

    // Prioritize tracks with previews, but include some without if needed
    const result = [
      ...tracksWithPreview.slice(0, limit),
      ...tracksWithoutPreview.slice(0, Math.max(0, limit - tracksWithPreview.length))
    ];

    return result.slice(0, limit);
  } catch (error) {
    // Final fallback to search
    if (import.meta.env.DEV) {
      console.warn('Recommendations failed, using search:', error);
    }
    return searchTracksByGenre(genre, limit);
  }
}

/**
 * Get available genre seeds from Spotify
 */
export async function getAvailableGenres(): Promise<string[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get genres');
  }

  const data = await response.json();
  return data.genres;
}

/**
 * Search for artists on Spotify
 */
export async function searchArtists(query: string, limit: number = 20): Promise<any[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search artists');
  }

  const data = await response.json();
  return data.artists.items;
}

/**
 * Search for albums on Spotify
 */
export async function searchAlbums(query: string, limit: number = 20): Promise<any[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search albums');
  }

  const data = await response.json();
  return data.albums.items;
}

/**
 * Get artist's top tracks
 */
export async function getArtistTopTracks(artistId: string, limit: number = 10): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get artist top tracks');
  }

  const data = await response.json();
  return data.tracks.slice(0, limit);
}

/**
 * Get album tracks
 */
export async function getAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get album tracks');
  }

  const data = await response.json();
  
  // Get full track details with preview URLs
  const trackIds = data.items.map((item: any) => item.id).join(',');
  const tracksResponse = await fetch(
    `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!tracksResponse.ok) {
    throw new Error('Failed to get track details');
  }

  const tracksData = await tracksResponse.json();
  return tracksData.tracks;
}

/**
 * Search for playlists on Spotify
 */
export async function searchPlaylists(query: string, limit: number = 20): Promise<SpotifyPlaylist[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search playlists');
  }

  const data = await response.json();
  return data.playlists.items;
}

/**
 * Get featured playlists (Spotify's curated playlists)
 */
export async function getFeaturedPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
  const token = await getSpotifyToken();

  // Add country and locale parameters for better compatibility
  const response = await fetch(
    `https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}&country=US&locale=en_US`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || 'Failed to get featured playlists';
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Handle different response structures
  if (data.playlists && data.playlists.items) {
    return data.playlists.items;
  }
  
  // Fallback: if structure is different, return empty array
  return [];
}

/**
 * Get category playlists (playlists by genre/category)
 */
export async function getCategoryPlaylists(categoryId: string, limit: number = 20): Promise<SpotifyPlaylist[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get category playlists');
  }

  const data = await response.json();
  return data.playlists.items || [];
}
