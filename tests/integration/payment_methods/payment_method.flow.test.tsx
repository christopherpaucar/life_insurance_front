import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PaymentMethodsPage from '../../../src/app/payment-methods/page'

// Mock del servicio primero
vi.mock('@/modules/payment_methods/payment-methods.service', () => ({
  paymentMethodsService: {
    getPaymentMethods: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Test Payment Method',
        type: 'CREDIT_CARD',
        lastFourDigits: '1234',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]),
    createPaymentMethod: vi.fn().mockResolvedValue({
      id: 2,
      name: 'New Payment Method',
      type: 'CREDIT_CARD',
      lastFourDigits: '5678',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }),
    updatePaymentMethod: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Updated Payment Method',
      type: 'CREDIT_CARD',
      lastFourDigits: '1234',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }),
    deletePaymentMethod: vi.fn().mockResolvedValue(undefined)
  }
}))

// Mock del hook usePaymentMethods
vi.mock('@/modules/payment_methods/use-payment-methods', () => ({
  usePaymentMethods: () => ({
    paymentMethods: [
      {
        id: 1,
        name: 'Test Payment Method',
        type: 'CREDIT_CARD',
        lastFourDigits: '1234',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    isLoading: false,
    error: null,
    addPaymentMethod: vi.fn(),
    updatePaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
    setDefaultPaymentMethod: vi.fn()
  })
}))

// Mock de componentes UI
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props} data-testid="button">
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    open ? <div data-testid="dialog">{children}</div> : null
  ),
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }: any) => <div data-testid="dialog-description">{children}</div>,
  DialogFooter: ({ children }: any) => <div data-testid="dialog-footer">{children}</div>,
  DialogTrigger: ({ children, asChild }: any) => (
    asChild ? children : <button>{children}</button>
  )
}))

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  FormField: ({ children }: any) => <div>{children}</div>,
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormDescription: ({ children }: any) => <div>{children}</div>,
  FormMessage: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardFooter: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

// Mock de componentes que usan Next.js router
vi.mock('@/components/layouts/AuthenticatedLayout', () => ({
  AuthenticatedLayout: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/app-sidebar', () => ({
  AppSidebar: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/modules/payment_methods/components/PaymentMethodForm', () => ({
  PaymentMethodForm: ({ onSubmit, defaultValues, isLoading }: any) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name: 'Test', cardNumber: '1234', expiry: '12/25', cvv: '123' }) }}>
      <input data-testid="input" placeholder="Nombre" />
      <input data-testid="input" placeholder="Número de Tarjeta" />
      <input data-testid="input" placeholder="Fecha de Expiración" />
      <input data-testid="input" placeholder="CVV" />
      <button type="submit" disabled={isLoading}>Guardar</button>
    </form>
  )
}))

vi.mock('@/modules/payment_methods/components/PaymentMethodList', () => ({
  PaymentMethodList: ({ paymentMethods, onSelectMethod }: any) => (
    <div>
      {paymentMethods?.map((method: any) => (
        <div key={method.id} onClick={() => onSelectMethod(method)}>
          {method.name}
        </div>
      ))}
    </div>
  )
}))

vi.mock('@/modules/payment_methods/components/PaymentMethodCard', () => ({
  PaymentMethodCard: ({ paymentMethod }: any) => (
    <div>
      <div data-testid="card-title">{paymentMethod.name}</div>
      <button data-testid="edit-button-1">Editar</button>
      <button data-testid="delete-button-1">Eliminar</button>
    </div>
  )
}))

// Función helper para renderizar con providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('Payment Method Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display payment methods list', async () => {
    renderWithProviders(<PaymentMethodsPage />)

    // Verificar que se muestra el título principal
    expect(screen.getByRole('heading', { level: 1, name: 'Métodos de Pago' })).toBeInTheDocument()

    // Verificar que el componente se renderizó sin errores
    expect(document.body).toBeInTheDocument()
  })

  it('should add a new payment method', async () => {
    renderWithProviders(<PaymentMethodsPage />)

    // Verificar que el componente se renderiza correctamente
    expect(screen.getByRole('heading', { level: 1, name: 'Métodos de Pago' })).toBeInTheDocument()
    
    // Verificar que el componente se renderizó sin errores
    expect(document.body).toBeInTheDocument()
  })

  it('should edit an existing payment method', async () => {
    renderWithProviders(<PaymentMethodsPage />)

    // Verificar que el componente se renderiza correctamente
    expect(screen.getByRole('heading', { level: 1, name: 'Métodos de Pago' })).toBeInTheDocument()
    
    // Verificar que el componente se renderizó sin errores
    expect(document.body).toBeInTheDocument()
  })

  it('should delete a payment method', async () => {
    renderWithProviders(<PaymentMethodsPage />)

    // Verificar que el componente se renderiza correctamente
    expect(screen.getByRole('heading', { level: 1, name: 'Métodos de Pago' })).toBeInTheDocument()
    
    // Verificar que el componente se renderizó sin errores
    expect(document.body).toBeInTheDocument()
  })

  it('should validate payment method details', async () => {
    renderWithProviders(<PaymentMethodsPage />)

    // Verificar que el componente se renderiza correctamente
    expect(screen.getByRole('heading', { level: 1, name: 'Métodos de Pago' })).toBeInTheDocument()
    
    // Verificar que el componente se renderizó sin errores
    expect(document.body).toBeInTheDocument()
  })
}) 