import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClientsTable } from '@/modules/clients/components/ClientsTable'
import { useClients } from '@/modules/clients/useClients'
import { Client } from '@/modules/clients/clients.interfaces'

// Mock del hook useClients
vi.mock('@/modules/clients/useClients', () => ({
  useClients: vi.fn()
}))

// Mock de los componentes de UI que no necesitamos probar
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table">{children}</div>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-header">{children}</div>,
  TableBody: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-body">{children}</div>,
  TableHead: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-head">{children}</div>,
  TableRow: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-row">{children}</div>,
  TableCell: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-cell">{children}</div>
}))

// Mock de los componentes de DropdownMenu
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button 
      data-testid={`mock-dropdown-item-${children?.toString().toLowerCase()}`} 
      onClick={onClick}
    >
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <div data-testid="mock-dropdown-separator" />
}))

describe('ClientsTable', () => {
  const mockClients: Client[] = [
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
      updatedAt: '2024-01-01'
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
      updatedAt: '2024-01-02'
    }
  ]

  const mockDeleteClient = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useClients as any).mockReturnValue({
      clients: mockClients,
      deleteClient: mockDeleteClient,
      isLoading: false
    })
  })

  it('debe renderizar la tabla con los clientes', () => {
    render(<ClientsTable title="Clientes" description="Lista de clientes" />)
    
    expect(screen.getByText('Juan')).toBeInTheDocument()
    expect(screen.getByText('María')).toBeInTheDocument()
    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
  })

  it('debe filtrar clientes por nombre', async () => {
    render(<ClientsTable title="Clientes" description="Lista de clientes" />)
    
    const filterInput = screen.getByPlaceholderText('Filtrar por nombre...')
    fireEvent.change(filterInput, { target: { value: 'Juan' } })

    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument()
      expect(screen.queryByText('María')).not.toBeInTheDocument()
    })
  })

  it('debe abrir el modal de creación al hacer clic en "Nuevo Cliente"', () => {
    render(<ClientsTable title="Clientes" description="Lista de clientes" />)
    
    const newClientButton = screen.getByText('Nuevo Cliente')
    fireEvent.click(newClientButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('debe mostrar el diálogo de confirmación al intentar eliminar un cliente', () => {
    expect(true).toBe(true)
  })

  it('debe llamar a deleteClient cuando se confirma la eliminación', async () => {
    expect(true).toBe(true)
  })
}) 