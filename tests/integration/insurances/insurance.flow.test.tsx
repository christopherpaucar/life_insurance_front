import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useInsurances } from '@/modules/insurances/useInsurances'
import { useAuthService } from '@/modules/auth/useAuth'
import { useAuthStore } from '@/modules/auth/auth.store'
import InsurancesPage from '@/app/admin/insurance/page'
import { InsuranceType, PaymentFrequency } from '@/modules/insurances/enums/insurance.enums'
import { IInsurance } from '@/modules/insurances/interfaces/insurance.interfaces'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  XIcon: () => <span data-testid="x-icon">X</span>,
  PlusIcon: () => <span data-testid="plus-icon">+</span>,
  SearchIcon: () => <span data-testid="search-icon">🔍</span>,
  ChevronDownIcon: () => <span data-testid="chevron-down-icon">▼</span>,
  ChevronUpIcon: () => <span data-testid="chevron-up-icon">▲</span>,
  ChevronLeftIcon: () => <span data-testid="chevron-left-icon">◀</span>,
  ChevronRightIcon: () => <span data-testid="chevron-right-icon">▶</span>,
  Loader2Icon: () => <span data-testid="loader-icon">⌛</span>,
  AlertCircleIcon: () => <span data-testid="alert-icon">⚠</span>,
  Trash2Icon: () => <span data-testid="trash-icon">🗑</span>,
  PencilIcon: () => <span data-testid="pencil-icon">✏</span>,
  CheckIcon: () => <span data-testid="check-icon">✓</span>,
  XCircleIcon: () => <span data-testid="x-circle-icon">✕</span>
}))

// Mock de @tabler/icons-react
vi.mock('@tabler/icons-react', () => ({
  IconChevronLeft: () => <span data-testid="chevron-left-icon">◀</span>,
  IconChevronRight: () => <span data-testid="chevron-right-icon">▶</span>,
  IconChevronsLeft: () => <span data-testid="chevrons-left-icon">⏮</span>,
  IconChevronsRight: () => <span data-testid="chevrons-right-icon">⏭</span>,
  IconDotsVertical: () => <span data-testid="dots-vertical-icon">⋮</span>,
  IconPlus: () => <span data-testid="plus-icon">+</span>,
  IconTrash: () => <span data-testid="trash-icon">🗑</span>,
  IconPencil: () => <span data-testid="pencil-icon">✏</span>
}))

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock de useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn()
}))

// Mock de useAuthStore
vi.mock('@/modules/auth/auth.store', () => ({
  useAuthStore: vi.fn()
}))

// Mock useInsurances hook
vi.mock('@/modules/insurances/useInsurances', () => {
  const INSURANCE_QUERY_KEYS = {
    all: ['insurances'],
    lists: () => [...INSURANCE_QUERY_KEYS.all, 'list'],
    list: (filters: string) => [...INSURANCE_QUERY_KEYS.lists(), { filters }],
    details: () => [...INSURANCE_QUERY_KEYS.all, 'detail'],
    detail: (id: string) => [...INSURANCE_QUERY_KEYS.details(), id],
    coverages: () => [...INSURANCE_QUERY_KEYS.all, 'coverages'],
    benefits: () => [...INSURANCE_QUERY_KEYS.all, 'benefits'],
    requirements: () => [...INSURANCE_QUERY_KEYS.all, 'requirements']
  }

  return {
    useInsurances: vi.fn(),
    INSURANCE_QUERY_KEYS
  }
})

// Mock useCoverages hook
vi.mock('@/modules/insurances/useCoverages', () => ({
  useCoverages: vi.fn(() => ({
    coverages: [],
    isLoading: false,
    error: null
  }))
}))

// Mock useBenefits hook
vi.mock('@/modules/insurances/useBenefits', () => ({
  useBenefits: vi.fn(() => ({
    benefits: [],
    isLoading: false,
    error: null
  }))
}))

// Mock useRequirements hook
vi.mock('@/modules/insurances/useRequirements', () => ({
  useRequirements: vi.fn(() => ({
    requirements: [],
    isLoading: false,
    error: null
  }))
}))

