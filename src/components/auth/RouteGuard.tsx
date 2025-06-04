'use client'

import { PropsWithChildren, useEffect } from 'react'
import { useAuthRouting } from '../../hooks/useAuthRouting'

export function RouteGuard({ children }: PropsWithChildren) {
  const { handleRouteAccess, hydrated, pathname } = useAuthRouting()

  useEffect(() => {
    if (!hydrated) return

    handleRouteAccess()
  }, [pathname, hydrated, handleRouteAccess])

  if (pathname === '/dashboard') {
    return null
  }

  return <>{children}</>
}
