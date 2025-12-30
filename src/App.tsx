import { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { TabNavigation, type TabType } from './components/TabNavigation';
import { FiltersSection } from './components/FiltersSection';
import { GenresGrid } from './components/GenresGrid';
import { GenreListView } from './components/GenreListView';
import { EmptyState } from './components/EmptyState';
import { HelpButton } from './components/HelpButton';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ViewToggle } from './components/ViewToggle';
import { ExportButton } from './components/ExportButton';
import { ToastContainer } from './components/ToastContainer';
import { GenreComparison } from './components/GenreComparison';
import { GenreStatistics } from './components/GenreStatistics';
import { AdvancedFilters } from './components/AdvancedFilters';
import { RadioMode } from './components/RadioMode';
import { SmartRecommendations } from './components/SmartRecommendations';
import { GenreTimeline } from './components/GenreTimeline';
import { DiscoveryMode } from './components/DiscoveryMode';
import { PopularityComparison } from './components/PopularityComparison';
import { SpotifyPlaylists } from './components/SpotifyPlaylists';
import { FocusMode } from './components/FocusMode';
import { MoodSearch } from './components/MoodSearch';
import { ListeningHistory } from './components/ListeningHistory';
import { TrackComparison } from './components/TrackComparison';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useToast } from './hooks/useToast';
import { useOffline } from './hooks/useOffline';
import { genres, categories, getGenreById } from './data/genres';
import { useFavorites } from './hooks/useFavorites';
import type { Genre } from './types';
import './App.css';

