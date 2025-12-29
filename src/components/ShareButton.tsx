import { useState } from 'react';
import { shareGenre, shareSearch } from '../utils/share';
import { useToast } from '../hooks/useToast';
import './ShareButton.css';

interface ShareButtonProps {
  type: 'genre' | 'search';
  value: string;
  label?: string;
  className?: string;
}

export const ShareButton = ({ type, value, label, className = '' }: ShareButtonProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const { success, error } = useToast();

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (type === 'genre') {
        await shareGenre(value, label || value);
      } else {
        await shareSearch(value);
      }
      success('Link copied to clipboard!');
    } catch (err) {
      error('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`share-button ${className}`}
      aria-label={`Share ${type}`}
      type="button"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {isSharing ? 'Sharing...' : 'Share'}
    </button>
  );
};

