import { useState, useEffect } from 'react';
import type { PersonalCollection } from '../types';

const COLLECTIONS_KEY = 'music-explorer-collections';

export function useCollections() {
  const [collections, setCollections] = useState<PersonalCollection[]>(() => {
    try {
      const stored = localStorage.getItem(COLLECTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }, [collections]);

  const createCollection = (name: string, description?: string, color?: string): PersonalCollection => {
    const newCollection: PersonalCollection = {
      id: `collection-${Date.now()}`,
      name,
      description,
      genreIds: [],
      createdAt: Date.now(),
      color: color || '#666666',
    };
    
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<PersonalCollection>) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === id ? { ...collection, ...updates } : collection
      )
    );
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  };

  const addGenreToCollection = (collectionId: string, genreId: string) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId && !collection.genreIds.includes(genreId)
          ? { ...collection, genreIds: [...collection.genreIds, genreId] }
          : collection
      )
    );
  };

  const removeGenreFromCollection = (collectionId: string, genreId: string) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId
          ? { ...collection, genreIds: collection.genreIds.filter(id => id !== genreId) }
          : collection
      )
    );
  };

  const getCollectionById = (id: string): PersonalCollection | undefined => {
    return collections.find(c => c.id === id);
  };

  return {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addGenreToCollection,
    removeGenreFromCollection,
    getCollectionById,
  };
}





