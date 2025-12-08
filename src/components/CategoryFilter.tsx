import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
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
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
