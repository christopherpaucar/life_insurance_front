import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuthService } from '@/modules/auth/useAuth'
import { RoleType, PERMISSIONS } from '@/modules/auth/auth.interfaces'
import { SidebarProvider } from '@/components/ui/sidebar'

// Mock de next/navigation
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/admin/dashboard',
}))

// Mock de useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn(),
}))

describe('Navigation Permissions Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithSidebar = (ui: React.ReactElement) => {
    return render(
      <SidebarProvider>
        {ui}
      </SidebarProvider>
    )
  }

  it('should show basic navigation items for any user', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.ADMIN,
        permissions: [],
      },
      onboardingCompleted: true,
    }

    vi.mocked(useAuthService).mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      isLoggingOut: false,
      hasPermission: vi.fn().mockReturnValue(false),
      clearError: vi.fn(),
      completeOnboarding: vi.fn(),
      isCompletingOnboarding: false,
      updateOnboarding: vi.fn(),
      isUpdatingOnboarding: false,
    })

    renderWithSidebar(
      <div className="flex">
        <AppSidebar />
        <DashboardLayout
          title="Dashboard"
          description="Bienvenido a su panel de control"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </div>
    )

    // Verificar que el Dashboard siempre está visible
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    expect(dashboardLink).toBeInTheDocument()
  })

  it('should show admin navigation items for admin user', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.ADMIN,
        permissions: [PERMISSIONS[RoleType.ADMIN][0]],
      },
      onboardingCompleted: true,
    }

    vi.mocked(useAuthService).mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      isLoggingOut: false,
      hasPermission: vi.fn().mockImplementation((permission) => 
        mockUser.role.permissions.includes(permission)
      ),
      clearError: vi.fn(),
      completeOnboarding: vi.fn(),
      isCompletingOnboarding: false,
      updateOnboarding: vi.fn(),
      isUpdatingOnboarding: false,
    })

    renderWithSidebar(
      <div className="flex">
        <AppSidebar />
        <DashboardLayout
          title="Dashboard"
          description="Bienvenido a su panel de control"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </div>
    )

    // Verificar que los elementos de navegación están presentes
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Gestión de Usuarios/i })).toBeInTheDocument()
    })
  })

  it('should show all navigation items for super admin', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.SUPER_ADMIN,
        permissions: PERMISSIONS[RoleType.SUPER_ADMIN],
      },
      onboardingCompleted: true,
    }

    vi.mocked(useAuthService).mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      isLoggingOut: false,
      hasPermission: vi.fn().mockReturnValue(true),
      clearError: vi.fn(),
      completeOnboarding: vi.fn(),
      isCompletingOnboarding: false,
      updateOnboarding: vi.fn(),
      isUpdatingOnboarding: false,
    })

    renderWithSidebar(
      <div className="flex">
        <AppSidebar />
        <DashboardLayout
          title="Dashboard"
          description="Bienvenido a su panel de control"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </div>
    )

    // Verificar que todos los elementos de navegación están presentes
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Gestión de Seguros/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Gestión de Coberturas/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Gestión de Beneficios/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Gestión de Usuarios/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Reportes/i })).toBeInTheDocument()
    })
  })

  it('should handle unauthorized navigation', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.ADMIN,
        permissions: [],
      },
      onboardingCompleted: true,
    }

    const mockHasPermission = vi.fn().mockReturnValue(false)
    vi.mocked(useAuthService).mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      isLoggingOut: false,
      hasPermission: mockHasPermission,
      clearError: vi.fn(),
      completeOnboarding: vi.fn(),
      isCompletingOnboarding: false,
      updateOnboarding: vi.fn(),
      isUpdatingOnboarding: false,
    })

    renderWithSidebar(
      <div className="flex">
        <AppSidebar />
        <DashboardLayout
          title="Dashboard"
          description="Bienvenido a su panel de control"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </div>
    )

    // Verificar que el enlace está presente
    const unauthorizedLink = screen.getByRole('link', { name: /Gestión de Seguros/i })
    expect(unauthorizedLink).toBeInTheDocument()

    // Verificar que el enlace tiene las clases correctas para indicar que está deshabilitado
    expect(unauthorizedLink).toHaveClass('disabled:pointer-events-none')
    expect(unauthorizedLink).toHaveClass('disabled:opacity-50')

    // Intentar navegar a una ruta no autorizada
    fireEvent.click(unauthorizedLink)

    // Verificar que el router no fue llamado
    expect(mockRouter.push).not.toHaveBeenCalled()
  })
}) 