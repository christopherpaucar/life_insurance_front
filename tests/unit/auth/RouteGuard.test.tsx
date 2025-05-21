import { render, screen } from '@testing-library/react'
import { RouteGuard } from '@/components/auth/RouteGuard'
import { describe, it, expect, vi } from 'vitest'
import { useAuthRouting } from '@/hooks/useAuthRouting'
import { RoleType } from '@/modules/auth/auth.interfaces'

// Mock del hook useAuthRouting
vi.mock('@/hooks/useAuthRouting', () => ({
  useAuthRouting: vi.fn()
}))

describe('RouteGuard Component', () => {
  const mockRoutingService = {
    isPublicRoute: vi.fn(),
    isPrivateRoute: vi.fn(),
    findRouteConfig: vi.fn(),
    canUserAccessRoute: vi.fn(),
    canAccessRoute: vi.fn(),
    redirectToLogin: vi.fn(),
    redirectToDashboard: vi.fn(),
    redirectToHome: vi.fn(),
    redirectToError: vi.fn(),
    getUnauthenticatedRedirect: vi.fn(),
    getRoleDefaultRoute: vi.fn(),
    getRoleBasedRedirect: vi.fn(),
    needsRoleBasedRedirect: vi.fn(),
    isAuthRoute: vi.fn()
  }

  it('renders children when not on dashboard path', () => {
    vi.mocked(useAuthRouting).mockReturnValue({
      userRole: RoleType.ADMIN,
      userRoles: [RoleType.ADMIN],
      isAuthenticated: true,
      hydrated: true,
      canAccessCurrentRoute: true,
      handleRouteAccess: vi.fn(),
      routingService: mockRoutingService,
      pathname: '/other-path'
    })

    render(
      <RouteGuard>
        <div>Protected Content</div>
      </RouteGuard>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('returns null when on dashboard path', () => {
    vi.mocked(useAuthRouting).mockReturnValue({
      userRole: RoleType.ADMIN,
      userRoles: [RoleType.ADMIN],
      isAuthenticated: true,
      hydrated: true,
      canAccessCurrentRoute: true,
      handleRouteAccess: vi.fn(),
      routingService: mockRoutingService,
      pathname: '/dashboard'
    })

    const { container } = render(
      <RouteGuard>
        <div>Protected Content</div>
      </RouteGuard>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('calls handleRouteAccess when hydrated', () => {
    const mockHandleRouteAccess = vi.fn()
    vi.mocked(useAuthRouting).mockReturnValue({
      userRole: RoleType.ADMIN,
      userRoles: [RoleType.ADMIN],
      isAuthenticated: true,
      hydrated: true,
      canAccessCurrentRoute: true,
      handleRouteAccess: mockHandleRouteAccess,
      routingService: mockRoutingService,
      pathname: '/test'
    })

    render(
      <RouteGuard>
        <div>Protected Content</div>
      </RouteGuard>
    )
    
    expect(mockHandleRouteAccess).toHaveBeenCalled()
  })
}) 