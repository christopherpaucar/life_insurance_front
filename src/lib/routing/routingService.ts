import { RoleType } from '@/modules/auth/auth.interfaces'
import { allRoutes, roleDefaultRoutes, RouteConfig } from './routes.config'

export class RoutingService {
  /**
   * Checks if a route is public or private
   */
  public isPublicRoute(path: string): boolean {
    const route = this.findRouteConfig(path)
    if (route) return route.public
    return false // Default to private if not found
  }

  /**
   * Checks if a route is private
   */
  public isPrivateRoute(path: string): boolean {
    return !this.isPublicRoute(path)
  }

  /**
   * Find route configuration for a given path
   */
  public findRouteConfig(path: string): RouteConfig | undefined {
    return allRoutes.find((route) =>
      route.exact ? route.path === path : path === route.path || path.startsWith(`${route.path}/`)
    )
  }

  /**
   * Check if user has access to this route based on their roles
   */
  public canUserAccessRoute(path: string, userRoles: RoleType): boolean {
    const route = this.findRouteConfig(path)

    if (!route) return false
    if (route.public) return true

    // No role restrictions = any authenticated user can access
    if (!route.allowedRoles || route.allowedRoles.length === 0) {
      return true
    }

    return route.allowedRoles.some((role) => role === userRoles)
  }

  /**
   * Get the redirect path for unauthenticated users
   */
  public getUnauthenticatedRedirect(currentPath: string): string {
    const route = this.findRouteConfig(currentPath)
    return route?.defaultRedirect || '/login'
  }

  /**
   * Get the default route for a user's role
   */
  public getRoleDefaultRoute(role: RoleType): string {
    return roleDefaultRoutes[role] || '/login'
  }

  /**
   * Get appropriate redirect based on user role
   */
  public getRoleBasedRedirect(role: RoleType): string {
    return this.getRoleDefaultRoute(role)
  }

  /**
   * Check if route requires a role-based redirect
   */
  public needsRoleBasedRedirect(path: string): boolean {
    const specialPaths = ['/', '/dashboard']
    return specialPaths.includes(path)
  }

  /**
   * Determine if a login/register route should redirect for authenticated users
   */
  public isAuthRoute(path: string): boolean {
    return path === '/login' || path === '/register'
  }
}
