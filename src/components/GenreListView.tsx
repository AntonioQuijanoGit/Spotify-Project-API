import type { Genre } from '../types';
import './GenreListView.css';

interface GenreListViewProps {
  genres: Genre[];
  onGenreClick: (genre: Genre) => void;
  isGenreFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const GenreListView = ({
  genres,
  onGenreClick,
  isGenreFavorite,
  onToggleFavorite,
}: GenreListViewProps) => {
  return (
    <div className="genre-list-view" role="list" aria-label="Music genres list">
      {genres.map((genre) => (
        <div
          key={genre.id}
          className="genre-list-item"
          onClick={() => onGenreClick(genre)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGenreClick(genre);
            }
          }}
          tabIndex={0}
          role="listitem"
          aria-label={`Explore ${genre.name} genre`}
        >
          <div className="genre-list-content">
            <div className="genre-list-header">
              <h3 style={{ color: genre.color }}>{genre.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(genre.id);
                }}
                className={`favorite-btn ${isGenreFavorite(genre.id) ? 'active' : ''}`}
                aria-label={`${isGenreFavorite(genre.id) ? 'Remove from' : 'Add to'} favorites`}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isGenreFavorite(genre.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <p className="genre-list-description">{genre.description}</p>
            <div className="genre-list-meta">
              <span className="genre-category">{genre.category}</span>
              {genre.originYear && (
                <span className="genre-year">Since {genre.originYear}</span>
              )}
              <span className="genre-characteristics-count">
                {genre.characteristics.length} characteristics
              </span>
            </div>
            <div className="genre-list-characteristics">
              {genre.characteristics.slice(0, 5).map((char, i) => (
                <span key={i} className="characteristic-badge">{char}</span>
              ))}
              {genre.characteristics.length > 5 && (
                <span className="characteristic-more">+{genre.characteristics.length - 5} more</span>
              )}
            </div>
          </div>
          <div className="genre-list-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};