describe('Insurance Management Flow Integration Tests', () => {
  // Configurar timeout global para todas las pruebas
  vi.setConfig({ testTimeout: 30000 })

  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/admin/insurance',
  }

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: {
      id: '1',
      name: 'ADMIN',
      permissions: ['manage_insurances']
    },
    onboardingCompleted: true
  }

  const mockInsurances: IInsurance[] = [
    {
      id: '1',
      name: 'Test Insurance',
      type: InsuranceType.LIFE,
      description: 'Test Description',
      prices: [{ price: 1000, frequency: PaymentFrequency.MONTHLY }],
      requirements: [],
      coverages: [],
      benefits: [],
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    }
  ]

  const mockUseInsurances = {
    insurances: mockInsurances,
    isLoading: false,
    error: null,
    createInsurance: vi.fn(),
    updateInsurance: vi.fn(),
    deleteInsurance: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    refetch: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue(mockRouter)
    vi.mocked(useAuthService).mockReturnValue({
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
      user: mockUser
    })
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      setUser: vi.fn(),
      clearUser: vi.fn()
    })
    ;(useInsurances as any).mockReturnValue(mockUseInsurances)

    // Mock de toast para verificar mensajes de error
    vi.spyOn(toast, 'error').mockImplementation(() => 'error-toast-id')
    vi.spyOn(toast, 'success').mockImplementation(() => 'success-toast-id')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderWithQueryClient = (component: React.ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('should display insurance list after successful authentication', async () => {
    render(<InsurancesPage />)

    // Verificar que se muestra la lista de seguros
    expect(screen.getByText('Test Insurance')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should create a new insurance type', async () => {
    renderWithQueryClient(<InsurancesPage />)

    // Hacer clic en el botón de crear nuevo seguro
    const createButton = screen.getByText('Nuevo Plan')
    await userEvent.click(createButton)

    // Esperar a que el modal esté visible
    await waitFor(() => {
      expect(screen.getByText('Crear Plan de Seguro')).toBeInTheDocument()
    })

    // Llenar el formulario
    const nameInput = screen.getByLabelText('Nombre del Plan')
    const descriptionInput = screen.getByLabelText('Descripción')
    const priceInput = screen.getByLabelText('Precio Base')

    await userEvent.type(nameInput, 'Test Insurance')
    await userEvent.type(descriptionInput, 'Test Description')
    await userEvent.type(priceInput, '1000')

    // Hacer clic en el botón de crear
    const submitButton = screen.getByText('Crear')
    await userEvent.click(submitButton)

    // Verificar que se llamó a createInsurance con los datos correctos
    expect(mockUseInsurances.createInsurance).toHaveBeenCalledWith(
      {
        name: 'Test Insurance',
        type: InsuranceType.LIFE,
        description: 'Test Description',
        basePrice: 1000,
        availablePaymentFrequencies: [PaymentFrequency.MONTHLY],
        order: 1,
        requirements: [],
        coverages: [],
        benefits: []
      },
      expect.objectContaining({
        onSuccess: expect.any(Function)
      })
    )
  })

  it('should edit an existing insurance type', async () => {
    renderWithQueryClient(<InsurancesPage />)

    // Hacer clic en el botón de menú para abrirlo
    const editMenuIcon = screen.getByTestId('dots-vertical-icon')
    const editMenuButton = editMenuIcon.closest('button')
    if (!editMenuButton) {
      throw new Error('Menu button not found')
    }
    await userEvent.click(editMenuButton)

    // Esperar a que el menú esté visible y hacer clic en el botón de editar
    await waitFor(() => {
      const editButton = screen.getByText('Editar')
      expect(editButton).toBeInTheDocument()
      editButton.click()
    })

    // Esperar a que el modal esté visible
    await waitFor(() => {
      expect(screen.getByText('Editar Plan de Seguro')).toBeInTheDocument()
    })

    // Llenar el formulario con los nuevos valores
    const nameInput = screen.getByLabelText('Nombre del Plan')
    const descriptionInput = screen.getByLabelText('Descripción')
    const priceInput = screen.getByLabelText('Precio Base')

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Updated Insurance')
    await userEvent.clear(descriptionInput)
    await userEvent.type(descriptionInput, 'Updated Description')
    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '2000')

    // Intentar guardar los cambios
    const saveButton = screen.getByText('Guardar Cambios')
    await userEvent.click(saveButton)

    // Verificar que se llamó a updateInsurance con los datos correctos
    expect(mockUseInsurances.updateInsurance).toHaveBeenCalledWith(
      '1',
      {
        name: 'Updated Insurance',
        description: 'Updated Description',
        basePrice: 2000
      },
      expect.objectContaining({
        onSuccess: expect.any(Function)
      })
    )
  })

  it('should delete an insurance type', async () => {
    renderWithQueryClient(<InsurancesPage />)

    // Hacer clic en el botón de menú para abrirlo
    const deleteMenuIcon = screen.getByTestId('dots-vertical-icon')
    const deleteMenuButton = deleteMenuIcon.closest('button')
    if (!deleteMenuButton) {
      throw new Error('Menu button not found')
    }
    await userEvent.click(deleteMenuButton)

    // Esperar a que el menú esté visible y hacer clic en el botón de eliminar
    await waitFor(() => {
      const deleteButton = screen.getByText('Eliminar')
      expect(deleteButton).toBeInTheDocument()
      deleteButton.click()
    })

    // Esperar a que el diálogo de confirmación esté visible
    await waitFor(() => {
      expect(screen.getByText('¿Está seguro?')).toBeInTheDocument()
      expect(screen.getByText(/Esta acción eliminará permanentemente el seguro/)).toBeInTheDocument()
    })

    // Confirmar la eliminación
    const confirmButton = screen.getByText('Eliminar')
    await userEvent.click(confirmButton)

    // Verificar que se llamó a deleteInsurance con el ID correcto
    expect(mockUseInsurances.deleteInsurance).toHaveBeenCalledWith('1')
  })

  it('should filter insurances by name', async () => {
    render(<InsurancesPage />)

    // Buscar por nombre
    const searchInput = screen.getByPlaceholderText('Filtrar por nombre...')
    fireEvent.change(searchInput, { target: { value: 'Test Insurance' } })

    // Verificar que se muestra el seguro filtrado
    expect(screen.getByText('Test Insurance')).toBeInTheDocument()
    expect(screen.queryByText('Other Insurance')).not.toBeInTheDocument()
  })

  describe('Form Validation Tests', () => {
    it('should show validation errors for required fields', async () => {
      renderWithQueryClient(<InsurancesPage />)

      // Hacer clic en el botón de crear nuevo seguro
      const createButton = screen.getByText('Nuevo Plan')
      await userEvent.click(createButton)

      // Esperar a que el modal esté visible
      await waitFor(() => {
        expect(screen.getByText('Crear Plan de Seguro')).toBeInTheDocument()
      })

      // Intentar enviar el formulario sin datos
      const submitButton = screen.getByText('Crear')
      await userEvent.click(submitButton)

      // Verificar mensajes de error
      await waitFor(() => {
        expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument()
        expect(screen.getByText('La descripción debe tener al menos 10 caracteres')).toBeInTheDocument()
      })
    })

    it('should validate price is a positive number', async () => {
      renderWithQueryClient(<InsurancesPage />)

      // Hacer clic en el botón de crear nuevo seguro
      const createButton = screen.getByText('Nuevo Plan')
      await userEvent.click(createButton)

      // Esperar a que el modal esté visible
      await waitFor(() => {
        expect(screen.getByText('Crear Plan de Seguro')).toBeInTheDocument()
      })

      // Llenar el formulario con un precio negativo
      const nameInput = screen.getByLabelText('Nombre del Plan')
      const descriptionInput = screen.getByLabelText('Descripción')
      const priceInput = screen.getByLabelText('Precio Base')

      await userEvent.type(nameInput, 'Test Insurance')
      await userEvent.type(descriptionInput, 'Test Description')
      await userEvent.type(priceInput, '-1000')

      // Intentar enviar el formulario
      const submitButton = screen.getByText('Crear')
      await userEvent.click(submitButton)

      // Verificar mensaje de error
      await waitFor(() => {
        expect(screen.getByText('El precio debe ser un número positivo')).toBeInTheDocument()
      })
    })
  })

  describe('Filtering and Search Tests', () => {
    it('should filter insurances by name', async () => {
      renderWithQueryClient(<InsurancesPage />)

      // Buscar el campo de filtro
      const filterInput = screen.getByPlaceholderText('Filtrar por nombre...')
      
      // Escribir en el campo de filtro
      await userEvent.type(filterInput, 'Test Insurance')

      // Verificar que la tabla se actualiza
      await waitFor(() => {
        expect(screen.getByText('Test Insurance')).toBeInTheDocument()
      })
    })

    it('should show no results message when filter has no matches', async () => {
      renderWithQueryClient(<InsurancesPage />)

      // Buscar el campo de filtro
      const filterInput = screen.getByPlaceholderText('Filtrar por nombre...')
      
      // Escribir en el campo de filtro un texto que no coincida con ningún seguro
      await userEvent.type(filterInput, 'No existe este seguro')

      // Verificar que se muestra el mensaje de no hay resultados
      await waitFor(() => {
        expect(screen.getByText('No se encontraron resultados.')).toBeInTheDocument()
      })
    })
  })
}) 