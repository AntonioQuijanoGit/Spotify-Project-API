import { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

interface AudioPlayerProps {
  previewUrl: string | null;
  trackName: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export const AudioPlayer = ({ previewUrl, trackName, autoPlay = false, onEnded }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Previews are ~30s
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 30);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  // Stop playing when preview URL changes and handle autoPlay
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && previewUrl) {
      // Reset audio
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      // Load new source
      audio.load();
      
      // Auto-play if requested - wait for audio to be ready
      // Only auto-play if user has already interacted (clicked play/start radio)
      if (autoPlay && hasInteractedRef.current) {
        const attemptPlay = () => {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                // Auto-play was prevented by browser
                // This can happen if too much time passed since user interaction
                if (import.meta.env.DEV) {
                  console.log('Auto-play prevented:', error);
                }
                setIsPlaying(false);
              });
          }
        };
        
        const handleCanPlay = () => {
          attemptPlay();
          audio.removeEventListener('canplay', handleCanPlay);
        };
        
        // If already loaded enough, try immediately
        if (audio.readyState >= 2) {
          attemptPlay();
        } else {
          audio.addEventListener('canplay', handleCanPlay);
        }
        
        return () => {
          audio.removeEventListener('canplay', handleCanPlay);
        };
      }
    }
  }, [previewUrl, autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    hasInteractedRef.current = true; // Mark that user has interacted
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Play failed:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!previewUrl) {
    return (
      <div className="audio-player audio-player-disabled" aria-label="Audio preview not available for this track">
        <button className="play-button" disabled aria-label="Preview not available">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="no-preview-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>No preview</span>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={previewUrl} preload="metadata" />
      
      <button
        className="play-button"
        onClick={togglePlay}
        aria-label={isPlaying ? `Pause ${trackName}` : `Play ${trackName}`}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="player-controls">
        <input
          type="range"
          className="seek-bar"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
        />
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="duration">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
