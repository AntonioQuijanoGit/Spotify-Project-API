import { AudioPlayer } from './AudioPlayer';
import type { SpotifyTrack } from '../types';
import './TrackList.css';

interface TrackListProps {
  tracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
}

export const TrackList = ({ tracks, loading, error }: TrackListProps) => {
  if (loading) {
    return (
      <div className="track-list-loading" role="status" aria-live="polite" aria-label="Loading tracks">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading tracks from Spotify...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-list-error" role="alert" aria-live="assertive">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>Failed to load tracks</p>
        <span className="error-detail">{error}</span>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="track-info">
            <h4 className="track-name">{track.name}</h4>
            <p className="track-artists" aria-label={`Artists: ${track.artists.map(a => a.name).join(', ')}`}>
              {track.artists.map(a => a.name).join(', ')}
            </p>
            
            {/* Audio Player */}
            <AudioPlayer
              previewUrl={track.preview_url}
              trackName={track.name}
            />
          </div>

          {/* Spotify Link */}
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
        </article>
      ))}
    </div>
  );
};
