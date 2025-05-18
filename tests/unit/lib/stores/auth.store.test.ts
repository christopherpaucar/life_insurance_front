import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from '../../../../src/modules/auth/auth.store'
import { HttpClient } from '../../../../src/lib/http/http-client'

// Mock the HttpClient
vi.mock('../../../../src/lib/http/http-client', () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({
      post: vi.fn(),
      setAuthToken: vi.fn(),
      removeAuthToken: vi.fn(),
    })),
  }
})

// Mock localStorage
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
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Auth Store', () => {
  let mockHttpClient: { post: any; setAuthToken: any; removeAuthToken: any }

  beforeEach(() => {
    mockHttpClient = new HttpClient() as any
    vi.clearAllMocks()
    useAuthStore.getState().logout()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  it('should initialize with default values', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should handle login success', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token',
      },
    }

    mockHttpClient.post.mockResolvedValueOnce(mockResponse)

    await useAuthStore.getState().login({ email: 'test@example.com', password: 'password' })

    expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password',
    })
    expect(mockHttpClient.setAuthToken).toHaveBeenCalledWith('mock-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token')

    const state = useAuthStore.getState()
    expect(state.user).toEqual({ id: '1', email: 'test@example.com' })
    expect(state.token).toBe('mock-token')
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should handle login failure', async () => {
    const mockError = new Error('Authentication failed')
    mockHttpClient.post.mockRejectedValueOnce(mockError)

    await useAuthStore.getState().login({ email: 'test@example.com', password: 'wrong' })

    const state = useAuthStore.getState()
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe('Authentication failed')
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('should handle register success', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', email: 'new@example.com', name: 'New User' },
        token: 'mock-token',
      },
    }

    mockHttpClient.post.mockResolvedValueOnce(mockResponse)

    await useAuthStore.getState().register({
      email: 'new@example.com',
      password: 'password',
      name: 'New User',
    })

    expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/register', {
      email: 'new@example.com',
      password: 'password',
      name: 'New User',
    })
    expect(mockHttpClient.setAuthToken).toHaveBeenCalledWith('mock-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token')

    const state = useAuthStore.getState()
    expect(state.user).toEqual({
      id: '1',
      email: 'new@example.com',
      name: 'New User',
    })
    expect(state.token).toBe('mock-token')
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should handle logout', () => {
    // Set initial authenticated state
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com' },
      token: 'mock-token',
      isAuthenticated: true,
    })

    useAuthStore.getState().logout()

    expect(mockHttpClient.removeAuthToken).toHaveBeenCalled()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should clear error', () => {
    useAuthStore.setState({ error: 'Some error' })
    expect(useAuthStore.getState().error).toBe('Some error')

    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })
})
