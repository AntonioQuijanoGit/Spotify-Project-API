import { useState } from 'react';
import { Music2 } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { SkeletonLoader } from './SkeletonLoader';
import { PlaylistManager } from './PlaylistManager';
import type { SpotifyTrack } from '../types';
import './TrackList.css';

interface TrackListProps {
  tracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
}

export const TrackList = ({ tracks, loading, error }: TrackListProps) => {
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  if (loading) {
    return (
      <div className="track-list-loading" role="status" aria-live="polite" aria-label="Loading tracks">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="track-item-skeleton">
            <SkeletonLoader width="64px" height="64px" className="skeleton-cover" />
            <div className="skeleton-track-info">
              <SkeletonLoader height="20px" width="60%" />
              <SkeletonLoader height="16px" width="40%" className="skeleton-margin" />
              <SkeletonLoader height="32px" width="80%" className="skeleton-margin" />
            </div>
            <SkeletonLoader width="120px" height="36px" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-list-error" role="alert" aria-live="assertive">
        <div className="error-icon-wrapper">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3>Unable to load tracks</h3>
        <p className="error-message">
          {error.includes('401') || error.includes('token')
            ? 'Spotify authentication expired. Please refresh the page.'
            : error.includes('network') || error.includes('fetch')
            ? 'Network error. Please check your connection and try again.'
            : 'Something went wrong while loading tracks from Spotify.'}
        </p>
        <span className="error-detail">{error}</span>
        <button 
          className="error-retry-button"
          onClick={() => window.location.reload()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="track-list-empty" role="status" aria-live="polite">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>No tracks found for this genre</p>
      </div>
    );
  }

  return (
    <div className="track-list" role="list" aria-label="Sample tracks">
      {tracks.map((track) => (
        <article key={track.id} className="track-item" role="listitem">
          {/* Album Cover */}
          <div className="track-cover">
            {track.album.images[0] ? (
              <img
                src={track.album.images[0].url}
                alt={`${track.album.name} album cover`}
                loading="lazy"
                width="64"
                height="64"
              />
            ) : (
              <div className="track-cover-placeholder" aria-hidden="true">
                <Music2 size={24} />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="track-info">
            <h4 className="track-name">{track.name}</h4>
            <p className="track-artists" aria-label={`Artists: ${track.artists.map(a => a.name).join(', ')}`}>
              {track.artists.map(a => a.name).join(', ')}
            </p>
            
            {/* Audio Player - Only show if preview is available */}
            {track.preview_url && (
              <AudioPlayer
                previewUrl={track.preview_url}
                trackName={track.name}
              />
            )}
          </div>

          {/* Actions */}
          <div className="track-actions">
            <button
              onClick={() => {
                setSelectedTrack(track);
                setShowPlaylistManager(true);
              }}
              className="track-playlist-btn"
              aria-label={`Add ${track.name} to playlist`}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add to Playlist
            </button>
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="track-spotify-link"
              aria-label={`Open ${track.name} in Spotify`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Open in Spotify</span>
            </a>
          </div>
        </article>
      ))}
      
      {/* Playlist Manager Modal */}
      {showPlaylistManager && selectedTrack && (
        <PlaylistManager
          track={selectedTrack}
          onClose={() => {
            setShowPlaylistManager(false);
            setSelectedTrack(null);
          }}
        />
      )}
    </div>
  );
};
