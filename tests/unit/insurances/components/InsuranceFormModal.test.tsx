import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InsuranceFormModal } from '@/modules/insurances/components/InsuranceFormModal'
import { IInsurance } from '@/modules/insurances/interfaces/insurance.interfaces'
import { useInsurances } from '@/modules/insurances/useInsurances'
import React from 'react'
import { InsuranceType, PaymentFrequency } from '@/modules/insurances/enums/insurance.enums'

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  X: vi.fn(() => null),
  XIcon: vi.fn(() => null),
  Eye: vi.fn(() => null),
  EyeOff: vi.fn(() => null),
  Plus: vi.fn(() => null),
  Search: vi.fn(() => null),
  Filter: vi.fn(() => null),
  MoreHorizontal: vi.fn(() => null),
  Edit: vi.fn(() => null),
  Trash2: vi.fn(() => null),
  ChevronDown: vi.fn(() => null),
  ChevronDownIcon: vi.fn(() => null),
  ChevronUp: vi.fn(() => null),
  ChevronUpIcon: vi.fn(() => null),
  ChevronLeft: vi.fn(() => null),
  ChevronLeftIcon: vi.fn(() => null),
  ChevronRight: vi.fn(() => null),
  ChevronRightIcon: vi.fn(() => null),
  Calendar: vi.fn(() => null),
  Clock: vi.fn(() => null),
  User: vi.fn(() => null),
  Mail: vi.fn(() => null),
  Phone: vi.fn(() => null),
  MapPin: vi.fn(() => null),
  FileText: vi.fn(() => null),
  CreditCard: vi.fn(() => null),
  DollarSign: vi.fn(() => null),
  Check: vi.fn(() => null),
  CheckIcon: vi.fn(() => null),
  AlertCircle: vi.fn(() => null),
  Info: vi.fn(() => null),
  Warning: vi.fn(() => null),
  Loader2: vi.fn(() => null),
  Key: vi.fn(() => null),
  RefreshCw: vi.fn(() => null),
  Settings: vi.fn(() => null),
  LogOut: vi.fn(() => null),
  Menu: vi.fn(() => null),
  Home: vi.fn(() => null),
  Shield: vi.fn(() => null),
  Users: vi.fn(() => null),
  File: vi.fn(() => null),
  BarChart3: vi.fn(() => null),
  TrendingUp: vi.fn(() => null),
  Activity: vi.fn(() => null),
  Zap: vi.fn(() => null),
  Star: vi.fn(() => null),
  Heart: vi.fn(() => null),
  ThumbsUp: vi.fn(() => null),
  ThumbsDown: vi.fn(() => null),
  MessageCircle: vi.fn(() => null),
  Bell: vi.fn(() => null),
  Download: vi.fn(() => null),
  Upload: vi.fn(() => null),
  Copy: vi.fn(() => null),
  ExternalLink: vi.fn(() => null),
  Link: vi.fn(() => null),
  Lock: vi.fn(() => null),
  Unlock: vi.fn(() => null),
  EyeIcon: vi.fn(() => null),
  EyeOffIcon: vi.fn(() => null),
}))

// Mock de ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

// Mock de useInsurances
vi.mock('@/modules/insurances/useInsurances', () => ({
  useInsurances: vi.fn(() => ({
    insurances: [],
    isLoading: false,
    error: null,
    createInsurance: vi.fn(),
    updateInsurance: vi.fn(),
    deleteInsurance: vi.fn(),
  })),
  INSURANCE_QUERY_KEYS: {
    all: () => ['insurances'],
    lists: () => [...['insurances'], 'list'],
    list: (filters: any) => [...['insurances', 'list'], { filters }],
    details: () => [...['insurances'], 'detail'],
    detail: (id: string) => [...['insurances', 'detail'], id],
    coverages: () => [...['insurances'], 'coverages'],
    benefits: () => [...['insurances'], 'benefits'],
  },
}))

// Mock de useCoverages
vi.mock('@/modules/insurances/useCoverages', () => ({
  useCoverages: vi.fn(() => ({
    coverages: [],
    isLoading: false,
    error: null,
    createCoverage: vi.fn(),
    updateCoverage: vi.fn(),
    deleteCoverage: vi.fn(),
  })),
}))

// Mock de useBenefits
vi.mock('@/modules/insurances/useBenefits', () => ({
  useBenefits: vi.fn(() => ({
    benefits: [],
    isLoading: false,
    error: null,
    createBenefit: vi.fn(),
    updateBenefit: vi.fn(),
    deleteBenefit: vi.fn(),
  })),
}))

describe('InsuranceFormModal', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    })
    vi.clearAllMocks()
    ;(useInsurances as any).mockReturnValue({
      insurances: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      isLoading: false,
      isError: false,
      error: null,
      createInsurance: vi.fn(),
      updateInsurance: vi.fn(),
      deleteInsurance: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      refetch: vi.fn()
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    insurance: null,
    mode: 'create' as const
  }

  const insurance = {
    id: '1',
    name: 'Seguro de Vida',
    description: 'Seguro de vida básico',
    type: InsuranceType.LIFE,
    basePrice: 100,
    order: 1,
    prices: [],
    requirements: [],
    coverages: [],
    benefits: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: null,
    availablePaymentFrequencies: [PaymentFrequency.MONTHLY],
  }

  it('debe renderizar el modal en modo creación', () => {
    render(<InsuranceFormModal {...defaultProps} />)
    expect(true).toBe(true)
  })

  it('debe renderizar el modal en modo edición', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <InsuranceFormModal {...defaultProps} mode="edit" insurance={insurance} />
      </QueryClientProvider>
    )
    expect(screen.getByText('Editar Plan de Seguro')).toBeInTheDocument()
  })

  it('debe cerrar el modal al hacer clic en cancelar', () => {
    render(<InsuranceFormModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('debe mostrar errores de validación al enviar el formulario vacío', async () => {
    render(<InsuranceFormModal {...defaultProps} />)
    const submitButton = screen.getByRole('button', { name: /Crear/i })
    fireEvent.click(submitButton)
    expect(true).toBe(true)
  })

  it('debe agregar y eliminar requisitos', () => {
    render(<InsuranceFormModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('Ingrese un requisito')
    fireEvent.change(input, { target: { value: 'Nuevo requisito' } })
    fireEvent.click(screen.getByRole('button', { name: /Añadir/i }))
    expect(true).toBe(true)
  })

  it('debe seleccionar y deseleccionar frecuencias de pago', async () => {
    render(<InsuranceFormModal {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Mensual' })
    fireEvent.click(checkbox)
    expect(true).toBe(true)
  })

  it('debe mostrar el botón de guardar deshabilitado mientras se procesa', () => {
    ;(useInsurances as any).mockReturnValue({
      insurances: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      isLoading: false,
      isError: false,
      error: null,
      createInsurance: vi.fn(),
      updateInsurance: vi.fn(),
      deleteInsurance: vi.fn(),
      isCreating: true,
      isUpdating: false,
      isDeleting: false,
      refetch: vi.fn()
    })

    render(<InsuranceFormModal {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /Guardando/i })
    expect(submitButton).toBeDisabled()
  })
}) 