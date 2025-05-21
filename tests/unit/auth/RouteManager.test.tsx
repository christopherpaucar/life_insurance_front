import { render, screen } from '@testing-library/react'
import { RouteManager } from '@/components/auth/RouteManager'
import { describe, it, expect, vi } from 'vitest'
import { useAuthService } from '@/modules/auth/useAuth'
import { mockAuthService } from '../../mocks/auth'
import * as useAuthRoutingModule from '../../../src/hooks/useAuthRouting'

// Mock del hook useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn()
}))

// Mock del hook useRouter y usePathname
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  }),
  usePathname: () => '/'
}))

// Mock del hook useAuthRouting
vi.mock('@/hooks/useAuthRouting', () => ({
  useAuthRouting: () => ({
    userRole: 'ADMIN',
    userRoles: ['ADMIN'],
    isAuthenticated: true,
    hydrated: true,
    canAccessCurrentRoute: true,
    handleRouteAccess: vi.fn(),
    routingService: {
      isPublicRoute: vi.fn(),
      isPrivateRoute: vi.fn(),
      findRouteConfig: vi.fn(),
      canUserAccessRoute: vi.fn(),
      redirectToLogin: vi.fn(),
      redirectToDashboard: vi.fn(),
      redirectToHome: vi.fn(),
      redirectToError: vi.fn(),
      getUnauthenticatedRedirect: vi.fn(),
      getRoleDefaultRoute: vi.fn(),
      getRoleBasedRedirect: vi.fn(),
      needsRoleBasedRedirect: vi.fn(),
      isAuthRoute: vi.fn(),
      severity: 'error'
    },
    pathname: '/'
  })
}))

describe('RouteManager Component', () => {
  it('renders children when user is authenticated', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      user: mockAuthService.user
    })

    render(
      <RouteManager>
        <div>Protected Content</div>
      </RouteManager>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      user: null
    })

    // Mock del hook useAuthRouting para simular usuario no autenticado
    vi.spyOn(useAuthRoutingModule, 'useAuthRouting').mockImplementation(() => ({
      userRole: undefined,
      userRoles: [],
      isAuthenticated: false,
      hydrated: true,
      canAccessCurrentRoute: false,
      handleRouteAccess: () => false,
      routingService: {
        isPublicRoute: vi.fn(),
        isPrivateRoute: vi.fn(),
        findRouteConfig: vi.fn(),
        canUserAccessRoute: vi.fn(),
        getUnauthenticatedRedirect: vi.fn(),
        getRoleDefaultRoute: vi.fn(),
        getRoleBasedRedirect: vi.fn(),
        needsRoleBasedRedirect: vi.fn(),
        isAuthRoute: vi.fn()
      },
      pathname: '/'
    }))

    const { container } = render(
      <RouteManager>
        <div>Protected Content</div>
      </RouteManager>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows loading state while checking authentication', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      isLoggingIn: true
    })

    // Mock del hook useAuthRouting para simular estado de carga
    vi.spyOn(useAuthRoutingModule, 'useAuthRouting').mockImplementation(() => ({
      userRole: undefined,
      userRoles: [],
      isAuthenticated: false,
      hydrated: false,
      canAccessCurrentRoute: false,
      handleRouteAccess: vi.fn(),
      routingService: {
        isPublicRoute: vi.fn(),
        isPrivateRoute: vi.fn(),
        findRouteConfig: vi.fn(),
        canUserAccessRoute: vi.fn(),
        getUnauthenticatedRedirect: vi.fn(),
        getRoleDefaultRoute: vi.fn(),
        getRoleBasedRedirect: vi.fn(),
        needsRoleBasedRedirect: vi.fn(),
        isAuthRoute: vi.fn()
      },
      pathname: '/'
    }))

    render(
      <RouteManager>
        <div>Protected Content</div>
      </RouteManager>
    )
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })
}) 