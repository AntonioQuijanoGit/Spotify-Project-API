import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, categoryId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="category-filter" role="tablist" aria-label="Genre categories">
      {categories.map((category) => (
        <button
          key={category.id}
          role="tab"
          aria-selected={selectedCategory === category.id}
          aria-label={`Filter by ${category.name}`}
          className={`category-button ${selectedCategory === category.id ? 'category-active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
          onKeyDown={(e) => handleKeyDown(e, category.id)}
          tabIndex={selectedCategory === category.id ? 0 : -1}
        >
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};
