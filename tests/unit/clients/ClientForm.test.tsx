import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ClientFormModal } from '@/modules/clients/components/ClientFormModal'
import { useClients } from '@/modules/clients/useClients'
import { toast } from 'sonner'
import { Client } from '@/modules/clients/clients.interfaces'

// Mock de useClients
vi.mock('@/modules/clients/useClients', () => ({
  useClients: vi.fn()
}))

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}))

describe('ClientFormModal', () => {
  const mockOnClose = vi.fn()
  let mockCreateClient: any;
  let mockUpdateClient: any;

  const mockClient: Client = {
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
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateClient = vi.fn().mockImplementation((data, options) => {
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess();
      }
      return Promise.resolve({});
    });
    mockUpdateClient = vi.fn().mockImplementation((id, data, options) => {
      if (typeof options === 'object' && options && typeof options.onSuccess === 'function') {
        options.onSuccess();
      }
      return Promise.resolve({});
    });
    (useClients as any).mockReturnValue({
      createClient: mockCreateClient,
      updateClient: mockUpdateClient,
      isCreating: false,
      isUpdating: false
    });
  });

  it('debe renderizar el formulario en modo creación', () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" client={null} />)
    
    expect(screen.getByText('Nuevo Cliente')).toBeInTheDocument()
    expect(screen.getByText('Complete el formulario para crear un nuevo cliente')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument()
    expect(screen.getByLabelText('Número de Documento')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de Nacimiento')).toBeInTheDocument()
  })

  it('debe renderizar el formulario en modo edición con los datos del cliente', () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="edit" client={mockClient} />)
    
    expect(screen.getByText('Editar Cliente')).toBeInTheDocument()
    expect(screen.getByText('Modifique la información del cliente')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue(mockClient.firstName)
    expect(screen.getByLabelText('Apellido')).toHaveValue(mockClient.lastName)
    expect(screen.getByLabelText('Email')).toHaveValue(mockClient.email)
    expect(screen.getByLabelText('Teléfono')).toHaveValue(mockClient.phone)
    expect(screen.getByLabelText('Dirección')).toHaveValue(mockClient.address)
    expect(screen.getByLabelText('Número de Documento')).toHaveValue(mockClient.identificationNumber)
    expect(screen.getByLabelText('Fecha de Nacimiento')).toHaveValue(mockClient.birthDate)
  })

  it('debe validar los campos requeridos al crear un cliente', async () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" client={null} />)
    
    const submitButton = screen.getByRole('button', { name: 'Crear' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
      expect(screen.getByText('El apellido debe tener al menos 2 caracteres')).toBeInTheDocument()
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
      expect(screen.getByText('El teléfono debe tener al menos 7 caracteres')).toBeInTheDocument()
      expect(screen.getByText('La dirección debe tener al menos 5 caracteres')).toBeInTheDocument()
      expect(screen.getByText('El número de documento debe tener al menos 5 caracteres')).toBeInTheDocument()
      expect(screen.getByText('Debe seleccionar una fecha de nacimiento')).toBeInTheDocument()
    })
  })

  it('debe crear un cliente exitosamente', async () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" client={null} />)
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Pérez' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '1234567890' } })
    fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle Principal 123' } })
    fireEvent.change(screen.getByLabelText('Número de Documento'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Fecha de Nacimiento'), { target: { value: '1990-01-01' } })

    const submitButton = screen.getByRole('button', { name: 'Crear' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalledWith({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '1234567890',
        address: 'Calle Principal 123',
        identificationNumber: '12345678',
        birthDate: '1990-01-01'
      }, expect.any(Object))
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('debe actualizar un cliente exitosamente', async () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="edit" client={mockClient} />)
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan Actualizado' } })
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Pérez Modificado' } })
    
    const submitButton = screen.getByRole('button', { name: 'Guardar' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalledWith(mockClient.id, {
        firstName: 'Juan Actualizado',
        lastName: 'Pérez Modificado'
      }, expect.any(Object))
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('debe mostrar mensaje cuando no hay cambios al editar', async () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="edit" client={mockClient} />)
    
    const submitButton = screen.getByRole('button', { name: 'Guardar' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('No se detectaron cambios')
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('debe cerrar el modal al hacer clic en cancelar', () => {
    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" client={null} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('debe mostrar estado de carga durante la creación', () => {
    ;(useClients as any).mockReturnValue({
      createClient: mockCreateClient,
      updateClient: mockUpdateClient,
      isCreating: true,
      isUpdating: false
    })

    render(<ClientFormModal open={true} onClose={mockOnClose} mode="create" client={null} />)
    
    expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled()
  })

  it('debe mostrar estado de carga durante la actualización', () => {
    ;(useClients as any).mockReturnValue({
      createClient: mockCreateClient,
      updateClient: mockUpdateClient,
      isCreating: false,
      isUpdating: true
    })

    render(<ClientFormModal open={true} onClose={mockOnClose} mode="edit" client={mockClient} />)
    
    expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled()
  })
}) 