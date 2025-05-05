'use client'

import { useSyncAuthState } from '../../lib/auth/syncAuthState'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use the syncAuthState hook to keep localStorage and cookies in sync
  useSyncAuthState()

  // No need to initialize from localStorage anymore as Zustand persist handles it
  // The store is hydrated automatically from localStorage

  return <>{children}</>
}
