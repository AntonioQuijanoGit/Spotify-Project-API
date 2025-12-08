import { useEffect } from 'react';
import type { Genre } from '../types';
import { getRelatedGenres } from '../data/genres';
import { useSpotifyTracks } from '../hooks/useSpotifyTracks';
import { TrackList } from './TrackList';
import './GenreDetail.css';

interface GenreDetailProps {
  genre: Genre;
  onClose: () => void;
  onNavigateToGenre: (genreId: string) => void;
}

export const GenreDetail = ({ genre, onClose, onNavigateToGenre }: GenreDetailProps) => {
  const relatedGenres = getRelatedGenres(genre.id);
  const { tracks, loading, error } = useSpotifyTracks(genre.id);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      
      <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="genre-title">
        <div className="modal-content">
          {/* Header */}
          <header className="modal-header">
            <div className="modal-header-content">
              <div className="genre-accent-bar" style={{ backgroundColor: genre.color }} />
              <div>
                <span className="genre-detail-category">{genre.category}</span>
                <h2 id="genre-title" className="genre-detail-title">{genre.name}</h2>
                {genre.originYear && (
                  <p className="genre-detail-origin">Originated in the {genre.originYear}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="modal-close"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Content */}
          <div className="modal-body">
            {/* Description */}
            <section className="detail-section">
              <h3 className="section-heading">About</h3>
              <p className="genre-detail-description">{genre.description}</p>
            </section>

            {/* Characteristics */}
            <section className="detail-section">
              <h3 className="section-heading">Characteristics</h3>
              <div className="characteristics-list">
                {genre.characteristics.map((char, i) => (
                  <div key={i} className="characteristic-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{char}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Artists */}
            {genre.keyArtists && genre.keyArtists.length > 0 && (
              <section className="detail-section">
                <h3 className="section-heading">Key Artists</h3>
                <div className="artists-list">
                  {genre.keyArtists.map((artist, i) => (
                    <div key={i} className="artist-tag">
                      {artist}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sample Tracks - Real Spotify Integration */}
            <section className="detail-section">
              <h3 className="section-heading">Sample Tracks</h3>
              <TrackList tracks={tracks} loading={loading} error={error} />
            </section>

            {/* Related Genres */}
            {relatedGenres.length > 0 && (
              <section className="detail-section">
                <h3 className="section-heading">Related Genres</h3>
                <div className="related-genres-list">
                  {relatedGenres.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => onNavigateToGenre(related.id)}
                      className="related-genre-card"
                      style={{ borderLeftColor: related.color }}
                    >
                      <span className="related-genre-name">{related.name}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
