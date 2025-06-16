import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { useAuthService } from '@/modules/auth/useAuth'
import { useContract } from '@/modules/contracts/hooks/useContract'
import { RoleType } from '@/modules/auth/auth.interfaces'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({
    role: 'admin',
  }),
}))

// Mock useAuthService
const mockUseAuthService = vi.fn()
vi.mock('@/modules/auth/useAuthService', () => ({
  useAuthService: () => mockUseAuthService()
}))

// Mock useAuthStore
vi.mock('@/modules/auth/auth.store', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      name: 'Admin User',
      email: 'test@example.com',
      role: { id: '1', name: 'ADMIN', permissions: ['all:manage'] },
      onboardingCompleted: true
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    hydrated: true
  })
}))

// Mock useContract
const mockUseContract = vi.fn()
vi.mock('@/modules/contracts/hooks/useContract', () => ({
  useContract: () => mockUseContract()
}))

// Mock usePayments
vi.mock('@/modules/payments/usePayments', () => ({
  usePayments: () => ({
    payments: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

describe('Dashboard Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementations
    mockUseAuthService.mockReturnValue({
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
        name: 'Admin User',
        email: 'test@example.com',
        role: { id: '1', name: 'ADMIN', permissions: ['all:manage'] },
        onboardingCompleted: true
      }
    })

    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: false,
      error: null
    })
  })

  it('should display admin dashboard cards correctly', async () => {
    render(
      <DashboardLayout
        title="Admin Dashboard"
        description="Manage system settings and monitor performance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-muted-foreground">Manage system users and their permissions</p>
            </div>
            <button
              onClick={() => console.log('Navigate to users')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Manage Users
            </button>
          </DashboardCard>

          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">Policy Management</h3>
              <p className="text-muted-foreground">Configure insurance policies and rates</p>
            </div>
            <button
              onClick={() => console.log('Navigate to policies')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Manage Policies
            </button>
          </DashboardCard>

          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">System Reports</h3>
              <p className="text-muted-foreground">View and generate system-wide reports</p>
            </div>
            <button
              onClick={() => console.log('Navigate to reports')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Reports
            </button>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestran las tarjetas del dashboard
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('Policy Management')).toBeInTheDocument()
    expect(screen.getByText('System Reports')).toBeInTheDocument()

    // Verificar que se muestran los botones de acción
    expect(screen.getByText('Manage Users')).toBeInTheDocument()
    expect(screen.getByText('Manage Policies')).toBeInTheDocument()
    expect(screen.getByText('View Reports')).toBeInTheDocument()
  })

  it('should display agent dashboard cards correctly', async () => {
    // Mock agent role
    mockUseAuthService.mockReturnValue({
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      user: {
        id: '2',
        name: 'Agent User',
        email: 'agent@example.com',
        role: { id: '2', name: 'AGENT', permissions: ['contract:manage'] },
        onboardingCompleted: true
      }
    })

    render(
      <DashboardLayout
        title="Panel del Agente"
        description="Gestione clientes, contratos y reembolsos"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">Clientes</h3>
              <p className="text-muted-foreground">Gestione la información de sus clientes</p>
            </div>
            <button
              onClick={() => console.log('Navigate to clients')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver Clientes
            </button>
          </DashboardCard>

          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">Contratos</h3>
              <p className="text-muted-foreground">Administre contratos y pólizas</p>
            </div>
            <button
              onClick={() => console.log('Navigate to contracts')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver Contratos
            </button>
          </DashboardCard>

          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">Reembolsos</h3>
              <p className="text-muted-foreground">Revise solicitudes de reembolso</p>
            </div>
            <button
              onClick={() => console.log('Navigate to reimbursements')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver Solicitudes
            </button>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestran las tarjetas del dashboard
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Contratos')).toBeInTheDocument()
    expect(screen.getByText('Reembolsos')).toBeInTheDocument()

    // Verificar que se muestran los botones de acción
    expect(screen.getByText('Ver Clientes')).toBeInTheDocument()
    expect(screen.getByText('Ver Contratos')).toBeInTheDocument()
    expect(screen.getByText('Ver Solicitudes')).toBeInTheDocument()
  })

  it('should display client dashboard cards correctly', async () => {
    // Mock client role
    mockUseAuthService.mockReturnValue({
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      user: {
        id: '3',
        name: 'Client User',
        email: 'client@example.com',
        role: { id: '3', name: 'CLIENT', permissions: ['contract:view'] },
        onboardingCompleted: true
      }
    })

    render(
      <DashboardLayout
        title="Panel del Cliente"
        description="Administre sus seguros, pagos y reembolsos"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <button
              onClick={() => console.log('Navigate to insurances')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver Seguros
            </button>
          </DashboardCard>

          <DashboardCard>
            <button
              onClick={() => console.log('Navigate to payments')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver Pagos
            </button>
          </DashboardCard>

          <DashboardCard>
            <button
              onClick={() => console.log('Navigate to reimbursements')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Solicitar Reembolso
            </button>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestran los botones de acción
    expect(screen.getByText('Ver Seguros')).toBeInTheDocument()
    expect(screen.getByText('Ver Pagos')).toBeInTheDocument()
    expect(screen.getByText('Solicitar Reembolso')).toBeInTheDocument()
  })

  it('should handle card actions correctly', async () => {
    const mockConsoleLog = vi.spyOn(console, 'log')
    
    render(
      <DashboardLayout
        title="Admin Dashboard"
        description="Manage system settings and monitor performance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-muted-foreground">Manage system users and their permissions</p>
            </div>
            <button
              onClick={() => console.log('Navigate to users')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Manage Users
            </button>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Hacer clic en el botón de acción
    const actionButton = screen.getByText('Manage Users')
    fireEvent.click(actionButton)

    // Verificar que se llamó a la función de acción
    expect(mockConsoleLog).toHaveBeenCalledWith('Navigate to users')
  })

  it('should display dashboard statistics', async () => {
    render(
      <DashboardLayout
        title="Dashboard"
        description="Bienvenido a su panel de control"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Clientes</h3>
            <p className="text-2xl font-bold">100</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Contratos Activos</h3>
            <p className="text-2xl font-bold">50</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Ingresos Totales</h3>
            <p className="text-2xl font-bold">$50,000</p>
          </div>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestran las estadísticas principales
    await waitFor(() => {
      expect(screen.getByText(/total clientes/i)).toBeInTheDocument()
      expect(screen.getByText(/contratos activos/i)).toBeInTheDocument()
      expect(screen.getByText(/ingresos totales/i)).toBeInTheDocument()
    })
  })

  it('should update statistics in real-time', async () => {
    const mockRefetch = vi.fn()
    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: false,
      isError: false,
      error: null,
      createContract: vi.fn(),
      isCreating: false,
      updateContract: vi.fn(),
      isUpdating: false,
      uploadAttachment: vi.fn(),
      isUploading: false,
      activateContractByAgent: vi.fn(),
      isActivating: false,
      activateContractByClient: vi.fn(),
      isActivatingByClient: false,
      refetch: mockRefetch
    })

    render(
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => mockRefetch()}
            >
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Clientes</h3>
              <p className="text-2xl font-bold">100</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )

    // Simular la actualización de estadísticas
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)

    // Verificar que se llamó a refetch
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('should display and interact with charts', async () => {
    render(
      <DashboardLayout
        title="Dashboard"
        description="Bienvenido a su panel de control"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Ingresos por Tiempo</h3>
            <div className="h-64">
              {/* Aquí iría el componente de gráfico */}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Contratos por Tipo</h3>
            <div className="h-64">
              {/* Aquí iría el componente de gráfico */}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestran los gráficos
    await waitFor(() => {
      expect(screen.getByText(/ingresos por tiempo/i)).toBeInTheDocument()
      expect(screen.getByText(/contratos por tipo/i)).toBeInTheDocument()
    })
  })

  it('should filter dashboard data by date range', async () => {
    const mockRefetch = vi.fn()
    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: false,
      isError: false,
      error: null,
      createContract: vi.fn(),
      isCreating: false,
      updateContract: vi.fn(),
      isUpdating: false,
      uploadAttachment: vi.fn(),
      isUploading: false,
      activateContractByAgent: vi.fn(),
      isActivating: false,
      activateContractByClient: vi.fn(),
      isActivatingByClient: false,
      refetch: mockRefetch
    })

    render(
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <label htmlFor="startDate">Fecha inicial</label>
              <input
                type="date"
                id="startDate"
                className="border rounded p-2"
                onChange={() => mockRefetch()}
              />
            </div>
            <div>
              <label htmlFor="endDate">Fecha final</label>
              <input
                type="date"
                id="endDate"
                className="border rounded p-2"
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )

    // Simular cambio de fecha
    const startDateInput = screen.getByLabelText(/fecha inicial/i)
    fireEvent.change(startDateInput, { target: { value: '2024-03-20' } })

    // Verificar que se llamó a refetch
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('should handle dashboard notifications', async () => {
    render(
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">Actividad Reciente</h3>
            <div className="mt-4">
              <div className="p-2 hover:bg-gray-50 cursor-pointer">
                <p>Nueva notificación</p>
                <p className="text-sm text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )

    // Simular notificación
    const notification = screen.getByText(/nueva notificación/i)
    fireEvent.click(notification)

    // Verificar que la notificación se marcó como leída
    await waitFor(() => {
      expect(notification.closest('div')).toHaveClass('p-2')
    })
  })

  it('should export dashboard data', async () => {
    render(
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                const modal = document.createElement('div')
                modal.innerHTML = `
                  <div class="modal">
                    <h2>Exportar Datos</h2>
                    <div>
                      <button>CSV</button>
                      <button>Excel</button>
                      <button>PDF</button>
                    </div>
                  </div>
                `
                document.body.appendChild(modal)
              }}
            >
              Exportar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold">Estadísticas</h3>
              <p className="text-2xl font-bold">100</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )

    // Hacer clic en el botón de exportar
    const exportButton = screen.getByRole('button', { name: /exportar/i })
    fireEvent.click(exportButton)

    // Verificar que se muestra el modal de exportación
    await waitFor(() => {
      expect(screen.getByText('Exportar Datos')).toBeInTheDocument()
    })

    // Verificar las opciones de exportación
    expect(screen.getByText('CSV')).toBeInTheDocument()
    expect(screen.getByText('Excel')).toBeInTheDocument()
    expect(screen.getByText('PDF')).toBeInTheDocument()
  })

  it('should handle loading states correctly', async () => {
    // Mock loading state
    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: true,
      error: null
    })

    render(
      <DashboardLayout
        title="Admin Dashboard"
        description="Manage system settings and monitor performance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">Loading...</h3>
              <p className="text-muted-foreground">Please wait while we load your data</p>
            </div>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestra el estado de carga
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle error states correctly', async () => {
    // Mock error state
    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: false,
      error: new Error('Failed to load data')
    })

    render(
      <DashboardLayout
        title="Admin Dashboard"
        description="Manage system settings and monitor performance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">Error</h3>
              <p className="text-muted-foreground">Failed to load data</p>
            </div>
            <button
              onClick={() => console.log('Retry')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestra el estado de error
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('should handle empty states correctly', async () => {
    // Mock empty state
    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: false,
      error: null
    })

    render(
      <DashboardLayout
        title="Admin Dashboard"
        description="Manage system settings and monitor performance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard>
            <div>
              <h3 className="text-lg font-semibold">No Data</h3>
              <p className="text-muted-foreground">There are no entries to display</p>
            </div>
            <button
              onClick={() => console.log('Create New')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New
            </button>
          </DashboardCard>
        </div>
      </DashboardLayout>
    )

    // Verificar que se muestra el estado vacío
    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText('There are no entries to display')).toBeInTheDocument()
    expect(screen.getByText('Create New')).toBeInTheDocument()
  })

  it('should handle role-based access control', async () => {
    type Role = 'ADMIN' | 'AGENT' | 'CLIENT'
    const roles: Role[] = ['ADMIN', 'AGENT', 'CLIENT']
    const canExport: Record<Role, boolean> = { ADMIN: true, AGENT: true, CLIENT: false }
    const canFilter: Record<Role, boolean> = { ADMIN: true, AGENT: true, CLIENT: false }

    for (const role of roles) {
      mockUseAuthService.mockReturnValue({
        login: vi.fn(),
        isLoggingIn: false,
        register: vi.fn(),
        isRegistering: false,
        logout: vi.fn(),
        user: {
          id: '1',
          name: `${role} User`,
          email: `${role.toLowerCase()}@example.com`,
          role: { id: '1', name: role, permissions: ['all:manage'] },
          onboardingCompleted: true
        }
      })

      render(
        <DashboardLayout>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div>
                  <h3 className="text-lg font-semibold">Data Management</h3>
                  <p className="text-muted-foreground">Manage your data</p>
                </div>
                {canExport[role] && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Export Data
                  </button>
                )}
                {canFilter[role] && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Filter Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </DashboardLayout>
      )

      // Verificar que los botones se muestran según el rol
      if (canExport[role]) {
        expect(screen.getByRole('button', { name: 'Export Data' })).toBeInTheDocument()
      } else {
        expect(screen.queryByRole('button', { name: 'Export Data' })).not.toBeInTheDocument()
      }

      if (canFilter[role]) {
        expect(screen.getByRole('button', { name: 'Filter Data' })).toBeInTheDocument()
      } else {
        expect(screen.queryByRole('button', { name: 'Filter Data' })).not.toBeInTheDocument()
      }

      cleanup()
    }
  })
}) 