// Mover el mock de useRouter antes de las importaciones
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RegisterForm } from '@/modules/auth/components/register-form'
import { useAuthService } from '@/modules/auth/useAuth'
import { toast } from 'sonner'

vi.mock('@/modules/auth/useAuth')
vi.mock('sonner')

describe('RegisterForm', () => {
  const mockRegister = vi.fn()
  const mockRouter = { push: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthService as any).mockReturnValue({
      login: vi.fn(),
      isLoggingIn: false,
      register: mockRegister,
      isRegistering: false,
      logout: vi.fn(),
      isLoggingOut: false,
      clearError: vi.fn(),
      hasPermission: vi.fn(),
      user: null,
    })
  })

  it('debería manejar el envío del formulario correctamente', async () => {
    render(<RegisterForm />)

    // Simular entrada de usuario
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    // Verificar que se llama a register con los argumentos correctos
    expect(mockRegister).toHaveBeenCalledWith(
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENTE',
      },
      expect.any(Object)
    )
  })

  it('debería mostrar un mensaje de error si el registro falla', async () => {
    const errorMessage = 'Error de registro'
    mockRegister.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    render(<RegisterForm />)

    // Simular entrada de usuario
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    })

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })
}) 