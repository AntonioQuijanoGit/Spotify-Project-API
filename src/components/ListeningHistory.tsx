import { useListeningHistory } from '../hooks/useListeningHistory';
import { getGenreById } from '../data/genres';
import { useToast } from '../hooks/useToast';
import './ListeningHistory.css';

export const ListeningHistory = () => {
  const { history, clearHistory, removeFromHistory, getTotalListeningTime, getMostListenedGenres } = useListeningHistory();
  const { success } = useToast();

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all listening history?')) {
      clearHistory();
      success('Listening history cleared');
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const totalTime = getTotalListeningTime();
  const topGenres = getMostListenedGenres(5);
  const recentHistory = history.slice(0, 50);

  return (
    <div className="listening-history">
      <div className="listening-history-header">
        <div>
          <h2>Listening History</h2>
          <p className="listening-stats">
            {history.length} tracks • {formatTime(totalTime)} listened
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={handleClear} className="clear-history-btn" type="button">
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="listening-history-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <p>No listening history yet</p>
          <p className="empty-subtitle">Start playing tracks to build your history</p>
        </div>
      ) : (
        <>
          {topGenres.length > 0 && (
            <div className="top-genres-section">
              <h3>Most Listened Genres</h3>
              <div className="top-genres-list">
                {topGenres.map(({ genreId, genreName, count }) => {
                  const genre = getGenreById(genreId);
                  return (
                    <div key={genreId} className="top-genre-item">
                      <div
                        className="top-genre-color"
                        style={{ backgroundColor: genre?.color || '#666' }}
                      />
                      <span className="top-genre-name">{genreName}</span>
                      <span className="top-genre-count">{count} tracks</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="history-list">
            <h3>Recent Tracks</h3>
            <div className="history-items">
              {recentHistory.map((item, index) => (
                <div key={`${item.trackId}-${item.timestamp}`} className="history-item">
                  <div className="history-item-number">{index + 1}</div>
                  <div className="history-item-content">
                    <div className="history-item-main">
                      <span className="history-track-name">{item.trackName}</span>
                      <span className="history-artists">{item.artists.join(', ')}</span>
                    </div>
                    {item.genreName && (
                      <span className="history-genre">{item.genreName}</span>
                    )}
                  </div>
                  <div className="history-item-meta">
                    <span className="history-time">{formatDate(item.timestamp)}</span>
                    <button
                      onClick={() => removeFromHistory(item.trackId, item.timestamp)}
                      className="history-remove-btn"
                      type="button"
                      aria-label="Remove from history"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

