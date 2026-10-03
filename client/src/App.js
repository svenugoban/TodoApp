import TodoPage from './pages/TodoPage';

const routes = {
  '/': TodoPage,
};

export default function App() {
  const Page = routes[window.location.pathname] || routes['/'];
  return <Page />;
}