import { useState, useRef, useEffect } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSearchHistory } from '../hooks/useSearchHistory';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search genres...', onSearch }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { history, addToHistory, removeFromHistory } = useSearchHistory();

  useKeyboardShortcuts({
    onSearch: () => {
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
    setShowHistory(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (value) {
        handleClear();
      } else {
        setShowHistory(false);
      }
    } else if (e.key === 'ArrowDown' && showHistory && history.length > 0) {
      e.preventDefault();
      setSelectedHistoryIndex(prev => 
        prev < history.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showHistory && history.length > 0) {
      e.preventDefault();
      setSelectedHistoryIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedHistoryIndex >= 0 && history[selectedHistoryIndex]) {
      e.preventDefault();
      const selectedQuery = history[selectedHistoryIndex];
      onChange(selectedQuery);
      setShowHistory(false);
      setSelectedHistoryIndex(-1);
      if (onSearch) onSearch(selectedQuery);
    } else if (e.key === 'Enter' && value.trim()) {
      addToHistory(value.trim());
      if (onSearch) onSearch(value.trim());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (history.length > 0) {
      setShowHistory(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay to allow click on history items
    setTimeout(() => setShowHistory(false), 200);
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    setShowHistory(false);
    if (onSearch) onSearch(query);
    inputRef.current?.focus();
  };

  const filteredHistory = history.filter(item => 
    item.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`search-container ${isFocused ? 'search-focused' : ''}`}>
      <label htmlFor="genre-search" className="visually-hidden">
        Search for music genres
      </label>
      <svg 
        className="search-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={inputRef}
        id="genre-search"
        type="search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value && history.length > 0) {
            setShowHistory(true);
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search for music genres"
        aria-describedby={value ? "search-results-count" : undefined}
        aria-autocomplete="list"
        aria-expanded={showHistory}
        autoComplete="off"
        data-keyboard-shortcut="/"
      />
      {!isFocused && !value && (
        <div className="search-shortcut-hint" aria-hidden="true">
          <kbd>/</kbd>
        </div>
      )}
      {value && (
        <button
          onClick={handleClear}
          className="search-clear"
          aria-label="Clear search"
          type="button"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      
      {/* Search History Dropdown */}
      {showHistory && filteredHistory.length > 0 && (
        <div className="search-history" role="listbox" aria-label="Search history">
          <div className="search-history-header">
            <span>Recent searches</span>
          </div>
          {filteredHistory.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`search-history-item ${selectedHistoryIndex === index ? 'selected' : ''}`}
              onClick={() => handleHistoryClick(item)}
              onMouseEnter={() => setSelectedHistoryIndex(index)}
              role="option"
              aria-selected={selectedHistoryIndex === index}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span>{item}</span>
              <button
                type="button"
                className="search-history-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item);
                }}
                aria-label={`Remove ${item} from history`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
