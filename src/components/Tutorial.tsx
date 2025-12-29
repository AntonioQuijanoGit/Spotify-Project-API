import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Tutorial.css';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome',
    description: 'Explore 30+ music genres, discover new artists, and listen to previews from Spotify.',
  },
  {
    title: 'Browse & Search',
    description: 'Use the search bar and category filters to find genres. Click any card to explore details.',
  },
  {
    title: 'Listen & Save',
    description: 'Play 30-second previews and save your favorite genres with the heart icon.',
  },
  {
    title: 'Spotify Integration',
    description: 'This app uses the Spotify Web API to fetch real-time music data. All tracks, artists, and album information comes directly from Spotify.',
  },
  {
    title: 'Discover More',
    description: 'Search for artists and albums in the "Search" tab. Explore radio mode, statistics, and genre comparisons.',
  },
];

interface TutorialProps {
  onClose: () => void;
}

export const Tutorial = ({ onClose }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // Focus the modal for accessibility
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight' && !isLastStep) {
      handleNext();
    } else if (e.key === 'ArrowLeft' && !isFirstStep) {
      handlePrevious();
    }
  };

  const modalContent = (
    <>
      <div 
        className="tutorial-backdrop" 
        onClick={handleSkip}
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        className="tutorial-modal" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="tutorial-title"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          className="tutorial-close"
          aria-label="Close tutorial"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="tutorial-content">
          <div className="tutorial-progress-indicator">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`tutorial-progress-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>
          
          <h2 id="tutorial-title" className="tutorial-title">{step.title}</h2>
          <p className="tutorial-description">{step.description}</p>
        </div>

        <div className="tutorial-footer">
          <button
            onClick={handleSkip}
            className="tutorial-skip"
            type="button"
          >
            Skip
          </button>
          
          <div className="tutorial-navigation">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="tutorial-nav-button tutorial-prev"
              aria-label="Previous step"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            
            <button
              onClick={handleNext}
              className="tutorial-nav-button tutorial-next"
              aria-label={isLastStep ? 'Finish tutorial' : 'Next step'}
              type="button"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

