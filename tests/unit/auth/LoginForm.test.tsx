import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/modules/auth/components/login-form'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthService } from '@/modules/auth/useAuth'
import { IUser } from '@/modules/auth/auth.interfaces'

// Mock del hook useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn()
}))

// Mock del hook useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('LoginForm Component', () => {
  const mockUser: IUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    roles: []
  }

  const defaultMockAuthService = {
    login: vi.fn(),
    isLoggingIn: false,
    register: vi.fn(),
    isRegistering: false,
    logout: vi.fn(),
    isLoggingOut: false,
    user: mockUser,
    isAuthenticated: true,
    error: null,
    clearError: vi.fn(),
    hasPermission: vi.fn()
  }

  beforeEach(() => {
    vi.mocked(useAuthService).mockReturnValue(defaultMockAuthService)
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const mockLogin = vi.fn()
    vi.mocked(useAuthService).mockReturnValue({
      ...defaultMockAuthService,
      login: mockLogin
    })

    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(mockLogin).toHaveBeenCalledWith(
      {
        email: 'test@example.com',
        password: 'password123'
      },
      expect.any(Object)
    )
  })

  it('shows loading state when submitting', () => {
    vi.mocked(useAuthService).mockReturnValue({
      ...defaultMockAuthService,
      isLoggingIn: true
    })

    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeInTheDocument()
  })

  it('shows validation errors for invalid inputs', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    // Verificar que los campos requeridos muestren el mensaje de error nativo del navegador
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)

    expect(emailInput).toBeInvalid()
    expect(passwordInput).toBeInvalid()
  })
}) 