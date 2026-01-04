import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { Music } from 'lucide-react';
import type { TabType } from './TabNavigation';
import './AppHeader.css';

interface AppHeaderProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const AppHeader = ({ activeTab, onTabChange }: AppHeaderProps) => {
  return (
    <header className="app-header" role="banner">
      <div className="container">
        <div className="header-content">
          {activeTab && onTabChange && (
            <div className="header-left">
              <MobileMenu activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          )}
          <div className="header-text">
            <div className="title-wrapper">
              <div className="title-icon-wrapper">
                <div className="title-icon">
                  <Music size={36} strokeWidth={2} />
                </div>
                <div className="icon-glow"></div>
              </div>
              <div className="title-content">
                <h1 className="app-title">
                  <span className="title-main">Music Genre</span>
                  <span className="title-accent">Explorer</span>
                </h1>
                <div className="title-decoration"></div>
              </div>
            </div>
            <div className="subtitle-wrapper">
              <p className="app-subtitle">
                Discover and explore the rich diversity of musical genres
              </p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};




