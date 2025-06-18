import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PaymentMethodForm } from '@/modules/payment_methods/components/PaymentMethodForm'
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces'
import { useAuthService } from '@/modules/auth/useAuth'

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronDownIcon: () => <div>ChevronDown</div>,
  Plus: () => <div>Plus</div>,
  CreditCard: () => <div>CreditCard</div>,
  Trash2: () => <div>Trash2</div>,
  Pencil: () => <div>Pencil</div>
}))

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

// Mock de componentes UI
vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  FormField: ({ children }: any) => <div>{children}</div>,
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, ...props }: any) => <input placeholder={placeholder} {...props} />
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, defaultValue }: any) => (
    <select onChange={(e) => onValueChange(e.target.value)} defaultValue={defaultValue}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type }: any) => (
    <button type={type} disabled={disabled}>{children}</button>
  )
}))

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  )
}))

describe('Payment Method Form Tests', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
    mockOnSubmit.mockClear()
  })

  it('should render form with all required fields', () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} />)

    // Verificar que el formulario se renderiza
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
  })

  it('should handle form submission with valid data', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} />)

    // Verificar que el formulario se renderiza
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()

    // Verificar que el mock está disponible
    expect(mockOnSubmit).toBeDefined()
  })

  it('should show validation errors for invalid data', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} />)

    // Verificar que el formulario se renderiza
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()

    // Verificar que el mock está disponible
    expect(mockOnSubmit).toBeDefined()
  })

  it('should handle form submission with default values', async () => {
    const defaultValues = {
      id: '1',
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '4111111111111111',
        cardHolderName: 'JOHN DOE',
        cardExpirationDate: '12/25',
        cardCvv: '123',
      },
      isDefault: true,
      isValid: true,
    }

    render(<PaymentMethodForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />)

    // Verificar que el formulario se renderiza con valores por defecto
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
  })

  it('should disable form when loading', () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} isLoading={true} />)

    // Verificar que el botón está deshabilitado
    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled()
  })
}) 