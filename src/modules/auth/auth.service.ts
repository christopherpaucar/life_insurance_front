import { RegisterDto } from './auth.interfaces'
import { getHttpClient } from '@/lib/http'

const api = getHttpClient()

export const authServices = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  getUser: async () => {
    const response = await api.get('/auth/user')
    return response.data
  },

  register: async (userData: RegisterDto) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
