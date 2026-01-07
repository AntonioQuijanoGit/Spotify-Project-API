import { useState, useEffect } from 'react';

const TAGS_KEY = 'music-explorer-tags';

export interface GenreTag {
  genreId: string;
  tags: string[];
}

export function useTags() {
  const [tags, setTags] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem(TAGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }, [tags]);

  const addTag = (genreId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setTags(prev => ({
      ...prev,
      [genreId]: [...(prev[genreId] || []), tag.trim()],
    }));
  };

  const removeTag = (genreId: string, tag: string) => {
    setTags(prev => ({
      ...prev,
      [genreId]: (prev[genreId] || []).filter(t => t !== tag),
    }));
  };

  const getTags = (genreId: string): string[] => {
    return tags[genreId] || [];
  };

  const getAllTags = (): string[] => {
    const allTags = new Set<string>();
    Object.values(tags).forEach(tagList => {
      tagList.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  return {
    addTag,
    removeTag,
    getTags,
    getAllTags,
  };
}








