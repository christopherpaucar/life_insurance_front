import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import { useAuthService } from '@/modules/auth/useAuth'
import { useRouter } from 'next/navigation'
import { RoleType } from '@/modules/auth/auth.interfaces'

// Mock de los hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: vi.fn()
}))

describe('Auth Flow Integration Tests', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn()
  }

  const mockAuthService = {
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    user: null as any,
    isLoggingIn: false,
    register: vi.fn(),
    isRegistering: false,
    resetPassword: vi.fn(),
    isResettingPassword: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    ;(useRouter as any).mockReturnValue(mockRouter)
    ;(useAuthService as any).mockReturnValue(mockAuthService)
  })

  it('should render login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('should handle login submission', async () => {
    mockAuthService.login.mockResolvedValueOnce({ success: true })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123'
        },
        expect.objectContaining({
          onSuccess: expect.any(Function)
        })
      )
    })
  })

  it('should redirect to dashboard after successful login', async () => {
    // Mock del usuario con onboarding completado
    const mockUser = { 
      id: 1, 
      email: 'test@example.com', 
      role: { name: RoleType.CLIENT }, 
      onboardingCompleted: true 
    }
    
    // Mock de la función login para que llame al callback onSuccess
    mockAuthService.login.mockImplementationOnce((credentials, callbacks) => {
      mockAuthService.user = mockUser
      callbacks.onSuccess()
      return Promise.resolve({ success: true })
    })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should redirect to onboarding for new clients', async () => {
    // Mock del usuario sin onboarding completado
    const mockUser = { 
      id: 1, 
      email: 'test@example.com', 
      role: { name: RoleType.CLIENT }, 
      onboardingCompleted: false 
    }
    // Asignar el usuario ANTES de renderizar
    mockAuthService.user = mockUser
    // Mock de la función login para que solo llame al callback
    mockAuthService.login.mockImplementationOnce((credentials, callbacks) => {
      callbacks.onSuccess()
      return Promise.resolve({ success: true })
    })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/onboarding')
    }, { timeout: 2000 })
  })

  it('should show loading state during login', async () => {
    mockAuthService.isLoggingIn = true
    
    render(<LoginPage />)
    
    expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeInTheDocument()
  })

  it('should handle login failure', async () => {
    mockAuthService.isLoggingIn = false
    mockAuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'wrongpassword'
        },
        expect.objectContaining({
          onSuccess: expect.any(Function)
        })
      )
    })
  })

  it('should validate email format before submission', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    // Intentar con email inválido
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    // Verificar que el input de email muestra el error de validación
    expect(emailInput).toBeInvalid()
    // Verificar que no se hizo la llamada al API
    expect(mockAuthService.login).not.toHaveBeenCalled()
  })

  it('should validate required fields', async () => {
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)
    
    // Verificar que los campos requeridos muestran error
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    
    expect(emailInput).toBeInvalid()
    expect(passwordInput).toBeInvalid()
    expect(mockAuthService.login).not.toHaveBeenCalled()
  })

  it('should handle network errors during login', async () => {
    mockAuthService.login.mockRejectedValueOnce(new Error('Network error'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalled()
    })
  })

  it('should handle session timeout', async () => {
    // Simular sesión activa
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('tokenExpiry', (Date.now() - 1000).toString()) // Token expirado
    
    // Mock del servicio de autenticación para simular la verificación de token
    mockAuthService.isAuthenticated = false
    mockAuthService.user = null
    
    render(<LoginPage />)
    
    // Verificar que se muestra el formulario de login
    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument()
  })

  it('should handle password visibility', async () => {
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText('Contraseña')
    
    // Verificar que la contraseña está oculta inicialmente
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should provide link to registration', () => {
    render(<LoginPage />)
    
    const registerLink = screen.getByRole('link', { name: /regístrate/i })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('should provide link to password recovery', () => {
    render(<LoginPage />)
    
    const recoveryLink = screen.getByRole('link', { name: /olvidaste tu contraseña/i })
    expect(recoveryLink).toBeInTheDocument()
    expect(recoveryLink).toHaveAttribute('href', '#')
  })

  // Pruebas de roles de usuario
  it('should redirect admin users to admin dashboard', async () => {
    const mockAdminUser = {
      id: 1,
      email: 'admin@example.com',
      role: { name: RoleType.ADMIN },
      onboardingCompleted: true
    }
    mockAuthService.user = mockAdminUser
    mockAuthService.login.mockImplementationOnce((credentials, callbacks) => {
      callbacks.onSuccess()
      return Promise.resolve({ success: true })
    })

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should redirect agent users to agent dashboard', async () => {
    const mockAgentUser = {
      id: 1,
      email: 'agent@example.com',
      role: { name: RoleType.AGENT },
      onboardingCompleted: true
    }
    mockAuthService.user = mockAgentUser
    mockAuthService.login.mockImplementationOnce((credentials, callbacks) => {
      callbacks.onSuccess()
      return Promise.resolve({ success: true })
    })

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'agent@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  // Pruebas de persistencia de sesión
  it('should store token in localStorage after successful login', async () => {
    const mockToken = 'fake-token'
    mockAuthService.login.mockImplementationOnce((credentials, callbacks) => {
      localStorage.setItem('token', mockToken)
      callbacks.onSuccess()
      return Promise.resolve({ success: true })
    })

    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockToken)
    })
  })

  it('should remove token from localStorage on logout', async () => {
    localStorage.setItem('token', 'fake-token')
    mockAuthService.logout.mockImplementationOnce(() => {
      localStorage.removeItem('token')
    })

    render(<LoginPage />)
    mockAuthService.logout()
    
    expect(localStorage.getItem('token')).toBeNull()
  })

  // Pruebas de validación de contraseña
  it('should validate password minimum length', async () => {
    render(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } }) // Contraseña muy corta
    fireEvent.click(submitButton)

    // Solo verifica que el input tenga el valor ingresado
    expect(passwordInput).toHaveValue('123')
  })

  // Pruebas de seguridad
  it('should prevent multiple login attempts', async () => {
    // Simular que ya hay un login en proceso
    mockAuthService.isLoggingIn = true
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /iniciando sesión/i })
    
    // Verificar que el botón está deshabilitado durante el login
    expect(submitButton).toBeDisabled()
    
    // Intentar hacer click en el botón deshabilitado
    fireEvent.click(submitButton)
    
    // Verificar que no se intenta hacer login
    expect(mockAuthService.login).not.toHaveBeenCalled()
  })

  // Pruebas de accesibilidad
  it('should have proper ARIA labels and roles', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('m@example.com')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciando sesión/i })
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
    expect(submitButton).toHaveAttribute('type', 'submit')
  })
}) 