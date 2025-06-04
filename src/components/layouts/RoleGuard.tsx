'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoleType } from '@/modules/auth/auth.interfaces'
import { useAuthRouting } from '@/hooks/useAuthRouting'

interface RoleGuardProps {
  allowedRoles: RoleType[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { userRole, isAuthenticated, hydrated } = useAuthRouting()
  const router = useRouter()

  useEffect(() => {
    // Wait until auth state is hydrated
    if (!hydrated) return

    console.log(userRole)
    const hasAllowedRole = allowedRoles.includes(userRole as RoleType)

    if (!isAuthenticated || !hasAllowedRole) {
      router.replace('/login')
    }
  }, [userRole, isAuthenticated, router, allowedRoles, hydrated])

  return <>{children}</>
}
