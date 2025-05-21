'use client';

import { useEffect } from 'react';
import { useRouteConfig } from '../hooks/useRouteConfig';

interface PublicRouteProviderProps {
  children: React.ReactNode;
}

/**
 * Component to define global public routes
 * This is useful to set up routes that should always be public
 * regardless of user authentication status
 */
export function PublicRouteProvider({ children }: PublicRouteProviderProps) {
  const { setRouteAsPublic } = useRouteConfig();

  useEffect(() => {
    // Define routes that should always be public here
    const globalPublicRoutes = [
      '/login',
      '/register',
      '/about',
      '/forgot-password',
      '/terms',
      '/privacy',
    ];

    // Register all global public routes
    globalPublicRoutes.forEach((route) => {
      setRouteAsPublic(route);
    });
  }, [setRouteAsPublic]);

  return <>{children}</>;
}
