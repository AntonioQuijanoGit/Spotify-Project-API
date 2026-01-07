import type { Genre } from '../types';
import { GenreCard } from './GenreCard';
import './GenresGrid.css';

interface GenresGridProps {
  genres: Genre[];
  onGenreClick: (genre: Genre) => void;
  isGenreFavorite: (genreId: string) => boolean;
  onToggleFavorite: (genreId: string) => void;
}

export const GenresGrid = ({ 
  genres, 
  onGenreClick, 
  isGenreFavorite, 
  onToggleFavorite 
}: GenresGridProps) => {
  return (
    <section 
      className="genres-grid" 
      aria-label="Music genres"
      role="list"
    >
      {genres.map((genre, index) => (
        <div
          key={genre.id}
          className={`genre-grid-item slide-up stagger-${Math.min(index % 6 + 2, 6)}`}
          role="listitem"
        >
          <GenreCard
            genre={genre}
            onClick={() => onGenreClick(genre)}
            isFavorite={isGenreFavorite(genre.id)}
            onToggleFavorite={() => onToggleFavorite(genre.id)}
          />
        </div>
      ))}
    </section>
  );
};







