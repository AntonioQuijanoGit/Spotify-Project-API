import { useState } from 'react';
import { MOOD_LABELS, MOOD_DESCRIPTIONS } from '../utils/moods';
import type { Mood } from '../types';
import { useSpotifyTracks } from '../hooks/useSpotifyTracks';
import { genres } from '../data/genres';
import { TrackList } from './TrackList';
import { SkeletonLoader } from './SkeletonLoader';
import './MoodSearch.css';

export const MoodSearch = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const moodList: Mood[] = ['study', 'workout', 'relax', 'party', 'focus', 'sleep', 'happy', 'sad', 'energetic', 'calm'];

  // Get tracks for selected genre (we'll filter by mood client-side or use recommendations API)
  const { tracks, loading, error } = useSpotifyTracks(selectedGenre || genres[0].id);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    // Select a random genre or let user choose
    if (!selectedGenre) {
      setSelectedGenre(genres[Math.floor(Math.random() * genres.length)].id);
    }
  };

  return (
    <div className="mood-search">
      <div className="mood-search-header">
        <h2>Search by Mood</h2>
        <p className="mood-search-subtitle">
          Find music that matches your current mood or activity
        </p>
      </div>

      <div className="mood-grid">
        {moodList.map(mood => {
          const getIcon = () => {
            switch (mood) {
              case 'study':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                );
              case 'workout':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 6.5h11v11h-11z" />
                    <path d="M6.5 12h11" />
                    <path d="M12 6.5v11" />
                  </svg>
                );
              case 'relax':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                );
              case 'party':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                );
              case 'focus':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                );
              case 'sleep':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                );
              case 'happy':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                );
              case 'sad':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                );
              case 'energetic':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                );
              case 'calm':
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                );
              default:
                return null;
            }
          };

          return (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className={`mood-card ${selectedMood === mood ? 'active' : ''}`}
              type="button"
            >
              <div className="mood-icon">
                {getIcon()}
              </div>
              <h3>{MOOD_LABELS[mood]}</h3>
              <p>{MOOD_DESCRIPTIONS[mood]}</p>
            </button>
          );
        })}
      </div>

      {selectedMood && (
        <div className="mood-results">
          <div className="mood-results-header">
            <h3>
              {MOOD_LABELS[selectedMood]} Music
              {selectedGenre && ` • ${genres.find(g => g.id === selectedGenre)?.name}`}
            </h3>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="mood-loading">
              {[...Array(5)].map((_, i) => (
                <SkeletonLoader key={i} height="80px" />
              ))}
            </div>
          )}

          {error && (
            <div className="mood-error">
              <p>Error loading tracks: {error}</p>
            </div>
          )}

          {!loading && !error && tracks.length > 0 && (
            <TrackList tracks={tracks} loading={false} error={null} />
          )}

          {!loading && !error && tracks.length === 0 && (
            <div className="mood-empty">
              <p>No tracks found for this mood and genre combination.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

