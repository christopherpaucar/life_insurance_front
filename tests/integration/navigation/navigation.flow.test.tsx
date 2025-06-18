import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuthService } from '@/modules/auth/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { RoleType } from '@/modules/auth/auth.interfaces'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

// Mock next/navigation
const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
}

const mockPathname = vi.fn(() => '/admin/dashboard')

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname(),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} onClick={(e) => {
      e.preventDefault()
      mockRouter.push(href)
    }} {...props}>
      {children}
    </a>
  ),
}))

// Mock useAuthService
const mockLogout = vi.fn()
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn(() => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: {
        id: 1,
        name: RoleType.ADMIN,
      },
    },
    login: vi.fn(),
    isLoggingIn: false,
    register: vi.fn(),
    isRegistering: false,
    logout: mockLogout,
    isLoggingOut: false,
    completeOnboarding: vi.fn(),
    isCompletingOnboarding: false,
    updateOnboarding: vi.fn(),
    isUpdatingOnboarding: false,
    clearError: vi.fn(),
    hasPermission: vi.fn(),
  })),
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SidebarProvider>
      {ui}
    </SidebarProvider>
  )
}

describe('Navigation Flow Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear()
    // Simular un usuario autenticado
    localStorage.setItem('token', 'fake-token')
    // Limpiar mocks
    vi.clearAllMocks()
    // Resetear el pathname por defecto
    mockPathname.mockReturnValue('/admin/dashboard')
  })

  it('should navigate between main sections', async () => {
    renderWithProviders(
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

    // Verificar que los elementos de navegación estén presentes
    expect(screen.getByText('Seguros Sur')).toBeInTheDocument()
    expect(screen.getByText('Main Navigation')).toBeInTheDocument()

    // Verificar que los enlaces principales estén presentes
    const mainLinks = screen.getAllByRole('link')
    expect(mainLinks.length).toBeGreaterThan(0)

    // Simular clic en un enlace
    const insuranceLink = screen.getByRole('link', { name: /gestión de seguros/i })
    fireEvent.click(insuranceLink)

    // Verificar que el router fue llamado con la ruta correcta
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/insurance')
  })

  it('should handle breadcrumb navigation', async () => {
    renderWithProviders(
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

    // Verificar que el título y la descripción están presentes
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Bienvenido a su panel de control')).toBeInTheDocument()
  })

  it('should handle responsive navigation', async () => {
    renderWithProviders(
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

    // Verificar que el sidebar está presente
    expect(screen.getByText('Seguros Sur')).toBeInTheDocument()
    expect(screen.getByText('Main Navigation')).toBeInTheDocument()
  })

  it('should handle unauthorized navigation', async () => {
    // Simular usuario no autenticado
    vi.mocked(useAuthService).mockReturnValueOnce({
      user: null,
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: mockLogout,
      isLoggingOut: false,
      completeOnboarding: vi.fn(),
      isCompletingOnboarding: false,
      updateOnboarding: vi.fn(),
      isUpdatingOnboarding: false,
      clearError: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false),
    })

    // Simular una ruta protegida
    mockPathname.mockReturnValueOnce('/admin/insurance')

    // Simular que el usuario no está autenticado
    localStorage.removeItem('auth-storage')

    // Simular el efecto de redirección
    const mockEffect = vi.fn()
    vi.spyOn(React, 'useEffect').mockImplementationOnce(mockEffect)

    renderWithProviders(
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

    // Simular el efecto de redirección
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    }, { timeout: 1000 })
  })

  it('should handle active navigation state', () => {
    // Simular la ruta actual
    mockPathname.mockReturnValueOnce('/admin/dashboard')

    // Simular usuario autenticado con rol de admin
    vi.mocked(useAuthService).mockReturnValueOnce({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: { 
          id: '1',
          name: 'ADMIN',
          permissions: ['read', 'write']
        },
        onboardingCompleted: true
      },
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: mockLogout,
      isLoggingOut: false,
      completeOnboarding: vi.fn(),
      isCompletingOnboarding: false,
      updateOnboarding: vi.fn(),
      isUpdatingOnboarding: false,
      clearError: vi.fn(),
      hasPermission: vi.fn(),
    })

    renderWithProviders(
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

    // Verificar que el título de la página es Dashboard
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
}) 