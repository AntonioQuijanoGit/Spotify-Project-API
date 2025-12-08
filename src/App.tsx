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
      {/* Header */}
      <header className="app-header">
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
      <main className="app-main">
        <div className="container">
          {/* Search and Filters */}
          <div className="controls-section slide-up">
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
          </div>

          {/* Results Count */}
          <div className="results-info slide-up stagger-1">
            <p className="results-count">
              {filteredGenres.length} {filteredGenres.length === 1 ? 'genre' : 'genres'} found
            </p>
          </div>

          {/* Genres Grid */}
          {filteredGenres.length > 0 ? (
            <div className="genres-grid">
              {filteredGenres.map((genre, index) => (
                <div
                  key={genre.id}
                  className={`genre-grid-item slide-up stagger-${Math.min(index % 6 + 2, 6)}`}
                >
                  <GenreCard
                    genre={genre}
                    onClick={() => handleGenreClick(genre)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state slide-up stagger-2">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3 className="empty-title">No genres found</h3>
              <p className="empty-description">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
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
