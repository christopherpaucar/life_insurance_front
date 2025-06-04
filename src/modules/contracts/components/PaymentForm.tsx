import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePaymentForm } from '../hooks/usePaymentForm'
import { cn } from '@/lib/utils'
import { usePaymentMethods } from '@/modules/payment_methods/usePaymentMethods'
import { PaymentMethodList } from '@/modules/payment_methods/components/PaymentMethodList'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PaymentMethodForm } from '@/modules/payment_methods/components/PaymentMethodForm'
import { useState, useEffect } from 'react'
import {
  IPaymentMethod,
  CreatePaymentMethodDto,
} from '@/modules/payment_methods/payment-methods.interfaces'

interface PaymentFormProps {
  onSubmit: (data: { paymentMethod: IPaymentMethod; p12File: File }) => void
  isLoading: boolean
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const { paymentMethods, isLoading: isLoadingMethods, createPaymentMethod } = usePaymentMethods()
  const [selectedMethod, setSelectedMethod] = useState<IPaymentMethod | null>(
    paymentMethods?.[0] || null
  )
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { setP12File, handleSubmit, setPaymentMethod } = usePaymentForm(onSubmit)

  useEffect(() => {
    if (selectedMethod) {
      setPaymentMethod(selectedMethod)
    }
  }, [selectedMethod, setPaymentMethod])

  const handleCreatePaymentMethod = (
    data: CreatePaymentMethodDto | Partial<CreatePaymentMethodDto>
  ) => {
    createPaymentMethod(data as CreatePaymentMethodDto, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Método de Pago</h3>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Nueva Tarjeta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Método de Pago</DialogTitle>
              </DialogHeader>
              <PaymentMethodForm
                onSubmit={handleCreatePaymentMethod}
                isLoading={isLoadingMethods}
              />
            </DialogContent>
          </Dialog>
        </div>

        <PaymentMethodList
          paymentMethods={paymentMethods}
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          isLoading={isLoadingMethods}
        />
      </div>

      <div className="space-y-4 rounded-lg border p-4">
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
