import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clientsService } from '@/modules/clients/clients.service'
import { getHttpClient } from '@/lib/http'

// Mock del módulo http antes de cualquier otra cosa
vi.mock('@/lib/http', () => {
  const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    setAuthToken: vi.fn(),
    removeAuthToken: vi.fn()
  }
  return {
    getHttpClient: () => mockHttpClient
  }
})

// Obtener el mock después de que se haya creado
const mockHttpClient = getHttpClient()

describe('clientsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe obtener la lista de clientes', async () => {
    const mockClients = [{ id: '1', firstName: 'Cliente', lastName: '1' }]
    const mockResponse = { data: mockClients, meta: {} }
    mockHttpClient.get.mockResolvedValue(mockResponse)

    const result = await clientsService.getClients()
    expect(result).toEqual(mockClients)
    expect(mockHttpClient.get).toHaveBeenCalledWith('/clients', { params: undefined })
  })

  it('debe obtener un cliente por ID', async () => {
    const mockClient = { id: '1', firstName: 'Cliente', lastName: '1' }
    const mockResponse = { data: { data: mockClient } }
    mockHttpClient.get.mockResolvedValue(mockResponse)

    const result = await clientsService.getClient('1')
    expect(result).toEqual(mockClient)
    expect(mockHttpClient.get).toHaveBeenCalledWith('/clients/1')
  })

  it('debe crear un cliente', async () => {
    const newClient = { 
      firstName: 'Nuevo', 
      lastName: 'Cliente', 
      email: 'nuevo@example.com',
      phone: '123456789',
      address: 'Dirección',
      identificationNumber: '12345',
      birthDate: '2000-01-01'
    }
    const mockResponse = { data: { data: { id: '1', ...newClient } } }
    mockHttpClient.post.mockResolvedValue(mockResponse)

    const result = await clientsService.createClient(newClient)
    expect(result).toEqual({ id: '1', ...newClient })
    expect(mockHttpClient.post).toHaveBeenCalledWith('/clients', newClient)
  })

  it('debe actualizar un cliente', async () => {
    const updateData = { firstName: 'Cliente', lastName: 'Actualizado' }
    const mockResponse = { data: { data: { id: '1', ...updateData } } }
    mockHttpClient.put.mockResolvedValue(mockResponse)

    const result = await clientsService.updateClient('1', updateData)
    expect(result).toEqual({ id: '1', ...updateData })
    expect(mockHttpClient.put).toHaveBeenCalledWith('/clients/1', updateData)
  })

  it('debe eliminar un cliente', async () => {
    mockHttpClient.delete.mockResolvedValue(undefined)

    const result = await clientsService.deleteClient('1')
    expect(result).toBeUndefined()
    expect(mockHttpClient.delete).toHaveBeenCalledWith('/clients/1')
  })
})
  