'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../../modules/auth/auth.store'
import { RouteGuard } from './RouteGuard'

interface RouteManagerProps {
  children?: React.ReactNode
}

export function RouteManager({ children }: RouteManagerProps) {
  const { user } = useAuthStore()

  useEffect(() => {
    // Log for debugging purposes
    if (user?.roles[0]?.name) {
      console.log(`User authenticated with role: ${user.roles[0].name}`)
    }
  }, [user])

  // Wrap all children with the RouteGuard to handle all authorization logic
  return <RouteGuard>{children}</RouteGuard>
}
