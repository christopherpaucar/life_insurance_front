'use client'

import { PropsWithChildren, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '../../modules/auth/auth.store'
import { isPrivateRoute, getRedirectPath, canAccessRoute, findRouteConfig } from '../../config/routes.config'
import { RoleType } from '../../modules/auth/auth.interfaces'

export function RouteGuard({ children }: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const { user, isAuthenticated, hydrated } = useAuthStore()

  useEffect(() => {
    // Wait until auth state is hydrated to prevent unnecessary redirects
    if (!hydrated) return

    // Immediate redirection for dashboard route
    if (pathname === '/dashboard') {
      if (user?.roles?.[0]?.name) {
        const userRole = user.roles[0].name as RoleType

        // Use direct role-based routing
        let redirectPath = '/login'
        switch (userRole) {
          case RoleType.SUPER_ADMIN:
          case RoleType.ADMIN:
            redirectPath = '/admin/dashboard'
            break
          case RoleType.AGENT:
            redirectPath = '/agent/dashboard'
            break
          case RoleType.CLIENT:
            redirectPath = '/client/dashboard'
            break
          case RoleType.REVIEWER:
            redirectPath = '/reviewer/dashboard'
            break
        }

        router.replace(redirectPath)
      } else {
        router.replace('/login')
      }
      return
    }

    const checkRouteAccess = () => {
      // If route is public, allow access
      if (!isPrivateRoute(pathname)) {
        // If user is authenticated and trying to access login/register, redirect to appropriate dashboard
        if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
          handleRoleBasedRedirect()
        }
        return
      }

      // If route is private and user is not authenticated, redirect to login
      if (!isAuthenticated) {
        const redirectPath = getRedirectPath(pathname) || '/login'
        router.replace(`${redirectPath}?callbackUrl=${encodeURIComponent(pathname)}`)
        return
      }

      // If user doesn't have the required role for this route, redirect based on role
      if (user?.roles[0]?.name) {
        const userRoles = user.roles.map((r) => r.name as RoleType)
        const routeConfig = findRouteConfig(pathname)

        // Check if this route has empty allowedRoles - means it's a redirection route
        if (routeConfig?.allowedRoles?.length === 0) {
          handleRoleBasedRedirect()
          return
        }

        // Check if user can access this route with their roles
        if (!canAccessRoute(pathname, userRoles)) {
          handleRoleBasedRedirect()
          return
        }

        // For root path, redirect to appropriate dashboard by role
        if (pathname === '/') {
          handleRoleBasedRedirect()
        }
      }
    }

    const handleRoleBasedRedirect = () => {
      if (!user?.roles[0]?.name) return

      const userRole = user.roles[0].name as RoleType

      // Use direct role mapping instead of config
      let redirectPath = '/login'
      switch (userRole) {
        case RoleType.SUPER_ADMIN:
          redirectPath = '/admin/dashboard'
          break
        case RoleType.ADMIN:
          redirectPath = '/admin/dashboard'
          break
        case RoleType.AGENT:
          redirectPath = '/agent/dashboard'
          break
        case RoleType.CLIENT:
          redirectPath = '/client/dashboard'
          break
        case RoleType.REVIEWER:
          redirectPath = '/reviewer/dashboard'
          break
      }

      router.replace(redirectPath)
    }

    checkRouteAccess()
  }, [pathname, router, user, isAuthenticated, hydrated])

  // Force redirect for dashboard with client-side rendering
  if (pathname === '/dashboard') {
    return null
  }

  return <>{children}</>
}
