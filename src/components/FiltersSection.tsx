import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { FavoritesFilterButton } from './FavoritesFilterButton';
interface Category {
  id: string;
  name: string;
}
import './FiltersSection.css';

interface FiltersSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onSearch?: (query: string) => void;
}

export const FiltersSection = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  showFavoritesOnly,
  onToggleFavorites,
  onSearch,
}: FiltersSectionProps) => {
  return (
    <section className="controls-section slide-up" aria-label="Search and filter controls">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onSearch={onSearch}
        placeholder="Search genres, characteristics, artists..."
      />
      
      <div className="filters-row">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        
        <FavoritesFilterButton
          isActive={showFavoritesOnly}
          onClick={onToggleFavorites}
        />
      </div>
    </section>
  );
};

