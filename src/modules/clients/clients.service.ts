import { getHttpClient } from '@/lib/http'
import { CreateClientDto, ClientQueryParams, PaginatedResponse, Client, UpdateClientDto } from './clients.interfaces'

const httpClient = getHttpClient()

export const clientsService = {
  getClients: async (params?: ClientQueryParams): Promise<PaginatedResponse<Client>> => {
    const response = await httpClient.get<PaginatedResponse<Client>>('/clients', { params })
    return response.data
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await httpClient.get<{ data: Client }>(`/clients/${id}`)
    return response.data.data
  },

  createClient: async (client: CreateClientDto): Promise<Client> => {
    const response = await httpClient.post<{ data: Client }>('/clients', client)
    return response.data.data
  },

  updateClient: async (id: string, client: UpdateClientDto): Promise<Client> => {
    const response = await httpClient.put<{ data: Client }>(`/clients/${id}`, client)
    return response.data.data
  },

  deleteClient: async (id: string): Promise<void> => {
    await httpClient.delete(`/clients/${id}`)
  },

  linkUserAccount: async (id: string, userId: string): Promise<Client> => {
    const response = await httpClient.post<{ data: Client }>(`/clients/${id}/link-user/${userId}`)
    return response.data.data
  },

  unlinkUserAccount: async (id: string): Promise<Client> => {
    const response = await httpClient.post<{ data: Client }>(`/clients/${id}/unlink-user`)
    return response.data.data
  },
}
