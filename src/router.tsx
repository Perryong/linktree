import React, { useEffect, useState } from 'react';
import App from './App';
import GitHubPage from './pages/github';

export default function Router() {
  // Use hash-based routing instead of path-based routing for GitHub Pages compatibility
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Get the current route from the hash or default to root
    return window.location.hash.slice(1) || '/';
  });

  useEffect(() => {
    // Handle hash changes (user navigation)
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Simple client-side routing with hash-based navigation
  switch (currentRoute) {
    case '/github':
      return <GitHubPage />;
    default:
      return <App />;
  }
}