import { CreditCard, Lock, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PaymentMethodType } from '../hooks/useContract'
import { usePaymentForm } from '../hooks/usePaymentForm'
import { cn } from '@/lib/utils'

interface PaymentFormProps {
  onSubmit: (data: {
    paymentMethodType: PaymentMethodType
    paymentDetails: {
      cardNumber: string
      cardHolderName: string
      cardExpirationDate: string
      cardCvv: string
    }
    p12File: File
  }) => void
  isLoading: boolean
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const {
    cardNumber,
    setCardNumber,
    cardHolderName,
    setCardHolderName,
    cardExpirationDate,
    setCardExpirationDate,
    cardCvv,
    setCardCvv,
    setP12File,
    handleSubmit,
    formatCardNumber,
    formatExpirationDate,
  } = usePaymentForm(onSubmit)

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-primary">Tarjeta de crédito</p>
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {cardNumber || '**** **** **** ****'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm font-medium">
                Número de tarjeta
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  required
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolderName" className="text-sm font-medium">
                Nombre en la tarjeta
              </Label>
              <div className="relative">
                <Input
                  id="cardHolderName"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                  placeholder="JOHN DOE"
                  className="pl-10"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpirationDate" className="text-sm font-medium">
                  Fecha de expiración
                </Label>
                <div className="relative">
                  <Input
                    id="cardExpirationDate"
                    value={cardExpirationDate}
                    onChange={(e) => setCardExpirationDate(formatExpirationDate(e.target.value))}
                    maxLength={5}
                    placeholder="MM/YY"
                    className="pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardCvv" className="text-sm font-medium">
                  CVV
                </Label>
                <div className="relative">
                  <Input
                    id="cardCvv"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={4}
                    placeholder="123"
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <Label htmlFor="p12File" className="text-sm font-medium">
            Archivo P12
          </Label>
          <div className="relative">
            <Input
              id="p12File"
              type="file"
              accept=".p12"
              onChange={(e) => setP12File(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Sube tu archivo P12 para firmar el contrato digitalmente
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className={cn(
          'w-full py-6 text-base font-medium transition-all',
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        )}
        disabled={isLoading}
      >
        {isLoading ? 'Activando contrato...' : 'Activar contrato'}
      </Button>
    </form>
  )
}
