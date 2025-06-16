import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Error from '@/app/error'
import GlobalError from '@/app/global-error'
import { handleHttpError } from '@/lib/http/error-handler'

// Mock useAuthService
const mockUseAuthService = vi.fn()
vi.mock('@/modules/auth/useAuthService', () => ({
  useAuthService: () => mockUseAuthService()
}))

describe('Error Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display error message when component throws error', async () => {
    const error = {
      message: 'Test error',
      digest: 'test-digest'
    } as Error & { digest?: string }
    const reset = vi.fn()

    render(<Error error={error} reset={reset} />)

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument()
    
    // Verificar que se muestra el botón de reintentar
    const retryButton = screen.getByRole('button', { name: /intentar nuevamente/i })
    expect(retryButton).toBeInTheDocument()

    // Simular clic en reintentar
    fireEvent.click(retryButton)
    expect(reset).toHaveBeenCalled()
  })

  it('should handle global errors', async () => {
    const error = {
      message: 'Critical error',
      digest: 'critical-digest'
    } as Error & { digest?: string }
    const reset = vi.fn()

    render(<GlobalError error={error} reset={reset} />)

    // Verificar que se muestra el mensaje de error crítico
    const errorElements = screen.getAllByText(/error crítico/i)
    expect(errorElements[0]).toBeInTheDocument()
    expect(screen.getByText(/lo sentimos, ha ocurrido un error crítico en la aplicación/i)).toBeInTheDocument()
    
    // Verificar que se muestra el botón de reintentar
    const retryButton = screen.getByRole('button', { name: /intentar nuevamente/i })
    expect(retryButton).toBeInTheDocument()

    // Simular clic en reintentar
    fireEvent.click(retryButton)
    expect(reset).toHaveBeenCalled()
  })

  it('should handle HTTP errors correctly', async () => {
    // Simular error 401 (No autorizado)
    const unauthorizedError = {
      response: {
        status: 401,
        data: {
          message: 'Se requiere autenticación'
        }
      }
    } as unknown as Error

    const httpError = handleHttpError(unauthorizedError)
    expect(httpError.message).toBe('Se requiere autenticación')

    // Simular error 403 (No autorizado)
    const forbiddenError = {
      response: {
        status: 403,
        data: {
          message: 'No tienes permisos para realizar esta acción'
        }
      }
    } as unknown as Error

    const forbiddenHttpError = handleHttpError(forbiddenError)
    expect(forbiddenHttpError.message).toBe('No tienes permisos para realizar esta acción')

    // Simular error 404 (No encontrado)
    const notFoundError = {
      response: {
        status: 404,
        data: {
          message: 'No se encontró el recurso'
        }
      }
    } as unknown as Error

    const notFoundHttpError = handleHttpError(notFoundError)
    expect(notFoundHttpError.message).toBe('No se encontró el recurso')
  })

  it('should handle network errors', async () => {
    const networkError = {
      name: 'Error',
      message: 'Failed to fetch',
      stack: 'Error: Failed to fetch\n    at fetch (native)'
    } as unknown as Error

    const httpError = handleHttpError(networkError)
    expect(httpError.message).toBe('Failed to fetch')
  })

  it('should handle session expiration', async () => {
    mockUseAuthService.mockReturnValue({
      login: vi.fn(),
      isLoggingIn: false,
      register: vi.fn(),
      isRegistering: false,
      logout: vi.fn(),
      user: null,
      error: {
        message: 'Sesión expirada',
        digest: 'session-expired-digest'
      } as Error & { digest?: string }
    })

    const error = {
      message: 'Sesión expirada',
      digest: 'session-expired-digest'
    } as Error & { digest?: string }
    const reset = vi.fn()

    render(<Error error={error} reset={reset} />)

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument()
    
    // Verificar que se muestra el botón de reintentar
    const retryButton = screen.getByRole('button', { name: /intentar nuevamente/i })
    expect(retryButton).toBeInTheDocument()

    // Simular clic en reintentar
    fireEvent.click(retryButton)
    expect(reset).toHaveBeenCalled()
  })

  it('should handle validation errors', async () => {
    const validationError = {
      response: {
        status: 422,
        data: {
          errors: {
            email: ['El email es requerido'],
            password: ['La contraseña debe tener al menos 8 caracteres']
          }
        }
      }
    } as unknown as Error

    const httpError = handleHttpError(validationError)
    expect(httpError.status).toBe(422)
    expect(httpError.data).toEqual({
      errors: {
        email: ['El email es requerido'],
        password: ['La contraseña debe tener al menos 8 caracteres']
      }
    })
  })

  it('should handle server errors (500)', async () => {
    const serverError = {
      response: {
        status: 500,
        data: {
          message: 'Error interno del servidor'
        }
      }
    } as unknown as Error

    const httpError = handleHttpError(serverError)
    expect(httpError.status).toBe(500)
    expect(httpError.message).toBe('Error interno del servidor')
  })

  it('should handle timeout errors', async () => {
    const timeoutError = {
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded'
    } as unknown as Error

    const httpError = handleHttpError(timeoutError)
    expect(httpError.message).toBe('timeout of 5000ms exceeded')
  })

  it('should handle CORS errors', async () => {
    const corsError = {
      message: 'Access to fetch at \'http://api.example.com\' from origin \'http://localhost:3000\' has been blocked by CORS policy'
    } as unknown as Error

    const httpError = handleHttpError(corsError)
    expect(httpError.message).toBe('Access to fetch at \'http://api.example.com\' from origin \'http://localhost:3000\' has been blocked by CORS policy')
  })

  it('should handle malformed JSON responses', async () => {
    const jsonError = {
      message: 'Unexpected token < in JSON at position 0'
    } as unknown as Error

    const httpError = handleHttpError(jsonError)
    expect(httpError.message).toBe('Unexpected token < in JSON at position 0')
  })

  it('should handle error with retry functionality', async () => {
    const error = {
      message: 'Error temporal, reintentando...',
      digest: 'retry-digest'
    } as Error & { digest?: string }
    const reset = vi.fn()

    render(<Error error={error} reset={reset} />)

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument()
    
    // Verificar que se muestra el botón de reintentar
    const retryButton = screen.getByRole('button', { name: /intentar nuevamente/i })
    expect(retryButton).toBeInTheDocument()

    // Simular clic en reintentar
    fireEvent.click(retryButton)
    expect(reset).toHaveBeenCalled()
  })

  it('should handle error with custom error boundary', async () => {
    const error = {
      message: 'Error en el componente',
      digest: 'component-error-digest'
    } as Error & { digest?: string }
    const reset = vi.fn()

    render(<Error error={error} reset={reset} />)

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument()
    
    // Verificar que se muestra el botón de reintentar
    const retryButton = screen.getByRole('button', { name: /intentar nuevamente/i })
    expect(retryButton).toBeInTheDocument()

    // Simular clic en reintentar
    fireEvent.click(retryButton)
    expect(reset).toHaveBeenCalled()
  })
}) 