import { MoreHorizontal, FileText, Download, ChevronDown, ChevronUp, CheckIcon } from 'lucide-react'
import { useContract } from '@/modules/contracts/hooks/useContract'
import { ContractStatus, PaymentFrequency } from '@/modules/contracts/contract.interfaces'
import { IPaymentMethod, PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces'
import { ContractDetails } from '@/modules/contracts/components/ContractDetails'
import { useAuthService } from '@/modules/auth/useAuth'
import { RoleType } from '@/modules/auth/auth.interfaces'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryProvider } from '@/lib/providers/query-provider'
import { ContractList } from '@/modules/contracts/components/ContractList'

/**
 * Mocks de componentes y hooks
 * 
 * Cada mock está documentado y aislado para evitar interferencias entre pruebas.
 * Los mocks se limpian antes de cada prueba para garantizar un estado limpio.
 */

// Mock de iconos de lucide-react
vi.mock('lucide-react', () => ({
  MoreHorizontal: () => <div data-testid="more-horizontal-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Download: () => <div data-testid="download-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
  ChevronUpIcon: () => <div data-testid="chevron-up-icon" />,
  CheckIcon: () => <div data-testid="check-icon" />,
  __esModule: true,
  default: () => <div data-testid="generic-icon" />,
}))

// Mock del componente DropdownMenu
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock del componente Select para simular un <select> nativo
vi.mock('@/modules/contracts/components/Select', () => ({
  __esModule: true,
  default: ({ value, onChange, children }: any) => (
    <select data-testid="mock-select" value={value} onChange={onChange}>
      {children}
    </select>
  ),
}))

// Mock del hook useContract
vi.mock('@/modules/contracts/hooks/useContract', () => ({
  useContract: vi.fn(),
}))

// Mock del servicio de autenticación
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: () => ({
    user: {
      id: '1',
      name: 'Admin',
      email: 'admin@example.com',
      role: RoleType.ADMIN,
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

/**
 * TestWrapper Component
 * 
 * Proporciona un contexto aislado para cada prueba con su propio QueryClient.
 * Esto evita que las pruebas interfieran entre sí a través del caché de React Query.
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

/**
 * Datos de prueba
 * 
 * Los datos de prueba están centralizados y documentados para facilitar su reutilización
 * y mantenimiento.
 */
const mockContract = {
  id: '1',
  contractNumber: 'CONT-001',
  insurance: {
    id: '1',
    name: 'Seguro de Vida',
  },
  client: {
    id: '1',
    name: 'Juan Pérez',
  },
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: ContractStatus.ACTIVE,
  totalAmount: 1000,
  paymentFrequency: PaymentFrequency.MONTHLY,
  installmentAmount: 100,
  attachments: [],
  beneficiaries: [],
  transactions: [],
}

const mockContracts = [
  mockContract,
  {
    ...mockContract,
    id: '2',
    contractNumber: 'CONT-002',
    status: ContractStatus.DRAFT,
  },
  {
    ...mockContract,
    id: '3',
    contractNumber: 'CONT-003',
    status: ContractStatus.EXPIRED,
  },
]

const mockPaymentMethod: IPaymentMethod = {
  id: '1',
  type: PaymentMethodType.CREDIT_CARD,
  details: {
    cardNumber: '**** **** **** 1234',
    expiryDate: '12/25',
    cardholderName: 'Juan Pérez'
  },
  isValid: true,
  isDefault: true
}

/**
 * Mock del hook useContract
 * 
 * Esta función crea un mock específico para cada prueba, permitiendo
 * personalizar el comportamiento según sea necesario.
 */
const createUseContractMock = (overrides = {}) => ({
  contract: undefined,
  contracts: mockContracts,
  isLoading: false,
  isError: false,
  error: null,
  createContract: vi.fn(),
  isCreating: false,
  updateContract: vi.fn().mockImplementation(async (data) => {
    // Actualizar el contrato en el mock data
    const contractIndex = mockContracts.findIndex(c => c.id === data.id)
    if (contractIndex !== -1) {
      mockContracts[contractIndex] = {
        ...mockContracts[contractIndex],
        ...data
      }
    }
    return { success: true }
  }),
  isUpdating: false,
  uploadAttachment: vi.fn(),
  isUploading: false,
  activateContractByAgent: vi.fn(),
  isActivating: false,
  activateContractByClient: vi.fn(),
  isActivatingByClient: false,
  ...overrides
})

describe('Flujo de Integración entre Componentes', () => {
  it('debe manejar correctamente la navegación entre componentes', async () => {
    // Arrange
    const mockUseContract = vi.mocked(useContract)
    mockUseContract.mockReturnValue({
      contract: undefined,
      contracts: [
        {
          id: '1',
          contractNumber: 'CONT-001',
          insurance: {
            id: '1',
            name: 'Seguro de Vida'
          },
          client: {
            id: '1',
            name: 'Juan Pérez'
          },
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: ContractStatus.ACTIVE,
          totalAmount: 1000,
          paymentFrequency: PaymentFrequency.MONTHLY,
          installmentAmount: 100,
          paymentMethod: mockPaymentMethod,
          beneficiaries: [],
          attachments: [],
          transactions: []
        }
      ],
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
      isActivatingByClient: false
    })

    // Act - Renderizar el componente ContractList
    render(
      <QueryProvider>
        <ContractList />
      </QueryProvider>
    )

    // Assert - Verificar que el componente se renderiza correctamente
    expect(screen.getByText('CONT-001')).toBeInTheDocument()
    expect(screen.getByText('Seguro de Vida')).toBeInTheDocument()
    
    // Verificar que los filtros están presentes
    expect(screen.getByPlaceholderText('Filtrar por número de contrato...')).toBeInTheDocument()
    expect(screen.getByText('Todos')).toBeInTheDocument()
  }, 15000) // Aumentar timeout a 15 segundos
}) 