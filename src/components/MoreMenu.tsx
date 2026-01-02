import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Sparkles, Clock, Star, TrendingUp, Focus, Smile, History, GitCompare } from 'lucide-react';
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
      icon: <Sparkles size={18} strokeWidth={2} />
    },
    { 
      id: 'timeline', 
      label: 'Genre Timeline', 
      description: 'See when different music genres emerged throughout history by decade',
      icon: <Clock size={18} strokeWidth={2} />
    },
    { 
      id: 'discovery', 
      label: 'Discovery Mode', 
      description: 'Discover 6 random genres you haven\'t favorited yet. New recommendations daily!',
      icon: <Star size={18} strokeWidth={2} />
    },
    { 
      id: 'popularity', 
      label: 'Popularity Trends', 
      description: 'View charts comparing popularity, tracks, and listeners across different genres',
      icon: <TrendingUp size={18} strokeWidth={2} />
    },
    { 
      id: 'focus', 
      label: 'Focus Mode', 
      description: 'Curated music for deep work, study, and concentration',
      icon: <Focus size={18} strokeWidth={2} />
    },
    { 
      id: 'mood', 
      label: 'Mood Search', 
      description: 'Find music that matches your current mood or activity',
      icon: <Smile size={18} strokeWidth={2} />
    },
    { 
      id: 'history', 
      label: 'Listening History', 
      description: 'View your listening history and most played genres',
      icon: <History size={18} strokeWidth={2} />
    },
    { 
      id: 'track-compare', 
      label: 'Track Comparison', 
      description: 'Compare audio features of multiple tracks side by side',
      icon: <GitCompare size={18} strokeWidth={2} />
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
        <MoreHorizontal size={18} strokeWidth={2} aria-hidden="true" />
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

