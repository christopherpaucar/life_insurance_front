import { vi } from 'vitest'
import { UseMutateFunction } from '@tanstack/react-query'
import { LoginDto, RegisterDto, IUser } from '@/modules/auth/auth.interfaces'

export const mockUser: IUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  onboardingCompleted: true,
  role: {
    id: '1',
    name: 'ADMINISTRADOR',
    permissions: ['manage_roles'],
  },
}

export const mockAuthService = {
  login: vi.fn() as UseMutateFunction<void, Error, LoginDto, unknown>,
  isLoggingIn: false,
  register: vi.fn() as UseMutateFunction<void, Error, RegisterDto, unknown>,
  isRegistering: false,
  logout: vi.fn() as UseMutateFunction<void, Error, void, unknown>,
  isLoggingOut: false,
  clearError: vi.fn(),
  hasPermission: vi.fn(),
  user: mockUser,
}
