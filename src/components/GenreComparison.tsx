import { useState } from 'react';
import type { Genre } from '../types';
import { genres } from '../data/genres';
import './GenreComparison.css';

interface GenreComparisonProps {
  onClose: () => void;
}

export const GenreComparison = ({ onClose }: GenreComparisonProps) => {
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const availableGenres = genres.filter(genre => 
    !selectedGenres.find(g => g.id === genre.id) &&
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGenre = (genre: Genre) => {
    if (selectedGenres.length < 3 && !selectedGenres.find(g => g.id === genre.id)) {
      setSelectedGenres([...selectedGenres, genre]);
      setSearchQuery('');
    }
  };

  const handleRemoveGenre = (genreId: string) => {
    setSelectedGenres(selectedGenres.filter(g => g.id !== genreId));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container comparison-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close comparison">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <h2>Compare Genres</h2>
          <p className="modal-subtitle">Select up to 3 genres to compare</p>
        </div>

        <div className="modal-body">
          {/* Search */}
          <div className="comparison-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search genres to add..."
              className="comparison-search-input"
            />
          </div>

          {/* Selected Genres */}
          <div className="selected-genres">
            {selectedGenres.map((genre) => (
              <div key={genre.id} className="selected-genre-card">
                <div className="selected-genre-header">
                  <h3 style={{ color: genre.color }}>{genre.name}</h3>
                  <button
                    onClick={() => handleRemoveGenre(genre.id)}
                    className="remove-genre-btn"
                    aria-label={`Remove ${genre.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <p className="selected-genre-description">{genre.description}</p>
                <div className="selected-genre-characteristics">
                  {genre.characteristics.slice(0, 3).map((char, i) => (
                    <span key={i} className="characteristic-tag">{char}</span>
                  ))}
                </div>
              </div>
            ))}
            {selectedGenres.length === 0 && (
              <div className="empty-selection">
                <p>No genres selected. Search and add genres to compare.</p>
              </div>
            )}
          </div>

          {/* Available Genres */}
          {searchQuery && availableGenres.length > 0 && (
            <div className="available-genres">
              <h3>Available Genres</h3>
              <div className="available-genres-grid">
                {availableGenres.slice(0, 6).map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleAddGenre(genre)}
                    className="available-genre-btn"
                    disabled={selectedGenres.length >= 3}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedGenres.length >= 2 && (
            <div className="comparison-table">
              <h3>Comparison</h3>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    {selectedGenres.map(genre => (
                      <th key={genre.id} style={{ color: genre.color }}>
                        {genre.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Category</td>
                    {selectedGenres.map(genre => (
                      <td key={genre.id}>{genre.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Characteristics</td>
                    {selectedGenres.map(genre => (
                      <td key={genre.id}>
                        <div className="comparison-characteristics">
                          {genre.characteristics.map((char, i) => (
                            <span key={i} className="comparison-tag">{char}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Description</td>
                    {selectedGenres.map(genre => (
                      <td key={genre.id} className="comparison-description">
                        {genre.description}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};






