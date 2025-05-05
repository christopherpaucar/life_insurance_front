'use client'

import { useState, useCallback } from 'react'
import { routes, RouteConfig, addRoute } from '../config/routes.config'

/**
 * Hook to manage route configurations at runtime
 */
export function useRouteConfig() {
  const [routeConfigs, setRouteConfigs] = useState<RouteConfig[]>(routes)

  // Register a new route or update an existing one
  const registerRoute = useCallback((routeConfig: RouteConfig) => {
    addRoute(routeConfig)
    setRouteConfigs([...routes])
  }, [])

  // Set a route as public
  const setRouteAsPublic = useCallback(
    (path: string, isExact: boolean = false) => {
      registerRoute({ path, public: true, exact: isExact })
    },
    [registerRoute],
  )

  // Set a route as private
  const setRouteAsPrivate = useCallback(
    (path: string, isExact: boolean = false) => {
      registerRoute({ path, public: false, exact: isExact })
    },
    [registerRoute],
  )

  // Get all public routes
  const getPublicRoutes = useCallback(() => {
    return routeConfigs.filter((route) => route.public)
  }, [routeConfigs])

  // Get all private routes
  const getPrivateRoutes = useCallback(() => {
    return routeConfigs.filter((route) => !route.public)
  }, [routeConfigs])

  return {
    routes: routeConfigs,
    registerRoute,
    setRouteAsPublic,
    setRouteAsPrivate,
    getPublicRoutes,
    getPrivateRoutes,
  }
}
