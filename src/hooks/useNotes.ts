import { useState, useEffect } from 'react';

const NOTES_KEY = 'music-explorer-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(NOTES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const setNote = (genreId: string, note: string) => {
    setNotes(prev => ({
      ...prev,
      [genreId]: note,
    }));
  };

  const getNote = (genreId: string): string => {
    return notes[genreId] || '';
  };

  const deleteNote = (genreId: string) => {
    setNotes(prev => {
      const updated = { ...prev };
      delete updated[genreId];
      return updated;
    });
  };

  return {
    setNote,
    getNote,
    deleteNote,
    hasNote: (genreId: string) => !!notes[genreId],
  };
}






