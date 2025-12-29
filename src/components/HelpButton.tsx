import { useState, useEffect } from 'react';
import { Tutorial } from './Tutorial';
import './HelpButton.css';

const TUTORIAL_SEEN_KEY = 'music-explorer-tutorial-seen';

export const HelpButton = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if user has seen tutorial before on mount
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_SEEN_KEY);
    if (!hasSeenTutorial) {
      // Show tutorial automatically on first visit
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    // Mark tutorial as seen
    localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
  };

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <>
      <button
        onClick={handleOpenTutorial}
        className="help-button"
        aria-label="Open tutorial"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {showTutorial && (
        <Tutorial onClose={handleCloseTutorial} />
      )}
    </>
  );
};

