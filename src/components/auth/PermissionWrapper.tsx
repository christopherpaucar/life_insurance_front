'use client'

import { useAuthService } from '@/modules/auth/useAuth'
import { Permission, RoleType } from '@/modules/auth/auth.interfaces'

interface PermissionWrapperProps {
  children: React.ReactNode
  requiredPermissions?: Permission | Permission[]
  requiredRoles?: RoleType | RoleType[]
  fallback?: React.ReactNode
}

export function PermissionWrapper({
  children,
  requiredPermissions,
  requiredRoles,
  fallback = null,
}: PermissionWrapperProps) {
  const { user, hasPermission } = useAuthService()

  if (!user) return fallback

  // Check permissions if required
  if (requiredPermissions) {
    const hasRequiredPermission = hasPermission(requiredPermissions)
    if (!hasRequiredPermission) return fallback
  }

  // Check roles if required
  if (requiredRoles) {
    const userRole = user.roles[0].name?.toUpperCase()

    if (!userRole) return fallback

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    const hasRequiredRole = roles.some((role) => userRole.includes(role))

    if (!hasRequiredRole) return fallback
  }

  return <>{children}</>
}
