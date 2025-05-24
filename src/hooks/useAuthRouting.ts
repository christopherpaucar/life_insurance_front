'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/modules/auth/auth.store'
import { RoleType } from '@/modules/auth/auth.interfaces'
import { RoutingService } from '@/lib/routing/routingService'
import { useCallback, useMemo } from 'react'

export function useAuthRouting() {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const { user, isAuthenticated, hydrated } = useAuthStore()
  const routingService = useMemo(() => new RoutingService(), [])

  // Get user's primary role (first role in array)
  const userRole = useMemo(() => {
    return user?.role?.name as RoleType | undefined
  }, [user?.role])

  // Check if user has access to current route
  const canAccessCurrentRoute = useMemo(() => {
    if (!hydrated || !isAuthenticated) return false

    return routingService.canUserAccessRoute(pathname, userRole as RoleType)
  }, [hydrated, isAuthenticated, pathname, userRole, routingService])

  // Get redirect path for current route and user
  const getRedirectPath = useCallback(() => {
    // For unauthenticated users trying to access private routes
    if (!isAuthenticated && routingService.isPrivateRoute(pathname)) {
      return `${routingService.getUnauthenticatedRedirect(pathname)}?callbackUrl=${encodeURIComponent(pathname)}`
    }

    // For authenticated users trying to access login/register
    if (isAuthenticated && routingService.isAuthRoute(pathname) && userRole) {
      return routingService.getRoleBasedRedirect(userRole)
    }

    // For special redirection routes like dashboard or root
    if (isAuthenticated && routingService.needsRoleBasedRedirect(pathname) && userRole) {
      return routingService.getRoleBasedRedirect(userRole)
    }

    // If user doesn't have access to this route, redirect to role's default route
    if (isAuthenticated && !canAccessCurrentRoute && userRole) {
      return routingService.getRoleBasedRedirect(userRole)
    }

    return null
  }, [isAuthenticated, pathname, userRole, canAccessCurrentRoute, routingService])

  // Handle redirection based on current route and auth state
  const handleRouteAccess = useCallback(() => {
    if (!hydrated) return false

    const redirectPath = getRedirectPath()
    if (redirectPath) {
      router.replace(redirectPath)
      return true
    }

    return false
  }, [hydrated, getRedirectPath, router])

  return {
    userRole,
    isAuthenticated,
    hydrated,
    canAccessCurrentRoute,
    handleRouteAccess,
    routingService,
    pathname,
  }
}
