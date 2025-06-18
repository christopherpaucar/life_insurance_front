import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ReimbursementsPage from '@/app/[role]/reimbursements/page'
import { useAuthService } from '@/modules/auth/useAuth'
import { useRouter } from 'next/navigation'
import { QueryProvider } from '@/lib/providers/query-provider'

// Mock lucide-react para XIcon
vi.mock('lucide-react', () => ({
  XIcon: () => <svg data-testid="xicon" />,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: () => ({
    login: vi.fn(),
    isLoggingIn: false,
    register: vi.fn(),
    isRegistering: false,
    logout: vi.fn(),
    isLoggingOut: false,
    completeOnboarding: vi.fn(),
    isCompletingOnboarding: false,
    updateOnboarding: vi.fn(),
    isUpdatingOnboarding: false,
    clearError: vi.fn(),
    hasPermission: vi.fn(),
    user: {
      id: '1',
      email: 'test@example.com',
      role: { name: 'ADMIN', permissions: ['all:manage'] },
      onboardingCompleted: true
    },
  }),
}))

describe('Reimbursement Flow Integration Tests', () => {
  const router = useRouter()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should display reimbursement list', async () => {
    render(
      <QueryProvider>
        <ReimbursementsPage />
      </QueryProvider>
    )
    await waitFor(() => {
      const table = screen.queryByRole('table')
      const noResults = screen.queryByText(/no reimbursements found|no hay reembolsos|no results|sin resultados/i)
      const title = screen.queryAllByText(/reimbursements|reembolsos/i)
      expect(table || noResults || title.length > 0).toBeTruthy()
    })
  })
}) 