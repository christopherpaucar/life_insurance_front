import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authServices } from '@/modules/auth/auth.service'
import { HttpClient } from '@/lib/http/http-client'
import { IAuthResponse, IUser, RegisterDto, RoleType } from '@/modules/auth/auth.interfaces'
import { HttpResponse } from '@/lib/http/types'

// Mock del HttpClient
vi.mock('@/lib/http/http-client', () => {
  const mockHttpClient = {
    post: vi.fn(),
    get: vi.fn()
  }
  return {
    HttpClient: vi.fn().mockImplementation(() => mockHttpClient)
  }
})

describe('AuthService', () => {
  let mockHttpClient: HttpClient

  beforeEach(() => {
    vi.clearAllMocks()
    mockHttpClient = new HttpClient()
  })

  describe('login', () => {
    it('debería hacer login exitosamente', async () => {
      const mockUser: IUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roles: []
      }
      const mockResponse: HttpResponse<IAuthResponse> = {
        data: { token: 'test-token', user: mockUser },
        status: 200,
        headers: {}
      }
      vi.mocked(mockHttpClient.post).mockResolvedValueOnce(mockResponse)

      const result = await authServices.login('test@example.com', 'password123')
      
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getUser', () => {
    it('debería obtener el usuario actual', async () => {
      const mockUser: IUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roles: []
      }
      const mockResponse: HttpResponse<IUser> = {
        data: mockUser,
        status: 200,
        headers: {}
      }
      vi.mocked(mockHttpClient.get).mockResolvedValueOnce(mockResponse)

      const result = await authServices.getUser()
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/auth/user')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const userData: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: RoleType.CLIENT
      }
      const mockUser: IUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        roles: []
      }
      const mockResponse: HttpResponse<IUser> = {
        data: mockUser,
        status: 200,
        headers: {}
      }
      vi.mocked(mockHttpClient.post).mockResolvedValueOnce(mockResponse)

      const result = await authServices.register(userData)
      
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('logout', () => {
    it('debería cerrar sesión exitosamente', async () => {
      const mockResponse: HttpResponse<{ success: boolean }> = {
        data: { success: true },
        status: 200,
        headers: {}
      }
      vi.mocked(mockHttpClient.post).mockResolvedValueOnce(mockResponse)

      const result = await authServices.logout()
      
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/logout')
      expect(result).toEqual(mockResponse.data)
    })
  })
}) 