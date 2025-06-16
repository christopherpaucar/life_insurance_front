// Mocks primero
vi.mock('@/modules/contracts/hooks/useContract')
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={className}>{children}</span>
  ),
}))
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
}))
vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-value={value}>{children}</div>
  ),
}))
vi.mock('@tabler/icons-react', () => ({
  IconChevronLeft: () => <span>IconChevronLeft</span>,
  IconChevronRight: () => <span>IconChevronRight</span>,
  IconChevronsLeft: () => <span>IconChevronsLeft</span>,
  IconChevronsRight: () => <span>IconChevronsRight</span>,
}))
vi.mock('date-fns', () => ({
  format: () => '1 de enero de 2024',
}))
vi.mock('@/lib/utils/enum.utils', () => ({
  getEnumLabel: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
}))
vi.mock('@/modules/contracts/constants/contractStatus', () => ({
  statusColors: {
    active: 'bg-green-500',
    awaiting_client_confirmation: 'bg-yellow-500',
    expired: 'bg-red-500',
    cancelled: 'bg-gray-500',
    draft: 'bg-gray-500',
    pending_basic_documents: 'bg-blue-500',
    inactive: 'bg-gray-500',
  },
  statusLabels: {
    active: 'Activo',
    awaiting_client_confirmation: 'Pendiente de confirmación',
    expired: 'Vencido',
    cancelled: 'Cancelado',
    draft: 'Borrador',
    pending_basic_documents: 'Pendiente de documentos básicos',
    inactive: 'Inactivo',
  },
}))

// Importaciones después
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import { ContractList } from '@/modules/contracts/components/ContractList'
import { useContract } from '@/modules/contracts/hooks/useContract'
import { ContractStatus, PaymentFrequency, AttachmentType, TransactionStatus } from '@/modules/contracts/contract.interfaces'
import { vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { useAuthService } from '@/modules/auth/useAuth'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

// Mock de useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: () => ({
    user: { role: 'AGENT' },
    isAgent: true,
    isClient: false,
    login: vi.fn(),
    isLoggingIn: false,
    logout: vi.fn(),
    isLoggingOut: false,
  }),
}))

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  BarChart3: () => <span>BarChart3</span>,
  FileText: () => <span>FileText</span>,
  CreditCard: () => <span>CreditCard</span>,
  FileSpreadsheet: () => <span>FileSpreadsheet</span>,
  ArrowLeft: () => <span>ArrowLeft</span>,
  MoreVertical: () => <span>MoreVertical</span>,
  MoreHorizontal: () => <span>MoreHorizontal</span>,
  Download: () => <span>Download</span>,
  Edit: () => <span>Edit</span>,
  Trash2: () => <span>Trash2</span>,
  Check: () => <span>Check</span>,
  X: () => <span>X</span>,
  AlertCircle: () => <span>AlertCircle</span>,
  ChevronLeft: () => <span>ChevronLeft</span>,
  ChevronRight: () => <span>ChevronRight</span>,
  Search: () => <span>Search</span>,
}))

