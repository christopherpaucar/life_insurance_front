import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Permission, RoleType, IUser, LoginDto, RegisterDto } from '@/modules/auth/auth.interfaces'

// Mock del store antes de importar useAuthService
const mockStore: {
  login: (credentials: LoginDto) => Promise<void>
  register: (userData: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  user: IUser | null
} = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
  user: null
}

vi.mock('@/modules/auth/auth.store', () => ({
  useAuthStore: () => mockStore
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

// Importar useAuthService después de configurar los mocks
import { useAuthService } from '@/modules/auth/useAuth'

function renderUseAuthService() {
  const queryClient = new QueryClient()
  return renderHook(() => useAuthService(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })
}

describe('useAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.login = vi.fn(async () => {})
    mockStore.register = vi.fn(async () => {})
    mockStore.logout = vi.fn(async () => {})
    mockStore.clearError = vi.fn(() => {})
    mockStore.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roles: [
        {
          id: 'role1',
          name: 'Admin',
          permissions: [Permission.MANAGE_ROLES, Permission.MANAGE_INSURANCE]
        }
      ]
    }
  })

  it('debe exponer login y llamar al método del store', async () => {
    const { result } = renderUseAuthService()
    await act(() => {
      result.current.login({ email: 'a@a.com', password: '1234' })
    })
    expect(mockStore.login).toHaveBeenCalledWith({ email: 'a@a.com', password: '1234' })
  })

  it('debe exponer register y llamar al método del store', async () => {
    const { result } = renderUseAuthService()
    await act(() => {
      result.current.register({ name: 'Test', email: 'a@a.com', password: '1234', role: RoleType.CLIENT })
    })
    expect(mockStore.register).toHaveBeenCalled()
  })

  it('debe exponer logout y llamar al método del store', async () => {
    const { result } = renderUseAuthService()
    await act(() => {
      result.current.logout()
    })
    expect(mockStore.logout).toHaveBeenCalled()
  })

  it('debe exponer clearError y llamar al método del store', () => {
    const { result } = renderUseAuthService()
    result.current.clearError()
    expect(mockStore.clearError).toHaveBeenCalled()
  })

  it('debe exponer user', () => {
    const { result } = renderUseAuthService()
    expect(result.current.user).toEqual(mockStore.user)
  })

  it('hasPermission debe funcionar para un permiso', () => {
    const { result } = renderUseAuthService()
    expect(result.current.hasPermission(Permission.MANAGE_ROLES)).toBe(true)
    expect(result.current.hasPermission(Permission.REVIEW_REIMBURSEMENTS)).toBe(false)
  })

  it('hasPermission debe funcionar para varios permisos', () => {
    const { result } = renderUseAuthService()
    expect(result.current.hasPermission([Permission.MANAGE_ROLES, Permission.REVIEW_REIMBURSEMENTS])).toBe(true)
    expect(result.current.hasPermission([Permission.REVIEW_REIMBURSEMENTS, Permission.VIEW_REPORTS])).toBe(false)
  })

  it('hasPermission debe devolver false si no hay usuario', () => {
    mockStore.user = null
    const { result } = renderUseAuthService()
    expect(result.current.hasPermission(Permission.MANAGE_ROLES)).toBe(false)
  })
}) 