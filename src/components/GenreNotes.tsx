import { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import './GenreNotes.css';

interface GenreNotesProps {
  genreId: string;
}

export const GenreNotes = ({ genreId }: GenreNotesProps) => {
  const { getNote, setNote, deleteNote, hasNote } = useNotes();
  const [note, setNoteValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNoteValue(getNote(genreId));
    setIsEditing(!hasNote(genreId));
  }, [genreId, getNote, hasNote]);

  const handleSave = () => {
    if (note.trim()) {
      setNote(genreId, note.trim());
    } else {
      deleteNote(genreId);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNoteValue(getNote(genreId));
    setIsEditing(false);
  };

  if (!isEditing && !hasNote(genreId)) {
    return (
      <div className="genre-notes">
        <button
          onClick={() => setIsEditing(true)}
          className="notes-add-btn"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Note
        </button>
      </div>
    );
  }

  return (
    <div className="genre-notes">
      <div className="notes-header">
        <h4>Personal Notes</h4>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="notes-edit-btn"
            type="button"
          >
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="notes-editor">
          <textarea
            value={note}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Write your notes about this genre..."
            className="notes-textarea"
            rows={4}
          />
          <div className="notes-actions">
            <button onClick={handleSave} className="notes-save-btn" type="button">
              Save
            </button>
            <button onClick={handleCancel} className="notes-cancel-btn" type="button">
              Cancel
            </button>
            {hasNote(genreId) && (
              <button
                onClick={() => {
                  deleteNote(genreId);
                  setNoteValue('');
                  setIsEditing(false);
                }}
                className="notes-delete-btn"
                type="button"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="notes-content">
          <p>{note}</p>
        </div>
      )}
    </div>
  );
};




