import { useState, useEffect } from 'react';
import type { SpotifyTrack } from '../types';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: SpotifyTrack[];
  createdAt: string;
  updatedAt: string;
}

const PLAYLISTS_KEY = 'music-explorer-playlists';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const stored = localStorage.getItem(PLAYLISTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substring(7),
      name,
      description,
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === id
          ? { ...playlist, ...updates, updatedAt: new Date().toISOString() }
          : playlist
      )
    );
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const addTrackToPlaylist = (playlistId: string, track: SpotifyTrack) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: [...playlist.tracks.filter(t => t.id !== track.id), track],
              updatedAt: new Date().toISOString(),
            }
          : playlist
      )
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.filter(t => t.id !== trackId),
              updatedAt: new Date().toISOString(),
            }
          : playlist
      )
    );
  };

  const getPlaylist = (id: string) => {
    return playlists.find(p => p.id === id);
  };

  return {
    playlists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    getPlaylist,
  };
}





