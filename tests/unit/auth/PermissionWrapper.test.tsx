import { render, screen } from '@testing-library/react'
import { PermissionWrapper } from '@/components/auth/PermissionWrapper'
import { describe, it, expect, vi } from 'vitest'
import { useAuthService } from '@/modules/auth/useAuth'
import { Permission, RoleType } from '@/modules/auth/auth.interfaces'
import { mockAuthService } from '../../mocks/auth'

// Mock del hook useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn()
}))

describe('PermissionWrapper Component', () => {
  it('renders children when user has required permission', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      hasPermission: vi.fn().mockReturnValue(true)
    })

    render(
      <PermissionWrapper requiredPermissions={Permission.MANAGE_ROLES}>
        <div>Protected Content</div>
      </PermissionWrapper>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('renders fallback when user does not have permission', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <PermissionWrapper 
        requiredPermissions={Permission.MANAGE_ROLES}
        fallback={<div>Access Denied</div>}
      >
        <div>Protected Content</div>
      </PermissionWrapper>
    )
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders nothing when no fallback is provided and user has no permission', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      hasPermission: vi.fn().mockReturnValue(false)
    })

    const { container } = render(
      <PermissionWrapper requiredPermissions={Permission.MANAGE_ROLES}>
        <div>Protected Content</div>
      </PermissionWrapper>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders children when user has required role', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...mockAuthService,
      hasPermission: vi.fn()
    })

    render(
      <PermissionWrapper requiredRoles={RoleType.ADMIN}>
        <div>Protected Content</div>
      </PermissionWrapper>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
}) 