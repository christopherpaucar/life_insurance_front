import { CreditCard } from 'lucide-react'
import { IPaymentMethod } from '../payment-methods.interfaces'
import { getCardType, getCardStyle } from '../utils/card.utils'

interface PaymentMethodCardProps {
  paymentMethod: IPaymentMethod
}

export function PaymentMethodCard({ paymentMethod }: PaymentMethodCardProps) {
  const cardType = getCardType(paymentMethod.details.cardNumber)
  const { gradient, textColor, mutedTextColor } = getCardStyle(cardType)

  return (
    <div
      className={`relative aspect-[1.586] w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-6`}
    >
      <div className="absolute right-6 top-6">
        <CreditCard className={`h-6 w-6 ${textColor}`} />
      </div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className={`mb-4 text-2xl font-mono ${textColor}`}>
          {paymentMethod.details.cardNumber.slice(0, 4)} **** ****{' '}
          {paymentMethod.details.cardNumber.slice(12, 16)}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-sm ${mutedTextColor}`}>Nombre</div>
            <div className={`font-medium ${textColor}`}>{paymentMethod.details.cardHolderName}</div>
          </div>
          <div>
            <div className={`text-sm ${mutedTextColor}`}>Expira</div>
            <div className={`font-medium ${textColor}`}>
              {paymentMethod.details.cardExpirationDate.slice(0, 2)} /{' '}
              {paymentMethod.details.cardExpirationDate.slice(2, 4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
