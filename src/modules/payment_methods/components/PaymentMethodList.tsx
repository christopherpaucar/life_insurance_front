import { Check, CreditCard } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { PaymentMethodType, IPaymentMethod } from '../payment-methods.interfaces'
import { cn } from '@/lib/utils'

interface PaymentMethodListProps {
  paymentMethods: IPaymentMethod[]
  selectedMethod: IPaymentMethod | null
  onSelectMethod: (method: IPaymentMethod) => void
  isLoading?: boolean
}

export function PaymentMethodList({
  paymentMethods,
  selectedMethod,
  onSelectMethod,
  isLoading,
}: PaymentMethodListProps) {
  const getPaymentMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
        return <CreditCard className="h-5 w-5" />
      case PaymentMethodType.DEBIT_CARD:
        return <CreditCard className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getPaymentMethodTypeLabel = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
        return 'Tarjeta de Crédito'
      case PaymentMethodType.DEBIT_CARD:
        return 'Tarjeta de Débito'
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No hay métodos de pago</h3>
        <p className="text-sm text-muted-foreground">
          Agrega un método de pago para realizar pagos de manera más rápida y segura
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={cn(
            'group relative cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:shadow-sm',
            selectedMethod?.id === method.id && 'border-primary bg-accent/50'
          )}
          onClick={() => onSelectMethod(method)}
        >
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                'rounded-full p-2 transition-colors',
                selectedMethod?.id === method.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10'
              )}
            >
              {getPaymentMethodIcon(method.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {method.details.cardNumber.slice(0, 4)} **** ****{' '}
                  {method.details.cardNumber.slice(12, 16)}
                </h3>
                {method.isDefault && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    <Check className="mr-1 h-3 w-3" />
                    Predeterminado
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  {getPaymentMethodTypeLabel(method.type)}
                </p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  Expira {method.details.cardExpirationDate.slice(0, 2)} /{' '}
                  {method.details.cardExpirationDate.slice(2, 4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
