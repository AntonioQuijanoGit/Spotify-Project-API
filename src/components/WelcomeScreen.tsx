import { useState, useEffect } from 'react';
import { Music, Search, Heart, ArrowRight } from 'lucide-react';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  // Prevenir scroll cuando el WelcomeScreen está visible
  useEffect(() => {
    if (showWelcome && !isHiding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showWelcome, isHiding]);

  const getStarted = () => {
    if (import.meta.env.DEV) {
      console.log('Get Started clicked');
    }
    
    // Iniciar animación de ocultar
    setIsHiding(true);
    
    // Restaurar scroll y ocultar después de la animación
    setTimeout(() => {
      document.body.style.overflow = '';
      setShowWelcome(false);
      if (import.meta.env.DEV) {
        console.log('WelcomeScreen hidden, showWelcome:', false);
      }
    }, 500);
  };

  if (!showWelcome) {
    if (import.meta.env.DEV) {
      console.log('WelcomeScreen: not showing because showWelcome is false');
    }
    return null;
  }

  if (import.meta.env.DEV) {
    console.log('WelcomeScreen: rendering with showWelcome:', showWelcome, 'isHiding:', isHiding);
  }

  return (
    <div 
      className={`welcome-hero ${isHiding ? 'hiding' : ''}`} 
      style={{ 
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10001,
        backgroundColor: '#ffffff'
      }}
    >
      <div className="welcome-hero-content">
        {/* Background gradient */}
        <div className="hero-bg-gradient"></div>
        
        {/* Content */}
        <div className="hero-content">
          <div className="hero-icon">
            <Music size={64} strokeWidth={1.5} />
          </div>

          <h1 className="hero-title">Discover What Moves You</h1>
          
          <p className="hero-description">
            Explore genres, discover artists, and create playlists. 
            Everything you need to navigate the world of sound.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <Search size={24} strokeWidth={2} />
              <span>Search & Discover</span>
            </div>
            <div className="hero-feature">
              <Music size={24} strokeWidth={2} />
              <span>Genre Exploration</span>
            </div>
            <div className="hero-feature">
              <Heart size={24} strokeWidth={2} />
              <span>Curated Playlists</span>
            </div>
          </div>

          <button className="hero-button" onClick={getStarted}>
            Get Started
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

