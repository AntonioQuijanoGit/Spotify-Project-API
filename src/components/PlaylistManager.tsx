import { useState } from 'react';
import { usePlaylists } from '../hooks/usePlaylists';
import type { SpotifyTrack } from '../types';
import './PlaylistManager.css';

interface PlaylistManagerProps {
  track?: SpotifyTrack;
  onClose: () => void;
}

export const PlaylistManager = ({ track, onClose }: PlaylistManagerProps) => {
  const { playlists, createPlaylist, addTrackToPlaylist, deletePlaylist } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      if (track) {
        addTrackToPlaylist(playlistId, track);
      }
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (track) {
      addTrackToPlaylist(playlistId, track);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container playlist-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close playlist manager">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <h2>{track ? 'Add to Playlist' : 'My Playlists'}</h2>
          {track && (
            <p className="modal-subtitle">
              Adding: <strong>{track.name}</strong> by {track.artists.map(a => a.name).join(', ')}
            </p>
          )}
        </div>

        <div className="modal-body">
          <button
            className="create-playlist-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Playlist
          </button>

          {showCreateForm && (
            <div className="create-playlist-form">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="playlist-name-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePlaylist();
                  if (e.key === 'Escape') setShowCreateForm(false);
                }}
                autoFocus
              />
              <div className="create-playlist-actions">
                <button onClick={handleCreatePlaylist} className="save-btn">
                  Create
                </button>
                <button onClick={() => setShowCreateForm(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="playlists-list">
            {playlists.length === 0 ? (
              <div className="empty-playlists">
                <p>No playlists yet. Create one to get started!</p>
              </div>
            ) : (
              playlists.map((playlist) => (
                <div key={playlist.id} className="playlist-item">
                  <div className="playlist-info">
                    <h3>{playlist.name}</h3>
                    <p>{playlist.tracks.length} tracks</p>
                  </div>
                  <div className="playlist-actions">
                    {track && (
                      <button
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className="add-to-playlist-btn"
                      >
                        Add
                      </button>
                    )}
                    <button
                      onClick={() => deletePlaylist(playlist.id)}
                      className="delete-playlist-btn"
                      aria-label={`Delete ${playlist.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




