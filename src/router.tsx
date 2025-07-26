import React, { useEffect, useState } from 'react';
import App from './App';
import GitHubPage from './pages/github';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Get the base path from import.meta.env or use default
  const basePath = import.meta.env.BASE_URL || '/linktree/';

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Helper function to check if current path matches a route
  const matchPath = (path: string) => {
    // Check if the current path matches the base path + given route
    return currentPath === `${basePath}${path}`.replace(/\/+$/, '');
  };

  // Simple client-side routing with base path awareness
  if (matchPath('github')) {
    return <GitHubPage />;
  }
  
  // Default route (home)
  return <App />;
}