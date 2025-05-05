/**
 * Route configuration for the application
 * Provides a central place to define which routes are public or private
 */

export interface RouteConfig {
  path: string
  public: boolean
  exact?: boolean // If true, only exact path matches; if false, also matches subpaths
}

// Define explicitly public routes
export const publicRoutes: string[] = ['/', '/login', '/register', '/about']

// Route definitions - keeping this for backwards compatibility
export const routes: RouteConfig[] = [
  { path: '/', public: true, exact: true },
  { path: '/login', public: true },
  { path: '/register', public: true },
  { path: '/about', public: true },
  { path: '/dashboard', public: false },
  { path: '/profile', public: false },
  // Add more routes as needed
]

/**
 * Checks if a given path is a public route
 * By default, all routes are private unless explicitly defined as public
 */
export function isPublicRoute(path: string): boolean {
  // First check in the explicit route configs
  const explicitConfig = routes.find((route) =>
    route.exact ? route.path === path : path === route.path || path.startsWith(`${route.path}/`),
  )

  if (explicitConfig) {
    return explicitConfig.public
  }

  // If no explicit config, check in the publicRoutes array
  return publicRoutes.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))
}

/**
 * Checks if a given path is a private route
 * By default, all routes are private unless explicitly defined as public
 */
export function isPrivateRoute(path: string): boolean {
  return !isPublicRoute(path)
}

/**
 * Adds a new route configuration dynamically
 */
export function addRoute(routeConfig: RouteConfig): void {
  // Check if route already exists
  const existingIndex = routes.findIndex((r) => r.path === routeConfig.path)

  if (existingIndex >= 0) {
    // Update existing route
    routes[existingIndex] = routeConfig
  } else {
    // Add new route
    routes.push(routeConfig)
  }

  // Also update the publicRoutes array if needed
  const publicIndex = publicRoutes.indexOf(routeConfig.path)
  if (routeConfig.public && publicIndex === -1) {
    publicRoutes.push(routeConfig.path)
  } else if (!routeConfig.public && publicIndex !== -1) {
    publicRoutes.splice(publicIndex, 1)
  }
}
