const API_BASE_URL = 'http://localhost:5000/api/todos';

export const fetchTodosApi = async () => {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const createTodoApi = async (title, description) => {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

export const updateTodoApi = async (id, title, description) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export const toggleDoneApi = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}/done`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to update task status');
  return res.json();
};

export const deleteTodoApi = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
};