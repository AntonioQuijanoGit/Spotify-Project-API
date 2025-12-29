import { useState, useEffect } from 'react';

interface Favorites {
  genres: string[];
  tracks: string[];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { genres: [], tracks: [] };
      }
    }
    return { genres: [], tracks: [] };
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleGenreFavorite = (genreId: string) => {
    setFavorites(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const toggleTrackFavorite = (trackId: string) => {
    setFavorites(prev => ({
      ...prev,
      tracks: prev.tracks.includes(trackId)
        ? prev.tracks.filter(id => id !== trackId)
        : [...prev.tracks, trackId],
    }));
  };

  const isGenreFavorite = (genreId: string) => {
    return favorites.genres.includes(genreId);
  };

  const isTrackFavorite = (trackId: string) => {
    return favorites.tracks.includes(trackId);
  };

  const clearFavorites = () => {
    setFavorites({ genres: [], tracks: [] });
  };

  return {
    favorites,
    favoriteGenres: favorites.genres,
    toggleGenreFavorite,
    toggleTrackFavorite,
    isGenreFavorite,
    isTrackFavorite,
    clearFavorites,
  };
}

