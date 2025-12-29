import { useState, useMemo } from 'react';
import { genres } from '../data/genres';
import { GenreCard } from './GenreCard';
import { useFavorites } from '../hooks/useFavorites';
import type { Genre } from '../types';
import './DiscoveryMode.css';

export const DiscoveryMode = ({
  onGenreClick,
  isGenreFavorite,
  onToggleFavorite,
}: {
  onGenreClick: (genre: any) => void;
  isGenreFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}) => {
  const { favoriteGenres } = useFavorites();
  const [lastDiscoveryDate, setLastDiscoveryDate] = useState(() => {
    return localStorage.getItem('last-discovery-date') || '';
  });

  const today = new Date().toDateString();

  const discoveryGenres = useMemo(() => {
    // If it's a new day, generate new recommendations
    if (lastDiscoveryDate !== today) {
      const undiscovered = genres.filter(g => !favoriteGenres.includes(g.id));
      const shuffled = [...undiscovered].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 6);
    }
    // Return cached recommendations
    const cached = localStorage.getItem('discovery-genres');
    if (cached) {
      try {
        const ids = JSON.parse(cached);
        return ids.map((id: string) => genres.find(g => g.id === id)).filter(Boolean);
      } catch {
        return [];
      }
    }
    return [];
  }, [favoriteGenres, lastDiscoveryDate, today]);

  const handleNewDiscovery = () => {
    const undiscovered = genres.filter(g => !favoriteGenres.includes(g.id));
    const shuffled = [...undiscovered].sort(() => Math.random() - 0.5);
    const newGenres = shuffled.slice(0, 6);
    localStorage.setItem('discovery-genres', JSON.stringify(newGenres.map(g => g.id)));
    setLastDiscoveryDate(today);
    localStorage.setItem('last-discovery-date', today);
  };

  return (
    <div className="discovery-mode">
      <div className="discovery-header">
        <h2>🌟 Daily Discovery</h2>
        <p>
          {lastDiscoveryDate === today
            ? 'Your discoveries for today'
            : 'Discover new genres curated just for you'}
        </p>
        <div className="discovery-explanation">
          <p>🎲 <strong>How it works:</strong> Shows 6 random genres that you haven't favorited yet. Click "Generate New Discoveries" to get a fresh selection.</p>
          <p>🎵 <strong>About the tracks:</strong> When you click on a genre, the tracks shown are real recommendations from Spotify's API based on that specific genre - not random!</p>
        </div>
        {lastDiscoveryDate !== today && (
          <button onClick={handleNewDiscovery} className="discovery-generate-btn">
            Generate New Discoveries
          </button>
        )}
      </div>

      {discoveryGenres.length > 0 ? (
        <div className="discovery-grid">
          {discoveryGenres.map((genre: Genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onClick={() => onGenreClick(genre)}
              isFavorite={isGenreFavorite(genre.id)}
              onToggleFavorite={() => onToggleFavorite(genre.id)}
            />
          ))}
        </div>
      ) : (
        <div className="discovery-empty">
          <p>Click "Generate New Discoveries" to find new genres!</p>
        </div>
      )}
    </div>
  );
};

