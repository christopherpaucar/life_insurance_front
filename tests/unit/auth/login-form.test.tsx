// Mover el mock de useRouter antes de las importaciones
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from '@/modules/auth/components/login-form'
import { useAuthService } from '@/modules/auth/useAuth'
import { toast } from 'sonner'

// Mock del hook useAuthService
vi.mock('@/modules/auth/useAuth')
vi.mock('sonner')

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockRouter = { push: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthService as any).mockReturnValue({
      login: mockLogin,
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      isLoggingOut: false,
      clearError: vi.fn(),
      hasPermission: vi.fn(),
      user: null,
    })
  })

  it('debería manejar el envío del formulario correctamente', async () => {
    render(<LoginForm />)

    // Simular entrada de usuario
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    // Verificar que se llama a login con los argumentos correctos
    expect(mockLogin).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123' },
      expect.any(Object)
    )
  })

  it('debería mostrar un mensaje de error si el login falla', async () => {
    const errorMessage = 'Error de autenticación'
    mockLogin.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    render(<LoginForm />)

    // Simular entrada de usuario
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })
}) 