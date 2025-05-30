'use client'

import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentMethods } from '@/modules/payment_methods/usePaymentMethods'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard, Trash2, Pencil } from 'lucide-react'
import { useState } from 'react'
import {
  CreatePaymentMethodDto,
  IPaymentMethod,
} from '@/modules/payment_methods/payment-methods.interfaces'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PaymentMethodForm } from '@/modules/payment_methods/components/PaymentMethodForm'
import { PaymentMethodList } from '@/modules/payment_methods/components/PaymentMethodList'
import { PaymentMethodCard } from '@/modules/payment_methods/components/PaymentMethodCard'

export default function PaymentMethodsPage() {
  const [selectedMethod, setSelectedMethod] = useState<IPaymentMethod | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const {
    paymentMethods,
    isLoading,
    isError,
    deletePaymentMethod,
    isDeleting,
    createPaymentMethod,
    updatePaymentMethod,
  } = usePaymentMethods()

  const handleCreate = (data: CreatePaymentMethodDto | Partial<CreatePaymentMethodDto>) => {
    createPaymentMethod(data as CreatePaymentMethodDto, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }

  const handleEdit = (data: CreatePaymentMethodDto | Partial<CreatePaymentMethodDto>) => {
    if (!selectedMethod) return
    updatePaymentMethod(selectedMethod.id, data, {
      onSuccess: () => {
        setIsEditModalOpen(false)
      },
    })
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
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Método de Pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Método de Pago</DialogTitle>
              </DialogHeader>
              <PaymentMethodForm onSubmit={handleCreate} isLoading={isLoading} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodList
                paymentMethods={paymentMethods}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detalles de la Tarjeta</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMethod ? (
                <div className="space-y-6">
                  <PaymentMethodCard paymentMethod={selectedMethod} />
                  <div className="flex justify-end space-x-2">
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Método de Pago</DialogTitle>
                        </DialogHeader>
                        <PaymentMethodForm
                          onSubmit={handleEdit}
                          defaultValues={selectedMethod}
                          isLoading={isLoading}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deletePaymentMethod(selectedMethod.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">Selecciona un método de pago</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecciona un método de pago de la lista para ver sus detalles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
