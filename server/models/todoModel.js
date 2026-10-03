const db = require('../config/db');

const Todo = {
  // Get all TODOs ordered by newest first
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM todos ORDER BY createdAt DESC');
    return rows.map(item => ({
      ...item,
      done: Boolean(item.done)
    }));
  },

  // Get a single TODO by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      done: Boolean(rows[0].done)
    };
  },

  // Create a new TODO
  create: async (title, description) => {
    const [result] = await db.query(
      'INSERT INTO todos (title, description, done) VALUES (?, ?, ?)',
      [title.trim(), description ? description.trim() : null, false]
    );
    return Todo.getById(result.insertId);
  },

  // Update title and description
  update: async (id, title, description) => {
    await db.query(
      'UPDATE todos SET title = ?, description = ? WHERE id = ?',
      [title.trim(), description ? description.trim() : null, id]
    );
    return Todo.getById(id);
  },

  // Toggle done status
  toggleDone: async (id) => {
    const currentTodo = await Todo.getById(id);
    if (!currentTodo) return null;

    const newDoneStatus = !currentTodo.done;
    await db.query('UPDATE todos SET done = ? WHERE id = ?', [newDoneStatus, id]);
    return Todo.getById(id);
  },

  // Delete a TODO
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM todos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Todo;