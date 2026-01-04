import { useState, useEffect, useRef } from 'react';
import { useSpotifyTracks } from '../hooks/useSpotifyTracks';
import { genres } from '../data/genres';
import { AudioPlayer } from './AudioPlayer';
import { useToast } from '../hooks/useToast';
import './RadioMode.css';

export const RadioMode = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGenreIndex, setCurrentGenreIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playedGenres, setPlayedGenres] = useState<Set<string>>(new Set());
  const { tracks, loading, error } = useSpotifyTracks(genres[currentGenreIndex]?.id || '');
  const { success, info } = useToast();
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const getRandomGenre = () => {
    const availableGenres = genres.filter(g => !playedGenres.has(g.id));
    if (availableGenres.length === 0) {
      setPlayedGenres(new Set());
      return genres[Math.floor(Math.random() * genres.length)];
    }
    return availableGenres[Math.floor(Math.random() * availableGenres.length)];
  };

  const playNextTrack = () => {
    if (tracks.length > 0 && currentTrackIndex < tracks.length - 1) {
      // Move to next track in current genre
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      // Move to next genre
      const nextGenre = getRandomGenre();
      const nextIndex = genres.findIndex(g => g.id === nextGenre.id);
      setCurrentGenreIndex(nextIndex);
      setCurrentTrackIndex(0);
      setPlayedGenres(prev => new Set([...prev, nextGenre.id]));
      info(`Now playing: ${nextGenre.name}`);
    }
  };

  // Initialize with a random genre when component mounts or when starting radio
  useEffect(() => {
    if (isPlaying && tracks.length === 0 && !loading && currentGenreIndex === 0) {
      const randomGenre = getRandomGenre();
      const randomIndex = genres.findIndex(g => g.id === randomGenre.id);
      setCurrentGenreIndex(randomIndex);
      setPlayedGenres(prev => new Set([...prev, randomGenre.id]));
    }
  }, [isPlaying, tracks.length, loading]);

  const handleToggle = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      success('Radio mode stopped');
    } else {
      // If no tracks loaded yet, start with a random genre
      if (tracks.length === 0 || !currentGenre) {
        const randomGenre = getRandomGenre();
        const randomIndex = genres.findIndex(g => g.id === randomGenre.id);
        if (randomIndex !== -1) {
          setCurrentGenreIndex(randomIndex);
          setCurrentTrackIndex(0);
          setPlayedGenres(prev => new Set([...prev, randomGenre.id]));
          // Wait a bit for tracks to load, then start playing
          setIsPlaying(true);
          success('Radio mode started! Loading tracks...');
          return;
        }
      }
      setIsPlaying(true);
      success('Radio mode started!');
    }
  };

  // Auto-advance when track ends (handled by AudioPlayer onEnded)
  const handleTrackEnded = () => {
    if (isPlaying) {
      playNextTrack();
    }
  };

  // Skip tracks without preview_url in radio mode
  useEffect(() => {
    if (isPlaying && tracks.length > 0 && currentTrackIndex < tracks.length) {
      const track = tracks[currentTrackIndex];
      if (track && !track.preview_url) {
        // Skip to next track if current has no preview
        setTimeout(() => playNextTrack(), 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, currentTrackIndex, isPlaying]);


  const currentTrack = tracks[currentTrackIndex];
  const currentGenre = genres[currentGenreIndex];

  return (
    <div className="radio-mode">
      <div className="radio-header">
        <h2>🎵 Radio Mode</h2>
        <p>Discover music genres automatically</p>
      </div>

      <div className="radio-controls">
        <button
          onClick={handleToggle}
          className={`radio-toggle ${isPlaying ? 'playing' : ''}`}
          type="button"
          aria-label={isPlaying ? 'Stop radio' : 'Start radio'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            {isPlaying ? (
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
          <span>{isPlaying ? 'Stop' : 'Start'} Radio</span>
        </button>

        <button
          onClick={playNextTrack}
          className="radio-skip"
          disabled={!isPlaying || loading}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="15" y1="4" x2="15" y2="20" />
          </svg>
          Skip
        </button>
      </div>

      {currentGenre && (
        <div className="radio-info">
          <div className="radio-genre-badge" style={{ borderLeftColor: currentGenre.color }}>
            <span className="radio-genre-label">Now Playing</span>
            <span className="radio-genre-name">{currentGenre.name}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="radio-loading">
          <div className="radio-spinner" />
          <p>Loading tracks...</p>
        </div>
      )}

      {error && (
        <div className="radio-error">
          <p>Error loading tracks: {error}</p>
        </div>
      )}

      {currentTrack && !loading && (
        <div className="radio-track">
          <div className="radio-track-cover">
            {currentTrack.album.images[0] ? (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album.name}
                loading="lazy"
              />
            ) : (
              <div className="radio-track-placeholder">🎵</div>
            )}
          </div>
          <div className="radio-track-info">
            <h3>{currentTrack.name}</h3>
            <p>{currentTrack.artists.map(a => a.name).join(', ')}</p>
            {currentTrack.preview_url ? (
              <div>
                <audio
                  ref={audioPlayerRef}
                  src={currentTrack.preview_url}
                  preload="metadata"
                  style={{ display: 'none' }}
                  onEnded={handleTrackEnded}
                />
                <AudioPlayer
                  key={`${currentTrack.id}-${isPlaying}`}
                  previewUrl={currentTrack.preview_url}
                  trackName={currentTrack.name}
                  autoPlay={isPlaying}
                  onEnded={handleTrackEnded}
                />
                {isPlaying && !loading && (
                  <p className="radio-hint" style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem', textAlign: 'center' }}>
                    💡 Click play if music doesn't start automatically
                  </p>
                )}
              </div>
            ) : (
              <div className="radio-no-preview">
                <p>No preview available for this track</p>
                {isPlaying && (
                  <button
                    onClick={playNextTrack}
                    className="radio-skip-small"
                    type="button"
                  >
                    Skip to next track
                  </button>
                )}
              </div>
            )}
            {currentTrack.external_urls?.spotify && (
              <a
                href={currentTrack.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="radio-music-link"
                aria-label={`Listen to ${currentTrack.name}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span>Listen</span>
              </a>
            )}
          </div>
        </div>
      )}

      {!currentTrack && !loading && !error && (
        <div className="radio-empty">
          <p>Click "Start Radio" to begin discovering music!</p>
        </div>
      )}
    </div>
  );
};



