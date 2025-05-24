'use client'

import { useEffect } from 'react'
import { useAuthRouting } from '../../hooks/useAuthRouting'
import { RouteGuard } from './RouteGuard'

interface RouteManagerProps {
  children?: React.ReactNode
}

export function RouteManager({ children }: RouteManagerProps) {
  const { userRole } = useAuthRouting()

  useEffect(() => {
    if (userRole) {
      console.log(`User authenticated with role: ${userRole}`)
    }
  }, [userRole])

  return <RouteGuard>{children}</RouteGuard>
}
