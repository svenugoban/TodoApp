const Todo = require('../models/todoModel');

// GET /api/todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.getAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TODOs' });
  }
};

// POST /api/todos
exports.createTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newTodo = await Todo.create(title, description);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create TODO' });
  }
};

// PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const hasTitle = Object.prototype.hasOwnProperty.call(req.body, 'title');
  const hasDescription = Object.prototype.hasOwnProperty.call(req.body, 'description');

  if (!hasTitle && !hasDescription) {
    return res.status(400).json({ error: 'At least one field must be provided' });
  }
  if (hasTitle && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }
  if (hasDescription && description !== null && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string or null' });
  }

  try {
    const currentTodo = await Todo.getById(id);
    if (!currentTodo) {
      return res.status(404).json({ error: 'TODO not found' });
    }

    const updatedTodo = await Todo.update(
      id,
      hasTitle ? title : currentTodo.title,
      hasDescription ? description : currentTodo.description
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update TODO' });
  }
};

// PATCH /api/todos/:id/done
exports.toggleDone = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTodo = await Todo.toggleDone(id);
    if (!updatedTodo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle done status' });
  }
};

// DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await Todo.delete(id);
    if (!success) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.status(200).json({ message: 'TODO deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete TODO' });
  }
};