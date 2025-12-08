import type { SpotifyTrack } from '../types';

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
  };

  const spotifyGenre = genreMap[genre] || genre;

  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_genres=${spotifyGenre}&limit=${limit}`,
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
  return data.tracks;
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
