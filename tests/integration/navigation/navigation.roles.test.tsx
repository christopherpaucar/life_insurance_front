import { screen, fireEvent, waitFor, render } from '@testing-library/react'
import { vi } from 'vitest'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuthService } from '@/modules/auth/useAuth'
import { RoleType } from '@/modules/auth/auth.interfaces'
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

describe('Navigation Roles Integration Tests', () => {
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

  it('should show admin navigation items for admin role', async () => {
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

    // Verificar que los elementos de navegación del admin estén presentes
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /gestión de seguros/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /gestión de usuarios/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /reportes/i })).toBeInTheDocument()
    })
  })

  it('should show agent navigation items for agent role', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.AGENT,
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

    // Verificar que los elementos de navegación del agente estén presentes
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /contratación de seguros/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /reportes/i })).toBeInTheDocument()
    })
  })

  it('should show client navigation items for client role', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.CLIENT,
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

    // Verificar que los elementos de navegación del cliente estén presentes
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /planes de seguro/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /mis seguros/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /historial de pagos/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /reembolsos/i })).toBeInTheDocument()
    })
  })

  it('should show reviewer navigation items for reviewer role', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.REVIEWER,
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

    // Verificar que los elementos de navegación del revisor estén presentes
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /solicitudes de reembolsos/i })).toBeInTheDocument()
    })
  })

  it('should handle role-based navigation restrictions', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: '1',
        name: RoleType.CLIENT,
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

    // Verificar que los elementos de navegación restringidos no están presentes
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: /gestión de usuarios/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /gestión de seguros/i })).not.toBeInTheDocument()
    })
  })
}) 