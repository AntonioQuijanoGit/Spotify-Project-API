import { MoreMenu } from './MoreMenu';
import './TabNavigation.css';

export type TabType = 'genres' | 'search' | 'statistics' | 'comparison' | 'radio' | 'recommendations' | 'timeline' | 'discovery' | 'popularity' | 'playlists' | 'focus' | 'mood' | 'history' | 'track-compare';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="tab-navigation slide-up">
      <button
        onClick={() => onTabChange('genres')}
        className={`tab-button ${activeTab === 'genres' ? 'active' : ''}`}
        type="button"
        aria-label="Genres tab"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span>Genres</span>
      </button>
      <button
        onClick={() => onTabChange('search')}
        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
        type="button"
        aria-label="Search Artists & Albums tab"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Search</span>
      </button>
      <button
        onClick={() => onTabChange('statistics')}
        className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
        type="button"
        aria-label="Statistics tab"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span>Statistics</span>
      </button>
      <button
        onClick={() => onTabChange('comparison')}
        className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
        type="button"
        aria-label="Comparison tab"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span>Compare</span>
      </button>
      <button
        onClick={() => onTabChange('radio')}
        className={`tab-button ${activeTab === 'radio' ? 'active' : ''}`}
        type="button"
        aria-label="Radio mode tab"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>Radio</span>
      </button>
      <button
        onClick={() => onTabChange('playlists')}
        className={`tab-button ${activeTab === 'playlists' ? 'active' : ''}`}
        type="button"
        aria-label="Playlists tab"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        <span>Playlists</span>
      </button>
      <MoreMenu onTabChange={onTabChange} activeTab={activeTab} />
    </div>
  );
};

