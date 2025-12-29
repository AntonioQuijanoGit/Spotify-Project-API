import { useFavorites } from '../hooks/useFavorites';
import { useRecommendations } from '../hooks/useRecommendations';
import { GenreCard } from './GenreCard';
import './SmartRecommendations.css';

interface SmartRecommendationsProps {
  onGenreClick: (genre: any) => void;
  isGenreFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const SmartRecommendations = ({
  onGenreClick,
  isGenreFavorite,
  onToggleFavorite,
}: SmartRecommendationsProps) => {
  const { favoriteGenres } = useFavorites();
  const recommendations = useRecommendations(favoriteGenres);

  if (favoriteGenres.length === 0) {
    return (
      <div className="recommendations-empty">
        <h3>Start Discovering!</h3>
        <p>Add some genres to your favorites to get personalized recommendations</p>
      </div>
    );
  }

  return (
    <div className="smart-recommendations">
      <div className="recommendations-header">
        <h2>Recommended for You</h2>
        <p>Based on your {favoriteGenres.length} favorite{favoriteGenres.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="recommendations-grid">
        {recommendations.map(genre => (
          <GenreCard
            key={genre.id}
            genre={genre}
            onClick={() => onGenreClick(genre)}
            isFavorite={isGenreFavorite(genre.id)}
            onToggleFavorite={() => onToggleFavorite(genre.id)}
          />
        ))}
      </div>
    </div>
  );
};

