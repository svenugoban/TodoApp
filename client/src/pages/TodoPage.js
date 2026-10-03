import React, { useEffect, useMemo, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import {
  createTodoApi,
  deleteTodoApi,
  fetchTodosApi,
  toggleDoneApi,
  updateTodoApi,
} from '../api/todoApi';
import '../App.css';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('todos');
  const [darkTheme, setDarkTheme] = useState(false);
  const [notice, setNotice] = useState(null);

  const showNotice = (message, type = 'success') => {
    setNotice({ message, type, id: Date.now() });
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodosApi();
        setTodos(Array.isArray(data) ? data : []);
      } catch (err) {
        setNotice({
          message: err.message || 'Could not load your tasks. Try again.',
          type: 'error',
          id: Date.now(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const handleAddTodo = async (title, description) => {
    try {
      const newTodo = await createTodoApi(title, description);
      setTodos((previousTodos) => [newTodo, ...previousTodos]);
      showNotice('Task added');
      return true;
    } catch (err) {
      showNotice(err.message || 'Could not add this task. Try again.', 'error');
      return false;
    }
  };

  const handleToggleDone = async (id) => {
    const previousTodo = todos.find((todo) => todo.id === id);
    if (!previousTodo) return;

    setTodos((previousTodos) =>
      previousTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );

    try {
      await toggleDoneApi(id);
      showNotice(previousTodo.done ? 'Task moved to active' : 'Task completed');
    } catch (err) {
      setTodos((previousTodos) =>
        previousTodos.map((todo) => todo.id === id ? previousTodo : todo)
      );
      showNotice('Could not update task status. Try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const previousTodo = todos.find((todo) => todo.id === id);
    if (!previousTodo) return;

    setTodos((previousTodos) =>
      previousTodos.filter((todo) => todo.id !== id)
    );

    try {
      await deleteTodoApi(id);
      showNotice('Task deleted');
    } catch (err) {
      setTodos((previousTodos) => [previousTodo, ...previousTodos]);
      showNotice('Could not delete task. Try again.', 'error');
    }
  };

  const handleUpdate = async (id, title, description) => {
    const previousTodo = todos.find((todo) => todo.id === id);
    if (!previousTodo) return false;

    const optimisticTodo = { ...previousTodo, title, description };
    setTodos((previousTodos) =>
      previousTodos.map((todo) => todo.id === id ? optimisticTodo : todo)
    );

    try {
      const updatedTodo = await updateTodoApi(id, title, description);
      setTodos((previousTodos) =>
        previousTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      showNotice('Task updated');
      return true;
    } catch (err) {
      setTodos((previousTodos) =>
        previousTodos.map((todo) => todo.id === id ? previousTodo : todo)
      );
      showNotice(err.message || 'Could not update this task. Try again.', 'error');
      return false;
    }
  };

  const visibleTodos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return todos.filter((todo) => {
      const matchesFilter = filter === 'all'
        || (filter === 'active' && !todo.done)
        || (filter === 'completed' && todo.done);
      const matchesQuery = !normalizedQuery
        || `${todo.title} ${todo.description || ''}`.toLowerCase().includes(normalizedQuery);
      const matchesView = view !== 'completed' || todo.done;
      return matchesFilter && matchesQuery && matchesView;
    });
  }, [todos, filter, query, view]);

  const setDashboardView = (nextView) => {
    setView(nextView);
    setFilter(nextView === 'completed' ? 'completed' : 'all');
  };

  return (
    <div className={`app-shell ${darkTheme ? 'theme-dark' : ''}`}>
      <aside className="sidebar">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); setDashboardView('todos'); }}>
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span>TodoApp</span>
        </a>

        <nav className="side-nav" aria-label="Main navigation">
          <button className={view === 'todos' ? 'nav-link is-selected' : 'nav-link'} onClick={() => setDashboardView('todos')}>
            <span aria-hidden="true">⌂</span> All Todos
          </button>
          <button className={view === 'settings' ? 'nav-link is-selected' : 'nav-link'} onClick={() => setView('settings')}>
            <span aria-hidden="true">⚙</span> Settings
          </button>
        </nav>

        <div className="sidebar-note">
          <span aria-hidden="true">✳</span>
          <p>Stay organized,<br />get things done.</p>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-spacer" />
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setDarkTheme((currentTheme) => !currentTheme)}
            aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} theme`}
            title={`Switch to ${darkTheme ? 'light' : 'dark'} theme`}
          >
            {darkTheme ? '☾' : '☼'}
          </button>
          <div className="profile-chip" aria-label="Signed in as Siva">
            <span className="avatar">S</span>
            <span>Siva</span>
            <span className="profile-chevron" aria-hidden="true">⌄</span>
          </div>
        </header>

        <main className="main-content">
          {view === 'settings' ? (
            <section className="settings-view">
              <div className="page-heading">
                <h1>Settings</h1>
                <p>Personalize your workspace.</p>
              </div>
              <div className="settings-panel">
                <div>
                  <h2>Appearance</h2>
                  <p>Choose how TodoApp looks on this device.</p>
                </div>
                <button className="button button-secondary" onClick={() => setDarkTheme((currentTheme) => !currentTheme)}>
                  {darkTheme ? 'Use light theme' : 'Use dark theme'}
                </button>
              </div>
            </section>
          ) : (
            <>
              <div className="page-heading">
                <h1>{view === 'completed' ? 'Completed TODOs' : 'My TODOs'}</h1>
                <p>Keep track of your tasks and get more done!</p>
              </div>

              {notice && (
                <div className={`toast toast-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'} key={notice.id}>
                  <span>{notice.message}</span>
                  <button type="button" className="toast-dismiss" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
                </div>
              )}

              <TodoForm onAdd={handleAddTodo} />

              <section className="tasks-panel" aria-label="Your tasks">
                <div className="task-toolbar">
                  <label className="search-box">
                    <span className="search-icon" aria-hidden="true">⌕</span>
                    <input
                      type="search"
                      placeholder="Search todos..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      aria-label="Search todos"
                    />
                  </label>

                  <div className="filter-tabs" role="group" aria-label="Filter tasks">
                    {['all', 'active', 'completed'].map((filterOption) => (
                      <button
                        key={filterOption}
                        type="button"
                        className={filter === filterOption ? 'filter-tab is-active' : 'filter-tab'}
                        aria-pressed={filter === filterOption}
                        onClick={() => { setView('todos'); setFilter(filterOption); }}
                      >
                        {filterOption[0].toUpperCase() + filterOption.slice(1)}
                      </button>
                    ))}
                  </div>

                  <span className="task-count">{todos.length} {todos.length === 1 ? 'task' : 'total'}</span>
                </div>

                {loading ? (
                  <div className="skeleton-list" aria-label="Loading tasks" aria-busy="true">
                    {[0, 1, 2].map((item) => <div className="skeleton-row" key={item}><span /><div><i /><i /></div></div>)}
                  </div>
                ) : (
                  <TodoList
                    todos={visibleTodos}
                    searchQuery={query}
                    filter={filter}
                    darkTheme={darkTheme}
                    onToggle={handleToggleDone}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}