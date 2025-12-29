import { useState } from 'react';
import { getTracksAudioFeatures } from '../utils/spotify-features';
import { searchTracks } from '../utils/spotify';
import type { SpotifyTrack, AudioFeatures } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import { useToast } from '../hooks/useToast';
import './TrackComparison.css';

export const TrackComparison = () => {
  const [tracks, setTracks] = useState<Array<{ track: SpotifyTrack; features: AudioFeatures | null }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { error: errorToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await searchTracks(searchQuery, 5);
      
      if (results.length === 0) {
        errorToast('No tracks found');
        return;
      }

      // Get audio features for all tracks
      const trackIds = results.map(t => t.id);
      const features = await getTracksAudioFeatures(trackIds);
      
      const featuresMap = new Map<string, AudioFeatures>();
      features.forEach(f => {
        if (f) featuresMap.set(f.id, f);
      });

      setTracks(
        results.map(track => ({
          track,
          features: featuresMap.get(track.id) || null,
        }))
      );
    } catch (err) {
      errorToast(err instanceof Error ? err.message : 'Failed to search tracks');
    } finally {
      setLoading(false);
    }
  };

  const removeTrack = (trackId: string) => {
    setTracks(prev => prev.filter(item => item.track.id !== trackId));
  };

  const clearAll = () => {
    setTracks([]);
  };

  const formatFeature = (value: number, type: 'percentage' | 'bpm' | 'db' = 'percentage'): string => {
    if (type === 'percentage') {
      return `${(value * 100).toFixed(0)}%`;
    } else if (type === 'bpm') {
      return `${Math.round(value)} BPM`;
    } else if (type === 'db') {
      return `${value.toFixed(1)} dB`;
    }
    return value.toFixed(2);
  };

  if (tracks.length === 0 && !loading) {
    return (
      <div className="track-comparison">
        <div className="track-comparison-header">
          <h2>Compare Tracks</h2>
          <p className="track-comparison-subtitle">
            Search and compare audio features of multiple tracks
          </p>
        </div>

        <form onSubmit={handleSearch} className="track-comparison-search">
          <input
            type="text"
            placeholder="Search for tracks to compare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tracks"
          />
          <button type="submit" disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>
    );
  }

  const allFeatures = tracks.map(t => t.features).filter(Boolean) as AudioFeatures[];
  const hasFeatures = allFeatures.length > 0;

  return (
    <div className="track-comparison">
      <div className="track-comparison-header">
        <div>
          <h2>Compare Tracks</h2>
          <p className="track-comparison-subtitle">
            {tracks.length} track{tracks.length !== 1 ? 's' : ''} selected
          </p>
        </div>
        {tracks.length > 0 && (
          <button onClick={clearAll} className="clear-all-btn" type="button">
            Clear All
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="track-comparison-search">
        <input
          type="text"
          placeholder="Search for more tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tracks"
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </button>
      </form>

          {loading && (
            <div className="track-comparison-loading">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} height="120px" />
              ))}
            </div>
          )}

      {!loading && tracks.length > 0 && (
        <div className="track-comparison-content">
          {/* Track List */}
          <div className="tracks-list">
            {tracks.map(({ track, features }) => (
              <div key={track.id} className="track-item-comparison">
                <div className="track-item-header">
                  <div className="track-item-info">
                    {track.album.images[0] && (
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        className="track-item-image"
                      />
                    )}
                    <div>
                      <h4>{track.name}</h4>
                      <p>{track.artists.map(a => a.name).join(', ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="remove-track-btn"
                    type="button"
                    aria-label="Remove track"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                {features && (
                  <div className="track-features-mini">
                    <span>⚡ {formatFeature(features.energy)}</span>
                    <span>💃 {formatFeature(features.danceability)}</span>
                    <span>🎵 {formatFeature(features.tempo, 'bpm')}</span>
                    <span>😊 {formatFeature(features.valence)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Features Comparison Chart */}
          {hasFeatures && (
            <div className="features-comparison">
              <h3>Audio Features Comparison</h3>
              <div className="features-grid">
                {(['energy', 'danceability', 'valence', 'acousticness', 'instrumentalness'] as const).map(feature => {
                  const values = allFeatures.map(f => f[feature]);
                  const max = Math.max(...values);
                  const min = Math.min(...values);
                  const avg = values.reduce((a, b) => a + b, 0) / values.length;

                  return (
                    <div key={feature} className="feature-comparison-item">
                      <div className="feature-header">
                        <span className="feature-name">{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
                        <span className="feature-avg">Avg: {formatFeature(avg)}</span>
                      </div>
                      <div className="feature-bars">
                        {tracks.map(({ track, features }, idx) => {
                          if (!features) return null;
                          const value = features[feature];
                          const percentage = (value / max) * 100;
                          return (
                            <div key={track.id} className="feature-bar-container">
                              <div
                                className="feature-bar"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: `hsl(${idx * 360 / tracks.length}, 70%, 50%)`,
                                }}
                              >
                                <span className="feature-value">{formatFeature(value)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="feature-range">
                        <span>{formatFeature(min)}</span>
                        <span>{formatFeature(max)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

