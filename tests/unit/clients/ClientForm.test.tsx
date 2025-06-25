import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ClientFormModal } from '@/modules/users/components/UsersFormModal'
import { useUsers } from '@/modules/users/useUsers'
import { toast } from 'sonner'
import { IUser, RoleType } from '@/modules/auth/auth.interfaces'

// Mock de todos los componentes UI
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, type, disabled }: any) => (
    <button onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, name, id, type }: any) => (
    <input value={value} onChange={onChange} name={name} id={id} type={type} />
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div>
      <button onClick={() => onValueChange('CLIENT')}>Select Role</button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectItem: ({ value, children }: any) => <div>{children}</div>,
}))

// Mock de useUsers
vi.mock('@/modules/users/useUsers', () => ({
  useUsers: vi.fn(),
}))

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('ClientFormModal', () => {
  const mockOnClose = vi.fn()
  let mockCreateUser: any
  let mockUpdateUser: any

  const mockUser: IUser = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: { 
      id: '1',
      name: RoleType.CLIENT,
      permissions: []
    },
    onboardingCompleted: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockCreateUser = vi.fn().mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess()
      }
      return Promise.resolve({})
    })
    
    mockUpdateUser = vi.fn().mockImplementation((id, data, options) => {
      if (options?.onSuccess) {
        options.onSuccess()
      }
      return Promise.resolve({})
    })
    
    ;(useUsers as any).mockReturnValue({
      createUser: mockCreateUser,
      updateUser: mockUpdateUser,
      isCreating: false,
      isUpdating: false,
    })
  })

  it('debe renderizar el formulario en modo creación', () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" user={null} />)
    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
  })

  it('debe renderizar el formulario en modo edición', () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="edit" user={mockUser} />)
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument()
  })

  it('debe crear un usuario exitosamente', async () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" user={null} />)

    // Llenar formulario usando selectores específicos
    const nameInput = screen.getByLabelText('Nombre')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Contraseña')
    
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    // Seleccionar rol
    fireEvent.click(screen.getByText('Select Role'))

    // Enviar formulario
    fireEvent.click(screen.getByText('Crear'))

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('debe actualizar un usuario exitosamente', async () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="edit" user={mockUser} />)

    // Cambiar nombre usando selector específico
    const nameInput = screen.getByLabelText('Nombre')
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez Actualizado' } })

    // Llenar contraseña para pasar validación
    const passwordInput = screen.getByLabelText('Contraseña')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Enviar formulario
    fireEvent.click(screen.getByText('Guardar'))

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('debe cerrar el modal al hacer clic en cancelar', () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" user={null} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('debe mostrar estado de carga durante la creación', () => {
    ;(useUsers as any).mockReturnValue({
      createUser: mockCreateUser,
      updateUser: mockUpdateUser,
      isCreating: true,
      isUpdating: false,
    })

    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" user={null} />)
    expect(screen.getByText('Guardando...')).toBeInTheDocument()
  })
})
