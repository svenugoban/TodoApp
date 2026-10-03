import React, { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Add a task title to continue.');
      return;
    }

    setIsSubmitting(true);
    const created = await onAdd(title.trim(), description.trim());
    setIsSubmitting(false);
    if (created) clearForm();
  };

  return (
    <form className="add-panel" onSubmit={handleSubmit} noValidate>
      <div className="panel-title">
        <span className="panel-plus" aria-hidden="true">+</span>
        <h2>Add New Task</h2>
      </div>
      <label className="visually-hidden" htmlFor="new-todo-title">Task title</label>
      <input
        id="new-todo-title"
        type="text"
        className={`form-input ${validationError ? 'input-invalid' : ''}`}
        placeholder="Task title *"
        value={title}
        maxLength={255}
        aria-invalid={Boolean(validationError)}
        aria-describedby={validationError ? 'todo-title-error' : undefined}
        onChange={(event) => { setTitle(event.target.value); setValidationError(''); }}
      />
      <label className="visually-hidden" htmlFor="new-todo-description">Description (optional)</label>
      <textarea
        id="new-todo-description"
        className="form-input form-description"
        placeholder="Description (optional)"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      {validationError && <p className="field-error" id="todo-title-error">{validationError}</p>}
      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={clearForm} disabled={isSubmitting}>Clear</button>
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          <span aria-hidden="true">+</span> {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}