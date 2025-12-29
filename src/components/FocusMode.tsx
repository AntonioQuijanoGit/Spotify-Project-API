import { useState, useEffect } from 'react';
import { getRecommendationsWithFeatures } from '../utils/spotify-features';
import { MOOD_FILTERS } from '../utils/moods';
import { genres } from '../data/genres';
import { AudioPlayer } from './AudioPlayer';
import { SkeletonLoader } from './SkeletonLoader';
import { useToast } from '../hooks/useToast';
import { useListeningHistory } from '../hooks/useListeningHistory';
import type { TrackWithFeatures } from '../types';
import './FocusMode.css';

const FOCUS_GENRES = ['ambient', 'classical', 'jazz', 'indie-folk'];

export const FocusMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [tracks, setTracks] = useState<TrackWithFeatures[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(FOCUS_GENRES[0]);
  const { success, error: errorToast } = useToast();
  const { addToHistory } = useListeningHistory();

  const loadFocusTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = MOOD_FILTERS.focus;
      const fetchedTracks = await getRecommendationsWithFeatures(
        selectedGenre,
        20,
        filters
      );
      
      setTracks(fetchedTracks);
      setCurrentTrackIndex(0);
      
      if (fetchedTracks.length === 0) {
        errorToast('No focus tracks found. Try a different genre.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load focus tracks';
      setError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive && tracks.length === 0) {
      loadFocusTracks();
    }
  }, [isActive, selectedGenre]);

  const handleToggle = () => {
    if (!isActive) {
      setIsActive(true);
      success('Focus mode activated! Perfect for deep work.');
    } else {
      setIsActive(false);
      success('Focus mode deactivated');
    }
  };

  const handleTrackEnded = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      // Restart playlist
      setCurrentTrackIndex(0);
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  // Track listening
  useEffect(() => {
    if (currentTrack && isActive) {
      addToHistory(
        currentTrack.id,
        currentTrack.name,
        currentTrack.artists.map(a => a.name),
        selectedGenre,
        genres.find(g => g.id === selectedGenre)?.name
      );
    }
  }, [currentTrack, isActive, selectedGenre, addToHistory]);

  return (
    <div className="focus-mode">
      <div className="focus-mode-header">
        <div>
          <h2>Focus Mode</h2>
          <p className="focus-mode-subtitle">
            Curated music designed for deep work, study, and concentration
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`focus-toggle-btn ${isActive ? 'active' : ''}`}
          type="button"
        >
          {isActive ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop Focus
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Start Focus
            </>
          )}
        </button>
      </div>

      {!isActive && (
        <div className="focus-setup">
          <div className="focus-genre-selector">
            <label>Select Genre:</label>
            <div className="focus-genres">
              {FOCUS_GENRES.map(genreId => {
                const genre = genres.find(g => g.id === genreId);
                if (!genre) return null;
                return (
                  <button
                    key={genreId}
                    onClick={() => setSelectedGenre(genreId)}
                    className={`focus-genre-btn ${selectedGenre === genreId ? 'active' : ''}`}
                    style={{ borderColor: genre.color }}
                    type="button"
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="focus-info">
            <h3>What is Focus Mode?</h3>
            <ul>
              <li>🎯 Low to medium energy tracks (0.2 - 0.6)</li>
              <li>🎼 Optimized for concentration and productivity</li>
              <li>🔄 Continuous playback without interruption</li>
              <li>📊 Curated based on audio analysis</li>
            </ul>
          </div>
        </div>
      )}

      {isActive && (
        <div className="focus-active">
          {loading && (
            <div className="focus-loading">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} height="80px" />
              ))}
            </div>
          )}

          {error && (
            <div className="focus-error">
              <p>Error: {error}</p>
              <button onClick={loadFocusTracks} className="retry-btn" type="button">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && currentTrack && (
            <div className="focus-current-track">
              <div className="focus-track-info">
                <h3>{currentTrack.name}</h3>
                <p>{currentTrack.artists.map(a => a.name).join(', ')}</p>
                {currentTrack.audio_features && (
                  <div className="focus-track-features">
                    <span>Energy: {(currentTrack.audio_features.energy * 100).toFixed(0)}%</span>
                    <span>•</span>
                    <span>Tempo: {Math.round(currentTrack.audio_features.tempo)} BPM</span>
                  </div>
                )}
              </div>
              {currentTrack.preview_url ? (
                <AudioPlayer
                  previewUrl={currentTrack.preview_url}
                  trackName={currentTrack.name}
                  autoPlay={isActive}
                  onEnded={handleTrackEnded}
                />
              ) : (
                <button
                  onClick={handleTrackEnded}
                  className="skip-track-btn"
                  type="button"
                >
                  Skip (No Preview)
                </button>
              )}
            </div>
          )}

          {!loading && !error && tracks.length > 0 && (
            <div className="focus-playlist">
              <h3>Upcoming Tracks</h3>
              <div className="focus-playlist-tracks">
                {tracks.slice(currentTrackIndex + 1, currentTrackIndex + 6).map((track, idx) => (
                  <div key={track.id} className="focus-playlist-item">
                    <span className="playlist-number">{currentTrackIndex + idx + 2}</span>
                    <span className="playlist-name">{track.name}</span>
                    <span className="playlist-artist">{track.artists[0]?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

