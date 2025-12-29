import './FavoritesFilterButton.css';

interface FavoritesFilterButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export const FavoritesFilterButton = ({ isActive, onClick }: FavoritesFilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`favorites-filter-button ${isActive ? 'active' : ''}`}
      aria-label={isActive ? 'Show all genres' : 'Show favorites only'}
      type="button"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isActive ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>Favorites</span>
    </button>
  );
};





