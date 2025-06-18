import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaymentMethodList } from '@/modules/payment_methods/components/PaymentMethodList'
import { PaymentMethodType, IPaymentMethod } from '@/modules/payment_methods/payment-methods.interfaces'

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
}))

// Mock del componente Skeleton
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>
      Skeleton
    </div>
  ),
}))

// Mock de la función cn
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}))

describe('Payment Method List Tests', () => {
  const mockPaymentMethods: IPaymentMethod[] = [
    {
      id: '1',
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '4111111111111111',
        cardExpirationDate: '12/25',
        cvv: '123',
      },
      isDefault: true,
      isValid: true,
    },
    {
      id: '2',
      type: PaymentMethodType.DEBIT_CARD,
      details: {
        cardNumber: '5555555555554444',
        cardExpirationDate: '12/26',
        cvv: '456',
      },
      isDefault: false,
      isValid: true,
    },
  ]

  const mockOnSelectMethod = vi.fn()

  beforeEach(() => {
    mockOnSelectMethod.mockClear()
  })

  it('should render list of payment methods', () => {
    render(
      <PaymentMethodList
        paymentMethods={mockPaymentMethods}
        selectedMethod={null}
        onSelectMethod={mockOnSelectMethod}
      />
    )

    // Verificar que se renderizan los métodos de pago
    expect(screen.getByText('4111 **** **** 1111')).toBeInTheDocument()
    expect(screen.getByText('5555 **** **** 4444')).toBeInTheDocument()
    expect(screen.getByText('Tarjeta de Crédito')).toBeInTheDocument()
    expect(screen.getByText('Tarjeta de Débito')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(
      <PaymentMethodList
        paymentMethods={[]}
        selectedMethod={null}
        onSelectMethod={mockOnSelectMethod}
        isLoading={true}
      />
    )

    // Verificar que se muestran los skeletons
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show empty state', () => {
    render(
      <PaymentMethodList
        paymentMethods={[]}
        selectedMethod={null}
        onSelectMethod={mockOnSelectMethod}
      />
    )

    expect(screen.getByText('No hay métodos de pago')).toBeInTheDocument()
    expect(
      screen.getByText('Agrega un método de pago para realizar pagos de manera más rápida y segura')
    ).toBeInTheDocument()
  })

  it('should handle method selection', () => {
    render(
      <PaymentMethodList
        paymentMethods={mockPaymentMethods}
        selectedMethod={null}
        onSelectMethod={mockOnSelectMethod}
      />
    )

    // Hacer clic en el primer método de pago
    const firstMethod = screen.getByText('4111 **** **** 1111').closest('div')
    if (firstMethod) {
      fireEvent.click(firstMethod)
    }

    expect(mockOnSelectMethod).toHaveBeenCalledWith(mockPaymentMethods[0])
  })

  it('should show selected method state', () => {
    render(
      <PaymentMethodList
        paymentMethods={mockPaymentMethods}
        selectedMethod={mockPaymentMethods[0]}
        onSelectMethod={mockOnSelectMethod}
      />
    )

    // Verificar que el método seleccionado está presente
    expect(screen.getByText('4111 **** **** 1111')).toBeInTheDocument()
  })

  it('should show default method indicator', () => {
    render(
      <PaymentMethodList
        paymentMethods={mockPaymentMethods}
        selectedMethod={null}
        onSelectMethod={mockOnSelectMethod}
      />
    )

    expect(screen.getByText('Predeterminado')).toBeInTheDocument()
  })
}) 