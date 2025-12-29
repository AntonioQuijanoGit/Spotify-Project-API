import { useState } from 'react';
import type { Genre } from '../types';
import './AdvancedFilters.css';

interface AdvancedFiltersProps {
  genres: Genre[];
  onFilterChange: (filtered: Genre[]) => void;
  onClose: () => void;
}

export const AdvancedFilters = ({ genres, onFilterChange, onClose }: AdvancedFiltersProps) => {
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const allCharacteristics = Array.from(
    new Set(genres.flatMap(g => g.characteristics))
  ).sort();

  const allCategories = Array.from(
    new Set(genres.map(g => g.category))
  ).sort();

  const applyFilters = () => {
    let filtered = [...genres];

    // Year filter
    if (minYear || maxYear) {
      filtered = filtered.filter(genre => {
        if (!genre.originYear) return false;
        const year = parseInt(genre.originYear);
        const min = minYear ? parseInt(minYear) : 0;
        const max = maxYear ? parseInt(maxYear) : 9999;
        return year >= min && year <= max;
      });
    }

    // Characteristics filter
    if (selectedCharacteristics.length > 0) {
      filtered = filtered.filter(genre =>
        selectedCharacteristics.every(char => genre.characteristics.includes(char))
      );
    }

    // Categories filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(genre =>
        selectedCategories.includes(genre.category)
      );
    }

    onFilterChange(filtered);
  };

  const handleCharacteristicToggle = (char: string) => {
    setSelectedCharacteristics(prev =>
      prev.includes(char)
        ? prev.filter(c => c !== char)
        : [...prev, char]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setMinYear('');
    setMaxYear('');
    setSelectedCharacteristics([]);
    setSelectedCategories([]);
    onFilterChange(genres);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container advanced-filters-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close filters">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <h2>Advanced Filters</h2>
        </div>

        <div className="modal-body">
          {/* Year Range */}
          <div className="filter-section">
            <h3>Origin Year</h3>
            <div className="year-inputs">
              <input
                type="number"
                placeholder="Min year"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="year-input"
                min="1900"
                max="2025"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max year"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="year-input"
                min="1900"
                max="2025"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-tags">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`filter-tag ${selectedCategories.includes(category) ? 'active' : ''}`}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Characteristics */}
          <div className="filter-section">
            <h3>Characteristics</h3>
            <div className="filter-tags">
              {allCharacteristics.map(char => (
                <button
                  key={char}
                  onClick={() => handleCharacteristicToggle(char)}
                  className={`filter-tag ${selectedCharacteristics.includes(char) ? 'active' : ''}`}
                  type="button"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="filter-actions">
            <button onClick={applyFilters} className="apply-btn">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="reset-btn">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

