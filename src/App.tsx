import { useState, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { GenreCard } from './components/GenreCard';
import { GenreDetail } from './components/GenreDetail';
import { genres, categories, getGenreById } from './data/genres';
import type { Genre } from './types';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  // Filter genres based on search and category
  const filteredGenres = useMemo(() => {
    return genres.filter(genre => {
      const matchesSearch = 
        genre.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        genre.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        genre.characteristics.some(char => char.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || genre.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleGenreClick = (genre: Genre) => {
    setSelectedGenre(genre);
  };

  const handleCloseDetail = () => {
    setSelectedGenre(null);
  };

  const handleNavigateToGenre = (genreId: string) => {
    const genre = getGenreById(genreId);
    if (genre) {
      setSelectedGenre(genre);
    }
  };

  return (
    <div className="app">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="app-header" role="banner">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="app-title">Music Genre Explorer</h1>
              <p className="app-subtitle">
                Discover and explore the rich diversity of musical genres
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="app-main" role="main" aria-label="Main content">
        <div className="container">
          {/* Search and Filters */}
          <section className="controls-section slide-up" aria-label="Search and filter controls">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search genres, characteristics, artists..."
            />
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </section>

          {/* Results Count */}
          <div 
            id="search-results-count"
            className="results-info slide-up stagger-1" 
            role="status" 
            aria-live="polite" 
            aria-atomic="true"
          >
            <p className="results-count">
              <span className="visually-hidden">Search results: </span>
              {filteredGenres.length} {filteredGenres.length === 1 ? 'genre' : 'genres'} found
            </p>
          </div>

          {/* Genres Grid */}
          {filteredGenres.length > 0 ? (
            <section 
              className="genres-grid" 
              aria-label="Music genres"
              role="list"
            >
              {filteredGenres.map((genre, index) => (
                <div
                  key={genre.id}
                  className={`genre-grid-item slide-up stagger-${Math.min(index % 6 + 2, 6)}`}
                  role="listitem"
                >
                  <GenreCard
                    genre={genre}
                    onClick={() => handleGenreClick(genre)}
                  />
                </div>
              ))}
            </section>
          ) : (
            <div className="empty-state slide-up stagger-2" role="status" aria-live="polite">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h2 className="empty-title">No genres found</h2>
              <p className="empty-description">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        <div className="container">
          <p className="footer-text">
            Built with React + TypeScript • Designed with care for accessibility and user experience
          </p>
        </div>
      </footer>

      {/* Genre Detail Modal */}
      {selectedGenre && (
        <GenreDetail
          genre={selectedGenre}
          onClose={handleCloseDetail}
          onNavigateToGenre={handleNavigateToGenre}
        />
      )}
    </div>
  );
}

export default App;