// Lazy load heavy components
const GenreDetail = lazy(() => import('./components/GenreDetail').then(m => ({ default: m.GenreDetail })));
const AdvancedSearch = lazy(() => import('./components/AdvancedSearch').then(m => ({ default: m.AdvancedSearch })));

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('genres');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [filteredGenresForAdvanced, setFilteredGenresForAdvanced] = useState<Genre[]>([]);
  
  const { toggleGenreFavorite, isGenreFavorite } = useFavorites();
  const { addToHistory } = useSearchHistory();
  const { toasts, removeToast, success } = useToast();
  const isOnline = useOffline();

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const genreParam = params.get('genre');
    const searchParam = params.get('search');
    
    if (genreParam) {
      const genre = getGenreById(genreParam);
      if (genre) {
        setSelectedGenre(genre);
        setActiveTab('genres');
      }
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
      setActiveTab('genres');
    }
  }, []);

  // Offline indicator
  useEffect(() => {
    if (!isOnline) {
      success('You are offline. Some features may be limited.');
    }
  }, [isOnline, success]);

  // Filter genres based on search, category, and favorites
  const filteredGenres = useMemo(() => {
    const baseFiltered = showAdvancedFilters && filteredGenresForAdvanced.length > 0
      ? filteredGenresForAdvanced
      : genres;
    
    return baseFiltered.filter(genre => {
      const matchesSearch = 
        genre.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        genre.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        genre.characteristics.some(char => char.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || genre.category === selectedCategory;
      
      const matchesFavorites = !showFavoritesOnly || isGenreFavorite(genre.id);
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchQuery, selectedCategory, showFavoritesOnly, isGenreFavorite, showAdvancedFilters, filteredGenresForAdvanced]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query.trim());
    }
  };

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

      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main id="main-content" className="app-main" role="main" aria-label="Main content">
        <div className="container">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'genres' && (
            <>
              <div className="genres-controls">
                <FiltersSection
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  onSearch={handleSearch}
                />
                
                <div className="genres-actions">
                  <ViewToggle view={viewMode} onViewChange={setViewMode} />
                  <button
                    onClick={() => setShowAdvancedFilters(true)}
                    className="advanced-filters-btn"
                    type="button"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Advanced Filters
                  </button>
                  <ExportButton />
                </div>
              </div>

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

              {/* Genres View */}
              {filteredGenres.length > 0 ? (
                viewMode === 'grid' ? (
                  <GenresGrid
                    genres={filteredGenres}
                    onGenreClick={handleGenreClick}
                    isGenreFavorite={isGenreFavorite}
                    onToggleFavorite={toggleGenreFavorite}
                  />
                ) : (
                  <GenreListView
                    genres={filteredGenres}
                    onGenreClick={handleGenreClick}
                    isGenreFavorite={isGenreFavorite}
                    onToggleFavorite={toggleGenreFavorite}
                  />
                )
              ) : (
                <EmptyState
                  title="No genres found"
                  description="Try adjusting your search or filters"
                />
              )}
            </>
          )}

          {activeTab === 'search' && (
            <div className="advanced-search-container slide-up">
              <Suspense fallback={
                <div style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <SkeletonLoader height="40px" width="200px" />
                  <SkeletonLoader height="52px" />
                  <SkeletonLoader height="200px" />
                </div>
              }>
                <AdvancedSearch />
              </Suspense>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="statistics-container slide-up">
              <GenreStatistics />
            </div>
          )}

          {activeTab === 'comparison' && (
            <>
              {!showComparison ? (
                <div className="comparison-trigger">
                  <button
                    onClick={() => setShowComparison(true)}
                    className="open-comparison-btn"
                    type="button"
                  >
                    Open Genre Comparison
                  </button>
                </div>
              ) : (
                <GenreComparison onClose={() => setShowComparison(false)} />
              )}
            </>
          )}

          {activeTab === 'radio' && (
            <div className="radio-container slide-up">
              <RadioMode />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-container-wrapper slide-up">
              <SmartRecommendations
                onGenreClick={handleGenreClick}
                isGenreFavorite={isGenreFavorite}
                onToggleFavorite={toggleGenreFavorite}
              />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline-container-wrapper slide-up">
              <GenreTimeline />
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="discovery-container-wrapper slide-up">
              <DiscoveryMode
                onGenreClick={handleGenreClick}
                isGenreFavorite={isGenreFavorite}
                onToggleFavorite={toggleGenreFavorite}
              />
            </div>
          )}

          {activeTab === 'popularity' && (
            <div className="popularity-container-wrapper slide-up">
              <PopularityComparison />
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="playlists-container-wrapper slide-up">
              <Suspense fallback={
                <div style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <SkeletonLoader height="40px" width="200px" />
                  <SkeletonLoader height="52px" />
                  <SkeletonLoader height="200px" />
                </div>
              }>
                <SpotifyPlaylists />
              </Suspense>
            </div>
          )}

          {activeTab === 'focus' && (
            <div className="focus-container-wrapper slide-up">
              <FocusMode />
            </div>
          )}

          {activeTab === 'mood' && (
            <div className="mood-container-wrapper slide-up">
              <MoodSearch />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-container-wrapper slide-up">
              <ListeningHistory />
            </div>
          )}

          {activeTab === 'track-compare' && (
            <div className="track-compare-container-wrapper slide-up">
              <TrackComparison />
            </div>
          )}
        </div>
      </main>

      <AppFooter />

      {/* Genre Detail Modal */}
      {selectedGenre && (
        <Suspense fallback={
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{ 
              background: 'var(--color-surface)', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--space-2xl)',
              maxWidth: '600px',
              width: '90%'
            }}>
              <SkeletonLoader height="32px" width="60%" />
              <SkeletonLoader height="20px" width="80%" className="skeleton-margin" />
              <SkeletonLoader height="200px" className="skeleton-margin" />
            </div>
          </div>
        }>
          <GenreDetail
            genre={selectedGenre}
            onClose={handleCloseDetail}
            onNavigateToGenre={handleNavigateToGenre}
          />
        </Suspense>
      )}

      {/* Help Button */}
      <HelpButton />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <AdvancedFilters
          genres={genres}
          onFilterChange={(filtered) => {
            setFilteredGenresForAdvanced(filtered);
            setShowAdvancedFilters(false);
          }}
          onClose={() => setShowAdvancedFilters(false)}
        />
      )}


      {/* Offline Indicator */}
      {!isOnline && (
        <div className="offline-indicator" role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          Offline Mode
        </div>
      )}
    </div>
  );
}

export default App;
