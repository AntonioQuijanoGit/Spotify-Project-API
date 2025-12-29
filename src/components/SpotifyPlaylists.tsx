import { useState, useEffect } from 'react';
import { searchPlaylists, getFeaturedPlaylists } from '../utils/spotify';
import type { SpotifyPlaylist } from '../types';
import { genres } from '../data/genres';
import { SkeletonLoader } from './SkeletonLoader';
import { useToast } from '../hooks/useToast';
import './SpotifyPlaylists.css';

export const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('featured');
  const { error: errorToast } = useToast();

  useEffect(() => {
    loadPlaylists();
  }, [selectedGenre]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let fetchedPlaylists: SpotifyPlaylist[] = [];
      
      if (selectedGenre === 'featured') {
        // Try featured, but fallback to popular search if it fails
        try {
          fetchedPlaylists = await getFeaturedPlaylists(20);
        } catch {
          // Fallback to searching popular playlists
          fetchedPlaylists = await searchPlaylists('popular', 20);
        }
      } else {
        // Search playlists by genre
        const genre = genres.find(g => g.id === selectedGenre);
        if (genre) {
          fetchedPlaylists = await searchPlaylists(genre.spotifyGenre, 20);
        }
      }
      
      setPlaylists(fetchedPlaylists);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load playlists';
      setError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPlaylists();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchPlaylists(searchQuery, 20);
      setPlaylists(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search playlists';
      setError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularGenres = genres.slice(0, 12);

  return (
    <div className="spotify-playlists">
      <div className="playlists-header">
        <h2>🎵 Spotify Playlists</h2>
        <p>Discover curated playlists from Spotify</p>
      </div>

      <div className="playlists-controls">
        <div className="playlists-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search playlists..."
            className="playlists-search-input"
          />
          <button
            onClick={handleSearch}
            className="playlists-search-btn"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        <div className="playlists-filters">
          <button
            onClick={() => setSelectedGenre('featured')}
            className={`genre-filter-btn ${selectedGenre === 'featured' ? 'active' : ''}`}
            type="button"
          >
            Featured
          </button>
          {popularGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`genre-filter-btn ${selectedGenre === genre.id ? 'active' : ''}`}
              style={selectedGenre === genre.id ? { borderLeftColor: genre.color } : undefined}
              type="button"
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="playlists-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="playlist-skeleton">
              <SkeletonLoader width="200px" height="200px" />
              <SkeletonLoader height="20px" width="80%" className="skeleton-margin" />
              <SkeletonLoader height="16px" width="60%" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="playlists-error">
          <p>Error: {error}</p>
          <button onClick={loadPlaylists} className="retry-btn" type="button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && playlists.length > 0 && (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <article key={playlist.id} className="playlist-card">
              <div className="playlist-cover">
                {playlist.images[0] ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="playlist-cover-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    </svg>
                  </div>
                )}
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="playlist-overlay"
                  aria-label={`Open ${playlist.name} in Spotify`}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              </div>
              <div className="playlist-info">
                <h3 className="playlist-name">{playlist.name}</h3>
                <p className="playlist-owner">{playlist.owner.display_name}</p>
                {playlist.description && (
                  <p className="playlist-description">{playlist.description.substring(0, 100)}...</p>
                )}
                <p className="playlist-tracks">{playlist.tracks.total} tracks</p>
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="playlist-link"
                >
                  Open in Spotify
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && playlists.length === 0 && (
        <div className="playlists-empty">
          <p>No playlists found. Try a different search or genre.</p>
        </div>
      )}
    </div>
  );
};

