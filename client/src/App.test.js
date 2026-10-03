import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./api/todoApi', () => ({
  fetchTodosApi: jest.fn().mockResolvedValue([]),
  createTodoApi: jest.fn(),
  toggleDoneApi: jest.fn(),
  deleteTodoApi: jest.fn(),
  updateTodoApi: jest.fn(),
}));

test('renders the routed TODO page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /my todos/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /add new task/i })).toBeInTheDocument();
});
