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
    // Log for debugging purposes
    if (userRole) {
      console.log(`User authenticated with role: ${userRole}`)
    }
  }, [userRole])

  // Wrap all children with the RouteGuard to handle all authorization logic
  return <RouteGuard>{children}</RouteGuard>
}
