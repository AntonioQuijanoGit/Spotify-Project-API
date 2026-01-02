import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { Tutorial } from './Tutorial';
import './HelpButton.css';

const TUTORIAL_SEEN_KEY = 'music-explorer-tutorial-seen';

export const HelpButton = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  // Tutorial desactivado automáticamente ya que tenemos WelcomeScreen
  // El usuario puede abrirlo manualmente desde el botón de ayuda
  useEffect(() => {
    // const hasSeenTutorial = localStorage.getItem(TUTORIAL_SEEN_KEY);
    // if (!hasSeenTutorial) {
    //   // Show tutorial automatically on first visit
    //   setShowTutorial(true);
    // }
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
        <HelpCircle size={20} strokeWidth={2.5} />
      </button>

      {showTutorial && (
        <Tutorial onClose={handleCloseTutorial} />
      )}
    </>
  );
};

