import type { Genre } from '../types';
import './GenreCard.css';

interface GenreCardProps {
  genre: Genre;
  onClick: () => void;
}

export const GenreCard = ({ genre, onClick }: GenreCardProps) => {
  return (
    <article className="genre-card" onClick={onClick}>
      <div className="genre-card-accent" style={{ backgroundColor: genre.color }} />
      
      <div className="genre-card-content">
        <div className="genre-card-header">
          <span className="genre-card-category">{genre.category}</span>
          {genre.originYear && (
            <span className="genre-card-year">{genre.originYear}</span>
          )}
        </div>
        
        <h3 className="genre-card-title">{genre.name}</h3>
        
        <p className="genre-card-description">{genre.description}</p>
        
        <div className="genre-card-characteristics">
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
          aria-label={`Explore ${genre.name}`}
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
