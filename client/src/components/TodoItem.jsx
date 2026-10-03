import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function TodoItem({ todo, darkTheme, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [validationError, setValidationError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editTitle.trim()) {
      setValidationError('A task title is required.');
      return;
    }
    setIsSaving(true);
    const saved = await onUpdate(todo.id, editTitle.trim(), editDesc.trim());
    setIsSaving(false);
    if (saved) setIsEditing(false);
  };

  const createdDate = todo.createdAt ? new Date(todo.createdAt) : null;
  const dateLabel = createdDate && !Number.isNaN(createdDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(createdDate)
    : null;
  const timeLabel = createdDate && !Number.isNaN(createdDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(createdDate)
    : null;

  return (
    <li className={`todo-item ${todo.done ? 'is-completed' : ''}`}>
      {isEditing ? (
        <form className="edit-mode" onSubmit={handleSave}>
          <input
            type="text"
            className="form-input"
            aria-label="Task title"
            maxLength={255}
            value={editTitle}
            onChange={(event) => { setEditTitle(event.target.value); setValidationError(''); }}
          />
          <textarea
            className="form-input form-description"
            aria-label="Task description"
            placeholder="Description"
            value={editDesc}
            onChange={(event) => setEditDesc(event.target.value)}
          />
          {validationError && <p className="field-error">{validationError}</p>}
          <div className="action-buttons">
            <button type="submit" className="button button-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save changes'}</button>
            <button type="button" className="button button-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="todo-row">
          <button
            className={`completion-button ${todo.done ? 'is-done' : ''}`}
            type="button"
            aria-label={`${todo.done ? 'Mark as active' : 'Mark as completed'}: ${todo.title}`}
            onClick={() => onToggle(todo.id)}
          >
            <span aria-hidden="true">{todo.done ? '✓' : '○'}</span>
            {todo.done ? 'Undo' : 'Complete'}
          </button>

          <div className="todo-details">
            <h2 className="todo-title">{todo.title}</h2>
            {todo.description && <p className="todo-desc">{todo.description}</p>}
            {dateLabel && <div className="todo-meta"><span aria-hidden="true">▦</span><time dateTime={createdDate.toISOString()}>{dateLabel} · {timeLabel}</time></div>}
          </div>

          <span className={`status-badge ${todo.done ? 'status-completed' : 'status-active'}`}>
            {todo.done ? 'Completed' : 'Active'}
          </span>

          <div className="action-buttons">
            <button className="icon-button row-action edit-action" type="button" onClick={() => { setEditTitle(todo.title); setEditDesc(todo.description || ''); setIsEditing(true); }} aria-label={`Edit ${todo.title}`} title="Edit task">
              ✎
            </button>
            <button className="icon-button row-action delete-action" type="button" onClick={() => setShowDeleteConfirmation(true)} aria-label={`Delete ${todo.title}`} title="Delete task">
              ×
            </button>
          </div>
        </div>
      )}
      {showDeleteConfirmation && createPortal((
        <div className={`dialog-backdrop ${darkTheme ? 'theme-dark' : ''}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowDeleteConfirmation(false); }}>
          <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={`delete-title-${todo.id}`}>
            <div className="confirm-heading">
              <span className="confirm-icon" aria-hidden="true">!</span>
              <h2 id={`delete-title-${todo.id}`}>Delete this task?</h2>
            </div>
            <p>“{todo.title}” will be removed from your list.</p>
            <div className="dialog-actions">
              <button type="button" className="button button-secondary" onClick={() => setShowDeleteConfirmation(false)}>Keep task</button>
              <button type="button" className="button button-danger" onClick={() => { setShowDeleteConfirmation(false); onDelete(todo.id); }}>Delete task</button>
            </div>
          </section>
        </div>
      ), document.body)}
    </li>
  );
}