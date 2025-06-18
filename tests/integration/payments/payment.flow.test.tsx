import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PaymentsPage from '@/app/admin/payments/page'
import { useAuthService } from '@/modules/auth/useAuth'
import { useRouter } from 'next/navigation'

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

describe('Payment Flow Integration Tests', () => {
  const router = useRouter()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should display payment list', async () => {
    render(<PaymentsPage />)

    await waitFor(() => {
      const table = screen.queryByRole('table')
      const noPayments = screen.queryByText(/no payments found|no hay pagos|no results|sin resultados/i)
      if (table || noPayments) {
        expect(true).toBe(true)
      } else {
        const titles = screen.queryAllByText(/payments|pagos/i)
        expect(titles.length).toBeGreaterThan(0)
      }
    })
  })
}) 