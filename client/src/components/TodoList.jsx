import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, searchQuery, filter, darkTheme, onToggle, onDelete, onUpdate }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">✓</span>
        <h2>{searchQuery || filter !== 'all' ? 'No matching tasks' : 'You’re all caught up'}</h2>
        <p>{searchQuery || filter !== 'all' ? 'Try another search or choose a different filter.' : 'Add a task above to start building your list.'}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          darkTheme={darkTheme}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}