import { getHttpClient } from '@/lib/http'
import { ClientQueryParams, PaginatedResponse, UpdateClientDto } from './users.interfaces'
import { RegisterDto } from '../auth/auth.interfaces'
import { IUser } from '@/modules/auth/auth.interfaces'

const httpClient = getHttpClient()

export const usersService = {
  getUsers: async (params?: ClientQueryParams): Promise<PaginatedResponse<IUser>> => {
    const response = await httpClient.get<PaginatedResponse<IUser>>('/users', { params })
    return response.data
  },

  getUser: async (id: string): Promise<IUser> => {
    const response = await httpClient.get<{ data: IUser }>(`/users/${id}`)
    return response.data.data
  },

  createUser: async (user: RegisterDto): Promise<IUser> => {
    const response = await httpClient.post<{ data: IUser }>('/auth/register/admin', user)
    return response.data.data
  },

  updateUser: async (id: string, user: UpdateClientDto): Promise<IUser> => {
    const response = await httpClient.put<{ data: IUser }>(`/users/${id}`, user)
    return response.data.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await httpClient.delete(`/users/${id}`)
  },
}
