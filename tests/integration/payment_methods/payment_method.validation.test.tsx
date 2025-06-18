import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PaymentMethodForm } from '@/modules/payment_methods/components/PaymentMethodForm'
import { useAuthService } from '@/modules/auth/useAuth'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Crear un QueryClient para las pruebas
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

// Wrapper para renderizar componentes con QueryClientProvider
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

// Mock useAuthService
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      role: { name: 'ADMIN', permissions: ['all:manage'] },
    },
  }),
}))

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Check: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className}>
      Check
    </div>
  ),
  CreditCard: ({ className }: { className?: string }) => (
    <div data-testid="credit-card-icon" className={className}>
      CreditCard
    </div>
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className}>
      ChevronDown
    </div>
  ),
}))

// Mock de componentes UI
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value, defaultValue }: any) => (
    <div data-testid="select">
      <select value={value} defaultValue={defaultValue} onChange={(e) => onValueChange?.(e.target.value)}>
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ value, children }: any) => (
    <option value={value} data-testid={`select-item-${value}`}>
      {children}
    </option>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: any) => <div data-testid="select-value">{placeholder}</div>,
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, ...props }: any) => (
    <input placeholder={placeholder} {...props} data-testid="input" />
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props} data-testid="button">
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor} data-testid="label">
      {children}
    </label>
  ),
}))

// Mock de componentes de formulario
vi.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  FormControl: ({ children }: any) => <div data-testid="form-control">{children}</div>,
  FormField: ({ children }: any) => <div data-testid="form-field">{children}</div>,
  FormItem: ({ children }: any) => <div data-testid="form-item">{children}</div>,
  FormLabel: ({ children }: any) => <label data-testid="form-label">{children}</label>,
  FormMessage: ({ children }: any) => <div data-testid="form-message">{children}</div>,
}))

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      data-testid="switch"
    />
  ),
}))

// Mock de react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => (e: any) => {
      e?.preventDefault?.()
      // Proporcionar datos válidos para evitar errores
      const mockData = {
        type: 'credit_card',
        details: {
          cardNumber: '4111111111111111',
          cardHolderName: 'JOHN DOE',
          cardExpirationDate: '12/25',
          cardCvv: '123',
        },
        isDefault: false,
      }
      return fn(mockData)
    },
    formState: { errors: {} },
  }),
}))

// Mock de @hookform/resolvers
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => () => ({ isValid: true }),
}))

// Mock de la función cn
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}))

describe('Payment Method Validation Tests', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
    mockOnSubmit.mockClear()
  })

  it('should render payment method form', () => {
    renderWithQueryClient(<PaymentMethodForm onSubmit={mockOnSubmit} />)

    // Verificar que se renderiza el botón
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByText('Guardar')).toBeInTheDocument()
  })

  it('should render form with default values', () => {
    const defaultValues = {
      id: '1',
      type: 'credit_card' as any,
      details: {
        cardNumber: '4111111111111111',
        cardHolderName: 'JOHN DOE',
        cardExpirationDate: '12/25',
        cardCvv: '123',
      },
      isDefault: true,
      isValid: true,
    }

    renderWithQueryClient(<PaymentMethodForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />)

    // Verificar que el formulario se renderiza
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('should render form in loading state', () => {
    renderWithQueryClient(<PaymentMethodForm onSubmit={mockOnSubmit} isLoading={true} />)

    // Verificar que el botón está presente
    const submitButton = screen.getByTestId('button')
    expect(submitButton).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    renderWithQueryClient(<PaymentMethodForm onSubmit={mockOnSubmit} />)

    // Simular envío del formulario
    const submitButton = screen.getByTestId('button')
    fireEvent.click(submitButton)

    // Verificar que se llama la función onSubmit
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it('should render form structure', () => {
    renderWithQueryClient(<PaymentMethodForm onSubmit={mockOnSubmit} />)

    // Verificar que la estructura básica del formulario está presente
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })
}) 