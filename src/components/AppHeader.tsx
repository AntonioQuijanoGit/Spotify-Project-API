import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
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
            <h1 className="app-title">Music Genre Explorer</h1>
            <p className="app-subtitle">
              Discover and explore the rich diversity of musical genres
            </p>
          </div>
          <div className="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};




