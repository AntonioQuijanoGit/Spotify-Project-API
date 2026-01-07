import { useState, useEffect } from 'react';
import { Music, Search, Heart, ArrowRight } from 'lucide-react';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  // Prevenir scroll cuando el WelcomeScreen está visible
  useEffect(() => {
    if (showWelcome && !isHiding) {
      // Guardar la posición del scroll actual
      const scrollY = window.scrollY;
      
      // Bloquear scroll en body y html
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      // Agregar clase al body para ocultar contenido
      document.body.classList.add('welcome-screen-active');
    } else {
      // Restaurar scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('welcome-screen-active');
      
      // Restaurar posición del scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Limpiar al desmontar
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('welcome-screen-active');
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
    >
      <div className="welcome-hero-background">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-pattern"></div>
      </div>
      
      <div className="welcome-hero-content">
        <div className="hero-content">
          <div className="hero-icon-wrapper">
            <div className="hero-icon">
              <Music size={48} strokeWidth={2} />
            </div>
          </div>

          <h1 className="hero-title">Discover What Moves You</h1>
          
          <p className="hero-description">
            Explore genres, discover artists, and create playlists. 
            Everything you need to navigate the world of sound.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <Search size={20} strokeWidth={2.5} />
              </div>
              <span>Search & Discover</span>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <Music size={20} strokeWidth={2.5} />
              </div>
              <span>Genre Exploration</span>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <Heart size={20} strokeWidth={2.5} />
              </div>
              <span>Curated Playlists</span>
            </div>
          </div>
        </div>
      </div>
      
      <button className="hero-button" onClick={getStarted}>
        <span>Get Started</span>
        <ArrowRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}



