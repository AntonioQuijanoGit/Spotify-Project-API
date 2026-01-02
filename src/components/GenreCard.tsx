import { Heart, ChevronRight } from 'lucide-react';
import type { Genre } from '../types';
import './GenreCard.css';

interface GenreCardProps {
  genre: Genre;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const GenreCard = ({ genre, onClick, isFavorite = false, onToggleFavorite }: GenreCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <article 
      className="genre-card" 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Explore ${genre.name} genre`}
    >
      <div 
        className="genre-card-accent" 
        style={{ backgroundColor: genre.color }}
        aria-hidden="true"
      />
      
      <div className="genre-card-content">
        <div className="genre-card-header">
          <span className="genre-card-category" aria-label={`Category: ${genre.category}`}>
            {genre.category}
          </span>
          <div className="genre-card-header-right">
            {genre.originYear && (
              <time className="genre-card-year" dateTime={genre.originYear.toString()}>
                {genre.originYear}
              </time>
            )}
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
                aria-label={isFavorite ? `Remove ${genre.name} from favorites` : `Add ${genre.name} to favorites`}
                type="button"
              >
                <Heart 
                  size={18} 
                  fill={isFavorite ? 'currentColor' : 'none'} 
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>
        
        <h3 className="genre-card-title">{genre.name}</h3>
        
        <p className="genre-card-description">{genre.description}</p>
        
        <div className="genre-card-characteristics" aria-label="Genre characteristics">
          {genre.characteristics.slice(0, 3).map((char, i) => (
            <span key={i} className="characteristic-badge">
              {char}
            </span>
          ))}
        </div>
      </div>
      
      <div className="genre-card-footer">
        <button 
          className="genre-card-button"
          aria-label={`Explore ${genre.name} genre`}
          type="button"
        >
          <span>Explore</span>
          <ChevronRight 
            size={16} 
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
};
