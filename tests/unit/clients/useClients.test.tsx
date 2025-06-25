import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '@/modules/users/useUsers'
import { usersService } from '@/modules/users/users.service'
import { UpdateClientDto } from '@/modules/users/users.interfaces'
import { RegisterDto, RoleType } from '@/modules/auth/auth.interfaces'
import { ReactNode } from 'react'

// Mock del servicio de usuarios
vi.mock('@/modules/users/users.service', () => ({
  usersService: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}))

// Mock de sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock de auth store
vi.mock('@/modules/auth/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    user: { role: { name: 'ADMIN' } }
  }))
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

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('debe obtener la lista de usuarios', async () => {
    const mockUsers = [{ id: '1', firstName: 'Usuario', lastName: '1' }]
    ;(usersService.getUsers as any).mockResolvedValue({ data: mockUsers, meta: {} })

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.users).toEqual(mockUsers)
    })
  })

  it('debe crear un usuario', async () => {
    const newUser: RegisterDto = {
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      password: 'password123',
      role: RoleType.CLIENT,
    }
    ;(usersService.createUser as any).mockResolvedValue({ id: '1', ...newUser })

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.createUser(newUser)
    })

    expect(usersService.createUser).toHaveBeenCalledWith(newUser)
  })

  it('debe actualizar un usuario', async () => {
    const updateData: UpdateClientDto = { firstName: 'Usuario', lastName: 'Actualizado' }
    ;(usersService.updateUser as any).mockResolvedValue({ id: '1', ...updateData })

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.updateUser('1', updateData)
    })

    expect(usersService.updateUser).toHaveBeenCalledWith('1', updateData)
  })

  it('debe eliminar un usuario', async () => {
    ;(usersService.deleteUser as any).mockResolvedValue({ id: '1' })

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.deleteUser('1')
    })

    expect(usersService.deleteUser).toHaveBeenCalledWith('1')
  })
})
