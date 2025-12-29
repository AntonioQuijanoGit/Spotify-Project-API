import { useState, useRef, useEffect } from 'react';
import type { TabType } from './TabNavigation';
import './MoreMenu.css';

interface MoreMenuProps {
  onTabChange: (tab: TabType) => void;
  activeTab: TabType;
}

export const MoreMenu = ({ onTabChange, activeTab }: MoreMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moreTabs: Array<{ id: TabType; label: string; description: string; icon: React.ReactElement }> = [
    { 
      id: 'recommendations', 
      label: 'Smart Recommendations', 
      description: 'Get personalized genre suggestions based on your favorite genres',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    },
    { 
      id: 'timeline', 
      label: 'Genre Timeline', 
      description: 'See when different music genres emerged throughout history by decade',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <polyline points="12 3 12 21" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    { 
      id: 'discovery', 
      label: 'Discovery Mode', 
      description: 'Discover 6 random genres you haven\'t favorited yet. New recommendations daily!',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    { 
      id: 'popularity', 
      label: 'Popularity Trends', 
      description: 'View charts comparing popularity, tracks, and listeners across different genres',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    { 
      id: 'focus', 
      label: 'Focus Mode', 
      description: 'Curated music for deep work, study, and concentration',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    { 
      id: 'mood', 
      label: 'Mood Search', 
      description: 'Find music that matches your current mood or activity',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )
    },
    { 
      id: 'history', 
      label: 'Listening History', 
      description: 'View your listening history and most played genres',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    { 
      id: 'track-compare', 
      label: 'Track Comparison', 
      description: 'Compare audio features of multiple tracks side by side',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      )
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="more-menu-container" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`more-menu-button ${isOpen ? 'active' : ''}`}
        type="button"
        aria-label="More options"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
        <span>More Features</span>
      </button>
      {isOpen && (
        <div 
          className="more-menu-dropdown" 
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
            {moreTabs.map(tab => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTabChange(tab.id);
                  setIsOpen(false);
                }}
                className={`more-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                type="button"
                role="menuitem"
                aria-label={tab.label}
              >
                <span className="more-menu-icon" aria-hidden="true">
                  {tab.icon}
                </span>
                <div className="more-menu-content">
                  <span className="more-menu-label">{tab.label}</span>
                  <span className="more-menu-description">{tab.description}</span>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

