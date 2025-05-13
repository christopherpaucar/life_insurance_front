/**
 * Route configuration for the application
 * Provides a central place to define which routes are public or private
 */
import { RoleType } from '../modules/auth/auth.interfaces'

export interface RouteConfig {
  path: string
  public: boolean
  exact?: boolean // If true, only exact path matches; if false, also matches subpaths
  allowedRoles?: RoleType[] // Roles that can access this route
  redirectByRole?: { [key in RoleType]?: string } // Redirect paths by role
  redirectTo?: string // Optional redirection path for non-public routes
}

// Define explicitly public routes
export const publicRoutes: string[] = ['/login', '/register', '/about']

// Define default role-based landing pages
export const roleDefaultPaths: Record<RoleType, string> = {
  [RoleType.SUPER_ADMIN]: '/admin/dashboard',
  [RoleType.ADMIN]: '/admin/dashboard',
  [RoleType.AGENT]: '/agent/dashboard',
  [RoleType.CLIENT]: '/client/dashboard',
  [RoleType.REVIEWER]: '/reviewer/dashboard',
}

// Route definitions
export const routes: RouteConfig[] = [
  {
    path: '/',
    public: false,
    exact: true,
    redirectTo: '/login',
    redirectByRole: {
      [RoleType.SUPER_ADMIN]: '/admin/dashboard',
      [RoleType.ADMIN]: '/admin/dashboard',
      [RoleType.AGENT]: '/agent/dashboard',
      [RoleType.CLIENT]: '/client/dashboard',
      [RoleType.REVIEWER]: '/reviewer/dashboard',
    },
  },
  { path: '/login', public: true },
  { path: '/register', public: true },
  { path: '/about', public: true },
  {
    path: '/dashboard',
    public: false,
    // No allowed roles - this forces redirection for everyone
    allowedRoles: [],
    // Add explicit redirect path to ensure immediate redirection
    redirectTo: '/login',
    // Define redirects by role to proper dashboard
    redirectByRole: {
      [RoleType.SUPER_ADMIN]: '/admin/dashboard',
      [RoleType.ADMIN]: '/admin/dashboard',
      [RoleType.AGENT]: '/agent/dashboard',
      [RoleType.CLIENT]: '/client/dashboard',
      [RoleType.REVIEWER]: '/reviewer/dashboard',
    },
  },
  { path: '/profile', public: false },

  // Admin routes
  { path: '/admin', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },
  { path: '/admin/dashboard', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },
  { path: '/admin/users', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },
  { path: '/admin/settings', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },

  // Client routes
  { path: '/client', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/dashboard', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/policies', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/claims', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/payments', public: false, allowedRoles: [RoleType.CLIENT] },

  // Agent routes
  { path: '/agent', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/dashboard', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/clients', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/policies', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/sales', public: false, allowedRoles: [RoleType.AGENT] },

  // Reviewer routes
  { path: '/reviewer', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/dashboard', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/claims', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/policies', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/reports', public: false, allowedRoles: [RoleType.REVIEWER] },

  // User common routes
  { path: '/user/profile', public: false },
  { path: '/user/settings', public: false },
]

// Private routes registry to be updated at runtime
const dynamicRouteRegistry: { [path: string]: RouteConfig } = {}

/**
 * Add a new route to the configuration or update an existing one
 */
export function addRoute(routeConfig: RouteConfig): void {
  dynamicRouteRegistry[routeConfig.path] = routeConfig
}

/**
 * Checks if a given path is a public route
 * By default, all routes are private unless explicitly defined as public
 */
export function isPublicRoute(path: string): boolean {
  // First check in the explicit route configs
  const explicitConfig = findRouteConfig(path)

  if (explicitConfig) {
    return explicitConfig.public
  }

  // If no explicit config, check in the publicRoutes array
  return publicRoutes.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))
}

/**
 * Checks if a given path is a private route
 */
export function isPrivateRoute(path: string): boolean {
  return !isPublicRoute(path)
}

/**
 * Get redirect path for a route if defined
 */
export function getRedirectPath(path: string): string | undefined {
  return findRouteConfig(path)?.redirectTo
}

/**
 * Get role-based redirect for a specific route and role
 */
export function getRoleBasedRedirect(path: string, role: RoleType): string | undefined {
  const config = findRouteConfig(path)
  const roleSpecificRedirect = config?.redirectByRole?.[role]

  // If route has specific redirect for this role, use it
  if (roleSpecificRedirect) {
    return roleSpecificRedirect
  }

  // Otherwise, return default landing page for this role
  return roleDefaultPaths[role]
}

/**
 * Check if a user with given roles can access a specific route
 */
export function canAccessRoute(path: string, userRoles: RoleType[]): boolean {
  const config = findRouteConfig(path)

  // If route config doesn't exist, default to deny access
  if (!config) {
    return false
  }

  // If no allowed roles specified, any authenticated user can access
  if (!config.allowedRoles || config.allowedRoles.length === 0) {
    return true
  }

  // Check if any of the user's roles match the allowed roles
  return userRoles.some((role) => config.allowedRoles?.includes(role))
}

/**
 * Find route configuration for a given path
 */
export function findRouteConfig(path: string): RouteConfig | undefined {
  // First check dynamic registry
  const dynamicConfig = Object.values(dynamicRouteRegistry).find((route) =>
    route.exact ? route.path === path : path === route.path || path.startsWith(`${route.path}/`),
  )

  if (dynamicConfig) {
    return dynamicConfig
  }

  // Then check static routes
  return routes.find((route) =>
    route.exact ? route.path === path : path === route.path || path.startsWith(`${route.path}/`),
  )
}
