import { useMemo } from 'react';
import { genres } from '../data/genres';
import type { Genre } from '../types';

export function useRecommendations(favoriteGenreIds: string[]) {
  const recommendations = useMemo(() => {
    if (favoriteGenreIds.length === 0) {
      // If no favorites, return random genres
      return genres.sort(() => Math.random() - 0.5).slice(0, 6);
    }

    // Get favorite genres
    const favoriteGenres = genres.filter(g => favoriteGenreIds.includes(g.id));
    
    // Find related genres
    const relatedGenres = new Set<string>();
    favoriteGenres.forEach(genre => {
      genre.relatedGenres.forEach(relatedId => {
        if (!favoriteGenreIds.includes(relatedId)) {
          relatedGenres.add(relatedId);
        }
      });
    });

    // Find genres with similar characteristics
    const favoriteCharacteristics = new Set<string>();
    favoriteGenres.forEach(genre => {
      genre.characteristics.forEach(char => favoriteCharacteristics.add(char));
    });

    const similarGenres = genres
      .filter(g => !favoriteGenreIds.includes(g.id))
      .map(genre => {
        const commonChars = genre.characteristics.filter(char =>
          favoriteCharacteristics.has(char)
        ).length;
        return { genre, score: commonChars };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.genre);

    // Combine related and similar genres, remove duplicates
    const allRecommendations = [
      ...Array.from(relatedGenres).map(id => genres.find(g => g.id === id)).filter(Boolean) as Genre[],
      ...similarGenres
    ];

    // Remove duplicates and limit
    const unique = Array.from(
      new Map(allRecommendations.map(g => [g.id, g])).values()
    ).slice(0, 12);

    return unique.length > 0 ? unique : genres.slice(0, 6);
  }, [favoriteGenreIds]);

  return recommendations;
}






