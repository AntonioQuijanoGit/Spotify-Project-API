import { useState, useEffect } from 'react';
import type { ListeningHistoryItem } from '../types';

const LISTENING_HISTORY_KEY = 'music-explorer-listening-history';
const MAX_HISTORY_ITEMS = 500;

export function useListeningHistory() {
  const [history, setHistory] = useState<ListeningHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(LISTENING_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LISTENING_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (
    trackId: string,
    trackName: string,
    artists: string[],
    genreId?: string,
    genreName?: string,
    duration: number = 0
  ) => {
    setHistory(prev => {
      const newItem: ListeningHistoryItem = {
        trackId,
        trackName,
        artists,
        genreId,
        genreName,
        timestamp: Date.now(),
        duration,
      };
      
      // Remove duplicates (same track within last minute)
      const filtered = prev.filter(
        item => !(item.trackId === trackId && Date.now() - item.timestamp < 60000)
      );
      
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (trackId: string, timestamp: number) => {
    setHistory(prev => 
      prev.filter(item => !(item.trackId === trackId && item.timestamp === timestamp))
    );
  };

  const getHistoryByGenre = (genreId: string): ListeningHistoryItem[] => {
    return history.filter(item => item.genreId === genreId);
  };

  const getHistoryByDate = (days: number): ListeningHistoryItem[] => {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return history.filter(item => item.timestamp >= cutoff);
  };

  const getTotalListeningTime = (): number => {
    return history.reduce((total, item) => total + item.duration, 0);
  };

  const getMostListenedGenres = (limit: number = 10): Array<{ genreId: string; genreName: string; count: number }> => {
    const genreCounts = new Map<string, { name: string; count: number }>();
    
    history.forEach(item => {
      if (item.genreId && item.genreName) {
        const current = genreCounts.get(item.genreId) || { name: item.genreName, count: 0 };
        genreCounts.set(item.genreId, { name: item.genreName, count: current.count + 1 });
      }
    });

    return Array.from(genreCounts.entries())
      .map(([genreId, data]) => ({ genreId, genreName: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getHistoryByGenre,
    getHistoryByDate,
    getTotalListeningTime,
    getMostListenedGenres,
  };
}




