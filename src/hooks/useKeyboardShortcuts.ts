import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSearch?: () => void;
  onEscape?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function useKeyboardShortcuts({
  onSearch,
  onEscape,
  onNext,
  onPrevious,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Search shortcut: /
      if (e.key === '/' && onSearch) {
        e.preventDefault();
        onSearch();
      }

      // Escape
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }

      // Arrow keys
      if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      }

      if (e.key === 'ArrowLeft' && onPrevious) {
        e.preventDefault();
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onEscape, onNext, onPrevious]);
}





