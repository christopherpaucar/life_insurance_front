import { HttpClient } from '@/lib/http/http-client'
import { RegisterDto } from './auth.interfaces'

const httpClient = new HttpClient()

export const authServices = {
  login: async (email: string, password: string) => {
    const response = await httpClient.post('/auth/login', { email, password })
    return response.data
  },

  getUser: async () => {
    const response = await httpClient.get('/auth/user')
    return response.data
  },

  register: async (userData: RegisterDto) => {
    const response = await httpClient.post('/auth/register', userData)
    return response.data
  },

  logout: async () => {
    const response = await httpClient.post('/auth/logout')
    return response.data
  },
}
