import { ThemeToggle } from './ThemeToggle';
import './AppHeader.css';

export const AppHeader = () => {
  return (
    <header className="app-header" role="banner">
      <div className="container">
        <div className="header-content">
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




