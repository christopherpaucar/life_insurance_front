import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersTable } from '../../../src/modules/users/components/UsersTable'
import { useUsers } from '../../../src/modules/users/useUsers'
import { RoleType } from '@/modules/auth/auth.interfaces'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  XIcon: () => <span>X</span>,
  Eye: () => <span>Eye</span>,
  EyeOff: () => <span>EyeOff</span>,
  ChevronDownIcon: () => <span>ChevronDownIcon</span>,
  ChevronUpIcon: () => <span>ChevronUpIcon</span>,
  CheckIcon: () => <span>CheckIcon</span>,
}))

vi.mock('../../../src/modules/users/useUsers', () => {
  return {
    useUsers: vi.fn()
  }
})

const mockUseUsers = useUsers as jest.Mock

describe('Client Management Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Configuración inicial del mock
    mockUseUsers.mockReturnValue({
      users: [
        { id: 1, email: 'juan@example.com', role: 'Cliente', status: 'Activo' },
        { id: 2, email: 'maria@example.com', role: 'Cliente', status: 'Activo' }
      ],
      isLoading: false,
      error: null,
      createUser: vi.fn().mockResolvedValue({}),
      updateUser: vi.fn().mockResolvedValue({}),
      deleteUser: vi.fn().mockResolvedValue({}),
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 }
    })
  })

  it('should display client list', async () => {
    render(<UsersTable />)
    await waitFor(() => {
      expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    })
  })

  it('should open add client form', async () => {
    render(<UsersTable />)
    const addButton = await screen.findByRole('button', { name: /nuevo usuario/i })
    await userEvent.click(addButton)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('should delete client', async () => {
    const deleteUser = vi.fn()
    mockUseUsers.mockReturnValue({
      ...mockUseUsers(),
      deleteUser
    })
    render(<UsersTable />)
    const menuButtons = await screen.findAllByRole('button', { name: /abrir menu/i })
    await userEvent.click(menuButtons[0])
    const deleteButton = await screen.findByRole('menuitem', { name: /eliminar/i })
    await userEvent.click(deleteButton)
    const confirmButton = await screen.findByRole('button', { name: /eliminar/i })
    await userEvent.click(confirmButton)
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1)
    })
  })

  it('should filter clients by email', async () => {
    render(<UsersTable />)
    const filterInput = await screen.findByPlaceholderText(/filtrar por email/i)
    await userEvent.type(filterInput, 'juan')
    await waitFor(() => {
      const emailElement = screen.getByText('juan@example.com')
      expect(emailElement).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should handle loading state', async () => {
    mockUseUsers.mockReturnValue({
      ...mockUseUsers(),
      isLoading: true,
      users: []
    })
    render(<UsersTable />)
    await waitFor(() => {
      expect(screen.getByText('No hay resultados.')).toBeInTheDocument()
    })
  })

  it('should handle error state', async () => {
    mockUseUsers.mockReturnValue({
      ...mockUseUsers(),
      isError: true,
      error: new Error('Error al cargar usuarios'),
      users: []
    })
    render(<UsersTable />)
    await waitFor(() => {
      expect(screen.getByText('No hay resultados.')).toBeInTheDocument()
    })
  })

  it('should handle empty client list', async () => {
    mockUseUsers.mockReturnValue({
      ...mockUseUsers(),
      users: []
    })
    render(<UsersTable />)
    await waitFor(() => {
      expect(screen.getByText('No hay resultados.')).toBeInTheDocument()
    })
  })
}) 