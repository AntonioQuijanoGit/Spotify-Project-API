import { useState } from 'react';
import './AudioFilters.css';

export interface AudioFilterValues {
  min_energy?: number;
  max_energy?: number;
  min_danceability?: number;
  max_danceability?: number;
  min_tempo?: number;
  max_tempo?: number;
  min_valence?: number;
  max_valence?: number;
}

interface AudioFiltersProps {
  onFilterChange: (filters: AudioFilterValues) => void;
  defaultFilters?: AudioFilterValues;
}

export const AudioFilters = ({ onFilterChange, defaultFilters = {} }: AudioFiltersProps) => {
  const [filters, setFilters] = useState<AudioFilterValues>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof AudioFilterValues, value: number | '') => {
    const newFilters = {
      ...filters,
      [key]: value === '' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: AudioFilterValues = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  return (
    <div className="audio-filters">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`audio-filters-toggle ${hasActiveFilters ? 'active' : ''}`}
        type="button"
        aria-expanded={isOpen}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Audio Filters
        {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v !== undefined).length}</span>}
      </button>

      {isOpen && (
        <div className="audio-filters-panel">
          <div className="audio-filters-header">
            <h3>Filter by Audio Features</h3>
            {hasActiveFilters && (
              <button onClick={handleReset} className="reset-filters-btn" type="button">
                Reset
              </button>
            )}
          </div>

          <div className="audio-filters-grid">
            {/* Energy */}
            <div className="audio-filter-group">
              <label>
                Energy: {filters.min_energy?.toFixed(1) || '0.0'} - {filters.max_energy?.toFixed(1) || '1.0'}
              </label>
              <div className="range-inputs">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.min_energy ?? 0}
                  onChange={(e) => handleChange('min_energy', parseFloat(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.max_energy ?? 1}
                  onChange={(e) => handleChange('max_energy', parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Danceability */}
            <div className="audio-filter-group">
              <label>
                Danceability: {filters.min_danceability?.toFixed(1) || '0.0'} - {filters.max_danceability?.toFixed(1) || '1.0'}
              </label>
              <div className="range-inputs">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.min_danceability ?? 0}
                  onChange={(e) => handleChange('min_danceability', parseFloat(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.max_danceability ?? 1}
                  onChange={(e) => handleChange('max_danceability', parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Tempo (BPM) */}
            <div className="audio-filter-group">
              <label>
                Tempo (BPM): {filters.min_tempo || '0'} - {filters.max_tempo || '200'}
              </label>
              <div className="range-inputs">
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={filters.min_tempo ?? 0}
                  onChange={(e) => handleChange('min_tempo', parseInt(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={filters.max_tempo ?? 200}
                  onChange={(e) => handleChange('max_tempo', parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Valence */}
            <div className="audio-filter-group">
              <label>
                Positivity: {filters.min_valence?.toFixed(1) || '0.0'} - {filters.max_valence?.toFixed(1) || '1.0'}
              </label>
              <div className="range-inputs">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.min_valence ?? 0}
                  onChange={(e) => handleChange('min_valence', parseFloat(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.max_valence ?? 1}
                  onChange={(e) => handleChange('max_valence', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



