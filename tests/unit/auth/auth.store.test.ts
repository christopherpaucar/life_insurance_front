import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '@/modules/auth/auth.store'
import { authServices } from '@/modules/auth/auth.service'
import { Permission } from '@/modules/auth/auth.interfaces'

// Mock de authServices
vi.mock('@/modules/auth/auth.service', () => ({
  authServices: {
    login: vi.fn(),
    register: vi.fn()
  }
}))

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

// Sobrescribir métodos de localStorage en lugar de redefinir la propiedad
Object.defineProperty(window, 'localStorage', {
  get: () => localStorageMock
})

describe('auth.store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false
    })
  })

  it('debe tener un estado inicial correcto', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.hydrated).toBe(false)
  })

  it('debe manejar el login correctamente', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roles: [
        {
          id: 'role1',
          name: 'Admin',
          permissions: [Permission.MANAGE_ROLES]
        }
      ]
    }
    const mockToken = 'mock-token'
    const mockResponse = { data: { user: mockUser, token: mockToken } }

    vi.mocked(authServices.login).mockResolvedValue(mockResponse)

    await useAuthStore.getState().login({ email: 'test@example.com', password: 'password' })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('debe manejar errores de login', async () => {
    const errorMessage = 'Invalid credentials'
    vi.mocked(authServices.login).mockRejectedValue(new Error(errorMessage))

    await useAuthStore.getState().login({ email: 'test@example.com', password: 'wrong-password' })

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe(errorMessage)
  })

  it('debe manejar el registro correctamente', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roles: [
        {
          id: 'role1',
          name: 'Client',
          permissions: [Permission.VIEW_PAYMENT_HISTORY]
        }
      ]
    }
    const mockToken = 'mock-token'
    const mockResponse = { data: { user: mockUser, token: mockToken } }

    vi.mocked(authServices.register).mockResolvedValue(mockResponse)

    await useAuthStore.getState().register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'CLIENT'
    })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('debe manejar errores de registro', async () => {
    const errorMessage = 'Email already exists'
    vi.mocked(authServices.register).mockRejectedValue(new Error(errorMessage))

    await useAuthStore.getState().register({
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password',
      role: 'CLIENT'
    })

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe(errorMessage)
  })

  it('debe manejar el logout correctamente', () => {
    // Primero establecemos un estado autenticado
    useAuthStore.setState({
      user: { id: '1', name: 'Test User', email: 'test@example.com', roles: [] },
      token: 'mock-token',
      isAuthenticated: true
    })

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('debe limpiar errores correctamente', () => {
    useAuthStore.setState({ error: 'Some error' })
    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('debe inicializar la autenticación correctamente', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com', roles: [] }
    const mockToken = 'mock-token'

    useAuthStore.setState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: false,
      hydrated: false
    })

    useAuthStore.getState().initializeAuth()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.hydrated).toBe(true)
  })
}) 