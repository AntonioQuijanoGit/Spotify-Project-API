import { useState } from 'react';
import { exportFavoritesToJSON, exportFavoritesToCSV } from '../utils/export';
import { useFavorites } from '../hooks/useFavorites';
import { genres } from '../data/genres';
import { useToast } from '../hooks/useToast';
import './ExportButton.css';

export const ExportButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { favoriteGenres } = useFavorites();
  const { success, error } = useToast();

  const handleExportJSON = () => {
    try {
      exportFavoritesToJSON(favoriteGenres, genres);
      success('Favorites exported to JSON!');
      setShowMenu(false);
    } catch (err) {
      error('Failed to export. Please try again.');
    }
  };

  const handleExportCSV = () => {
    try {
      exportFavoritesToCSV(favoriteGenres, genres);
      success('Favorites exported to CSV!');
      setShowMenu(false);
    } catch (err) {
      error('Failed to export. Please try again.');
    }
  };

  if (favoriteGenres.length === 0) {
    return null;
  }

  return (
    <div className="export-button-container">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="export-button"
        aria-label="Export favorites"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export ({favoriteGenres.length})
      </button>
      {showMenu && (
        <>
          <div className="export-menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="export-menu">
            <button onClick={handleExportJSON} className="export-menu-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Export as JSON
            </button>
            <button onClick={handleExportCSV} className="export-menu-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Export as CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
};






