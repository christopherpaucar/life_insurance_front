import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClients } from '@/modules/users/useUsers'
import { clientsService } from '@/modules/users/users.service'
import { CreateClientDto, UpdateClientDto } from '@/modules/users/users.interfaces'
import { ReactNode } from 'react'

// Mock del servicio de clientes
vi.mock('@/modules/clients/clients.service', () => ({
  clientsService: {
    getClients: vi.fn(),
    createClient: vi.fn(),
    updateClient: vi.fn(),
    deleteClient: vi.fn(),
  },
}))

// Crear un QueryClient para las pruebas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Crear wrapper con QueryClientProvider
const createWrapper = () => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useClients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('debe obtener la lista de clientes', async () => {
    const mockClients = [{ id: '1', firstName: 'Cliente', lastName: '1' }]
    ;(clientsService.getClients as any).mockResolvedValue({ data: mockClients, meta: {} })

    const { result } = renderHook(() => useClients(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.clients).toEqual(mockClients)
    })
  })

  it('debe crear un cliente', async () => {
    const newClient: CreateClientDto = {
      firstName: 'Nuevo',
      lastName: 'Cliente',
      email: 'nuevo@example.com',
      phone: '123456789',
      address: 'Dirección',
      identificationNumber: '12345',
      birthDate: '2000-01-01',
    }
    ;(clientsService.createClient as any).mockResolvedValue({ id: '1', ...newClient })

    const { result } = renderHook(() => useClients(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.createClient(newClient)
    })

    expect(clientsService.createClient).toHaveBeenCalledWith(newClient)
  })

  it('debe actualizar un cliente', async () => {
    const updateData: UpdateClientDto = { firstName: 'Cliente', lastName: 'Actualizado' }
    ;(clientsService.updateClient as any).mockResolvedValue({ id: '1', ...updateData })

    const { result } = renderHook(() => useClients(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.updateClient('1', updateData)
    })

    expect(clientsService.updateClient).toHaveBeenCalledWith('1', updateData)
  })

  it('debe eliminar un cliente', async () => {
    ;(clientsService.deleteClient as any).mockResolvedValue({ id: '1' })

    const { result } = renderHook(() => useClients(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.deleteClient('1')
    })

    expect(clientsService.deleteClient).toHaveBeenCalledWith('1')
  })
})
