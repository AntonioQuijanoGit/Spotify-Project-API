import { useState, useEffect } from 'react';
import { Music, Search, Heart, Radio, X, ArrowRight } from 'lucide-react';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('spotify-welcome-seen');
    if (hasSeenWelcome === 'true') {
      setShowWelcome(false);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('spotify-welcome-seen', 'true');
  };

  const getStarted = () => {
    closeWelcome();
    setTimeout(() => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  if (!showWelcome) return null;

  return (
    <div className="welcome-overlay" onClick={closeWelcome}>
      <div className="welcome-container spotify-welcome" onClick={(e) => e.stopPropagation()}>
        {/* Background decorative elements */}
        <div className="welcome-bg spotify-bg">
          <div className="sound-wave wave-1"></div>
          <div className="sound-wave wave-2"></div>
          <div className="sound-wave wave-3"></div>
        </div>

        {/* Close button */}
        <button className="welcome-close" onClick={closeWelcome} aria-label="Close welcome screen">
          <X size={20} strokeWidth={2} />
        </button>

        {/* Content */}
        <div className="welcome-content">
          <div className="welcome-icon-wrapper spotify-icon-wrapper">
            <div className="spotify-logo-large">♪</div>
            <div className="spotify-glow"></div>
          </div>

          <h1 className="welcome-title">Spotify Music Explorer</h1>
          
          <p className="welcome-description">
            Discover music with Spotify API integration. Explore genres, browse playlists, 
            and find new artists with secure OAuth authentication and real-time search capabilities.
          </p>

          <div className="welcome-features">
            <div className="welcome-feature spotify-feature">
              <div className="feature-icon-wrapper spotify-icon">
                <Search size={20} strokeWidth={2} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Real-time Search</h3>
                <p className="feature-desc">Instant search results with debouncing for optimal performance</p>
              </div>
            </div>

            <div className="welcome-feature spotify-feature">
              <div className="feature-icon-wrapper spotify-icon">
                <Music size={20} strokeWidth={2} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Genre Exploration</h3>
                <p className="feature-desc">Browse and discover music genres with detailed information</p>
              </div>
            </div>

            <div className="welcome-feature spotify-feature">
              <div className="feature-icon-wrapper spotify-icon">
                <Heart size={20} strokeWidth={2} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">OAuth Authentication</h3>
                <p className="feature-desc">Secure OAuth 2.0 login with automatic token refresh</p>
              </div>
            </div>
          </div>

          <button className="welcome-button spotify-button" onClick={getStarted}>
            Start Exploring
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

