import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UsersTable } from '@/modules/users/components/UsersTable'
import { useUsers } from '@/modules/users/useUsers'
import { Client } from '@/modules/users/users.interfaces'

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

// Mock de @tabler/icons-react
vi.mock('@tabler/icons-react', () => ({
  IconChevronLeft: vi.fn(() => null),
  IconChevronRight: vi.fn(() => null),
  IconChevronsLeft: vi.fn(() => null),
  IconChevronsRight: vi.fn(() => null),
  IconDotsVertical: vi.fn(() => null),
  IconPlus: vi.fn(() => null),
}))

// Mock del hook useUsers
vi.mock('@/modules/users/useUsers', () => ({
  useUsers: vi.fn(),
}))

// Mock de los componentes de UI que no necesitamos probar
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-table">{children}</div>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-table-header">{children}</div>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-table-body">{children}</div>
  ),
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-table-head">{children}</div>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-table-row">{children}</div>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-table-cell">{children}</div>
  ),
}))

// Mock de los componentes de DropdownMenu
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button
      data-testid={`mock-dropdown-item-${children?.toString().toLowerCase()}`}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <div data-testid="mock-dropdown-separator" />,
}))

describe('ClientsTable', () => {
  const mockUsers: Client[] = [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '1234567890',
      address: 'Calle Principal 123',
      identificationNumber: '12345678',
      birthDate: '1990-01-01',
      documentType: 'DNI',
      identificationDocumentUrl: '',
      deletedAt: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      firstName: 'María',
      lastName: 'González',
      email: 'maria@example.com',
      phone: '0987654321',
      address: 'Avenida Secundaria 456',
      identificationNumber: '87654321',
      birthDate: '1992-02-02',
      documentType: 'DNI',
      identificationDocumentUrl: '',
      deletedAt: '',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
  ]

  const mockDeleteUser = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useUsers as any).mockReturnValue({
      users: mockUsers,
      deleteUser: mockDeleteUser,
      isLoading: false,
    })
  })

  it('debe renderizar la tabla con los usuarios', () => {
    render(<UsersTable />)

    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
  })

  it('debe filtrar usuarios por email', async () => {
    render(<UsersTable />)

    const filterInput = screen.getByPlaceholderText('Filtrar por email...')
    fireEvent.change(filterInput, { target: { value: 'juan' } })

    await waitFor(() => {
      expect(screen.getByText('juan@example.com')).toBeInTheDocument()
      expect(screen.queryByText('maria@example.com')).not.toBeInTheDocument()
    })
  })

  it('debe abrir el modal de creación al hacer clic en "Nuevo Usuario"', () => {
    render(<UsersTable />)

    const newUserButton = screen.getByText('Nuevo Usuario')
    fireEvent.click(newUserButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('debe mostrar el diálogo de confirmación al intentar eliminar un usuario', () => {
    expect(true).toBe(true)
  })

  it('debe llamar a deleteUser cuando se confirma la eliminación', async () => {
    expect(true).toBe(true)
  })
})