describe('ContractList Component', () => {
  const mockContract = {
    id: '1',
    contractNumber: 'CONTRACT-001',
    status: ContractStatus.ACTIVE,
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    totalAmount: 1000,
    paymentFrequency: PaymentFrequency.MONTHLY,
    installmentAmount: 100,
    signatureUrl: 'https://example.com/signature.pdf',
    attachments: [],
    notes: '',
    insurance: {
      id: '1',
      name: 'Seguro de Vida',
    },
    client: {
      id: '1',
      name: 'Cliente Test',
    },
    beneficiaries: [],
    transactions: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display contract list', async () => {
    // Mock del hook useContract con fechas diferentes
    const mockContractWithDates = {
      ...mockContract,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: ContractStatus.DRAFT
    }

    vi.mocked(useContract).mockReturnValue({
      contract: undefined,
      contracts: [mockContractWithDates],
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
    })

    render(<ContractList />)

    // Verificamos que se muestra la información del contrato
    expect(screen.getByText('CONTRACT-001')).toBeInTheDocument()
    expect(screen.getByText('Seguro de Vida')).toBeInTheDocument()
    
    // Encontramos la tabla y verificamos las fechas dentro de ella
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const dataRow = rows[1] // La primera fila es el encabezado
    const cells = within(dataRow).getAllByRole('cell')

    // Verificamos las fechas en las celdas específicas
    const startDate = format(new Date('2024-01-01'), 'd MMMM yyyy', { locale: es })
    const endDate = format(new Date('2024-12-31'), 'd MMMM yyyy', { locale: es })

    // Verificamos que las celdas contienen las fechas correctas
    expect(cells[2]).toHaveTextContent(startDate) // Fecha de inicio
    expect(cells[3]).toHaveTextContent(endDate) // Fecha de fin
    
    // Verificamos el estado en la celda correcta
    expect(cells[4]).toHaveTextContent('Borrador')
  })

  it('should show loading state', () => {
    // Mock del hook useContract con estado de carga
    vi.mocked(useContract).mockReturnValue({
      contract: undefined,
      contracts: [],
      isLoading: true,
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
    })

    render(<ContractList />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show empty state', async () => {
    // Mock del hook useContract con lista vacía
    vi.mocked(useContract).mockReturnValue({
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
    })

    render(<ContractList />)

    // Verificamos que se muestra la tabla y el mensaje de no hay contratos
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('No hay contratos.')).toBeInTheDocument()
    })
  })

  it('should filter contracts by contract number', async () => {
    // Mock del hook useContract con múltiples contratos
    vi.mocked(useContract).mockReturnValue({
      contract: undefined,
      contracts: [
        mockContract,
        { ...mockContract, id: '2', contractNumber: 'CONTRACT-002' },
        { ...mockContract, id: '3', contractNumber: 'CONTRACT-003' },
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
      isActivatingByClient: false,
    })

    render(<ContractList />)

    // Simulamos la escritura en el input de filtro
    const filterInput = screen.getByPlaceholderText('Filtrar por número de contrato...')
    fireEvent.change(filterInput, { target: { value: 'CONTRACT-001' } })

    // Verificamos que solo se muestre el contrato filtrado
    await waitFor(() => {
      expect(screen.getByText('CONTRACT-001')).toBeInTheDocument()
      expect(screen.queryByText('CONTRACT-002')).not.toBeInTheDocument()
      expect(screen.queryByText('CONTRACT-003')).not.toBeInTheDocument()
    })
  })

  it('should paginate contracts correctly', async () => {
    // Mock del hook useContract con múltiples contratos (15 contratos para tener 2 páginas)
    const mockContracts = Array.from({ length: 15 }, (_, index) => ({
      ...mockContract,
      id: String(index + 1),
      contractNumber: `CONTRACT-${String(index + 1).padStart(3, '0')}`,
    }))

    vi.mocked(useContract).mockReturnValue({
      contract: undefined,
      contracts: mockContracts,
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
    })

    render(<ContractList />)

    // Verificamos que se muestren los primeros 10 contratos (primera página)
    await waitFor(() => {
      expect(screen.getByText('CONTRACT-001')).toBeInTheDocument()
      expect(screen.getByText('CONTRACT-010')).toBeInTheDocument()
      expect(screen.queryByText('CONTRACT-011')).not.toBeInTheDocument()
    })

    // Simulamos el clic en el botón de siguiente página usando el ícono
    const nextPageButton = screen.getByRole('button', { name: 'IconChevronRight' })
    fireEvent.click(nextPageButton)

    // Verificamos que se muestren los contratos de la segunda página
    await waitFor(() => {
      expect(screen.getByText('CONTRACT-011')).toBeInTheDocument()
      expect(screen.getByText('CONTRACT-015')).toBeInTheDocument()
      expect(screen.queryByText('CONTRACT-001')).not.toBeInTheDocument()
    })
  })

  it('should handle button interactions correctly', async () => {
    // Mock del hook useContract con un contrato en estado draft
    vi.mocked(useContract).mockReturnValue({
      contract: undefined,
      contracts: [{
        ...mockContract,
        status: ContractStatus.DRAFT
      }],
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
    })

    render(<ContractList />)

    // Encontrar el primer botón de menú
    const menuButton = screen.getAllByRole('button', { name: /abrir menú/i })[0]
    await userEvent.click(menuButton)

    // Verificar que los elementos del menú están presentes
    await waitFor(() => {
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems).toHaveLength(4)
      expect(menuItems[0]).toHaveTextContent('Ver detalles')
      expect(menuItems[1]).toHaveTextContent('Descargar')
      expect(menuItems[2]).toHaveTextContent('Editar')
      expect(menuItems[3]).toHaveTextContent('Eliminar')
    })
  })

  it('should handle download functionality', async () => {
    const mockContracts = [{
      ...mockContract,
      signatureUrl: 'https://example.com/contract.pdf',
      status: ContractStatus.DRAFT
    }]
    const mockWindowOpen = vi.fn()
    window.open = mockWindowOpen

    vi.mocked(useContract).mockReturnValue({
      contract: undefined,
      contracts: mockContracts,
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
    })

    render(<ContractList />)

    // Encontrar el primer botón de menú
    const menuButton = screen.getAllByRole('button', { name: /abrir menú/i })[0]
    await userEvent.click(menuButton)

    // Hacer clic en el botón de descargar
    await waitFor(async () => {
      const menuItems = screen.getAllByRole('menuitem')
      await userEvent.click(menuItems[1]) // El segundo elemento es "Descargar"
    })

    // Verificar que se abrió la URL correcta
    expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com/contract.pdf', '_blank')
  })
}) 

///FUNCIONANDO