'use client'

import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentMethods } from '@/modules/payment_methods/usePaymentMethods'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard, Trash2, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces'

export default function PaymentMethodsPage() {
  const { paymentMethods, isLoading, isError, deletePaymentMethod, isDeleting } =
    usePaymentMethods()

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

  if (isError) {
    return (
      <AuthenticatedLayout>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-destructive">Error al cargar los métodos de pago</p>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Métodos de Pago</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Método de Pago
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No hay métodos de pago</h3>
                <p className="text-sm text-muted-foreground">
                  Agrega un método de pago para realizar pagos de manera más rápida y segura
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            {getPaymentMethodIcon(method.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getPaymentMethodTypeLabel(method.type)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={method.isValid ? 'default' : 'destructive'}>
                          {method.isValid ? 'Válido' : 'Inválido'}
                        </Badge>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deletePaymentMethod(method.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
