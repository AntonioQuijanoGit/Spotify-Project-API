import { useState } from 'react';
import { useTags } from '../hooks/useTags';
import './GenreTags.css';

interface GenreTagsProps {
  genreId: string;
}

export const GenreTags = ({ genreId }: GenreTagsProps) => {
  const { getTags, addTag, removeTag } = useTags();
  const [newTag, setNewTag] = useState('');
  const tags = getTags(genreId);

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(genreId, newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="genre-tags">
      <div className="tags-input">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="tag-input-field"
        />
        <button onClick={handleAddTag} className="tag-add-btn" type="button">
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
              <button
                onClick={() => removeTag(genreId, tag)}
                className="tag-remove"
                aria-label={`Remove tag ${tag}`}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};




