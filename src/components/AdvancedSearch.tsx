import { useState } from 'react';
import { User, Disc } from 'lucide-react';
import { searchArtists, searchAlbums, getArtistTopTracks, getAlbumTracks } from '../utils/spotify';
import type { SpotifyArtist, SpotifyAlbum, SpotifyTrack } from '../types';
import { TrackList } from './TrackList';
import './AdvancedSearch.css';

type SearchType = 'artists' | 'albums';

export const AdvancedSearch = () => {
  const [searchType, setSearchType] = useState<SearchType>('artists');
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [artistTracks, setArtistTracks] = useState<SpotifyTrack[]>([]);
  const [albumTracks, setAlbumTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracksLoading, setTracksLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (searchType === 'artists') {
        const results = await searchArtists(query, 10);
        setArtists(results);
        setAlbums([]);
      } else {
        const results = await searchAlbums(query, 10);
        setAlbums(results);
        setArtists([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  const handleArtistClick = async (artist: SpotifyArtist) => {
    setSelectedArtist(artist);
    setSelectedAlbum(null);
    setTracksLoading(true);
    setError(null);

    try {
      const tracks = await getArtistTopTracks(artist.id, 10);
      setArtistTracks(tracks);
      setAlbumTracks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracks');
    } finally {
      setTracksLoading(false);
    }
  };

  const handleAlbumClick = async (album: SpotifyAlbum) => {
    setSelectedAlbum(album);
    setSelectedArtist(null);
    setTracksLoading(true);
    setError(null);

    try {
      const tracks = await getAlbumTracks(album.id);
      setAlbumTracks(tracks);
      setArtistTracks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracks');
    } finally {
      setTracksLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="advanced-search">
      <div className="advanced-search-header">
        <h2>Search Artists & Albums</h2>
        <div className="search-type-toggle">
          <button
            onClick={() => setSearchType('artists')}
            className={searchType === 'artists' ? 'active' : ''}
            type="button"
          >
            Artists
          </button>
          <button
            onClick={() => setSearchType('albums')}
            className={searchType === 'albums' ? 'active' : ''}
            type="button"
          >
            Albums
          </button>
        </div>
      </div>

      <div className="advanced-search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${searchType}...`}
          className="search-input-field"
        />
        <button onClick={handleSearch} disabled={loading || !query.trim()} type="button">
          <span>{loading ? 'Searching...' : 'Search'}</span>
        </button>
      </div>

      {error && (
        <div className="advanced-search-error" role="alert">
          {error}
        </div>
      )}

      {artists.length > 0 && (
        <div className="search-results">
          <h3>Artists</h3>
          <div className="artists-grid">
            {artists.map((artist) => (
              <button
                key={artist.id}
                onClick={() => handleArtistClick(artist)}
                className={`artist-card ${selectedArtist?.id === artist.id ? 'selected' : ''}`}
                type="button"
              >
                {artist.images[0] ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="artist-image"
                  />
                ) : (
                  <div className="artist-image-placeholder">
                    <User size={48} />
                    <span>{artist.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className="artist-info">
                  <h4>{artist.name}</h4>
                  <p>{artist.followers.total.toLocaleString()} followers</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {albums.length > 0 && (
        <div className="search-results">
          <h3>Albums</h3>
          <div className="albums-grid">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumClick(album)}
                className={`album-card ${selectedAlbum?.id === album.id ? 'selected' : ''}`}
                type="button"
              >
                {album.images[0] ? (
                  <img
                    src={album.images[0].url}
                    alt={album.name}
                    className="album-image"
                  />
                ) : (
                  <div className="album-image-placeholder">
                    <Disc size={48} />
                    <span>{album.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className="album-info">
                  <h4>{album.name}</h4>
                  <p>{album.artists.map(a => a.name).join(', ')}</p>
                  <p className="album-meta">{album.release_date} • {album.total_tracks} tracks</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(selectedArtist || selectedAlbum) && (
        <div className="selected-tracks">
          <h3>
            {selectedArtist ? `${selectedArtist.name} - Top Tracks` : `${selectedAlbum?.name} - Tracks`}
          </h3>
          <TrackList
            tracks={selectedArtist ? artistTracks : albumTracks}
            loading={tracksLoading}
            error={null}
          />
        </div>
      )}
    </div>
  );
};

