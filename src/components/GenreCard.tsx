import type { Genre } from '../types';
import './GenreCard.css';

interface GenreCardProps {
  genre: Genre;
  onClick: () => void;
}

export const GenreCard = ({ genre, onClick }: GenreCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
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
          {genre.originYear && (
            <time className="genre-card-year" dateTime={genre.originYear.toString()}>
              {genre.originYear}
            </time>
          )}
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
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </article>
  );
};
