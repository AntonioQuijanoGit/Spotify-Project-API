import { useState } from 'react';

const SEARCH_HISTORY_KEY = 'music-explorer-search-history';
const MAX_HISTORY_ITEMS = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const removeFromHistory = (query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item !== query);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}

