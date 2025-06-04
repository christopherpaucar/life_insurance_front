import React, { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useReimbursements } from '../hooks/useReimbursements'
import { ReimbursementItemType } from '../reimbursements.interfaces'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Contract, ContractStatus } from '../../contracts/contract.interfaces'
import { statusColors, statusLabels } from '../../contracts/constants/contractStatus'
import { getEnumLabel } from '@/lib/utils/enum.utils'

const formSchema = z.object({
  contractId: z.string().min(1, 'Debe seleccionar un contrato'),
  items: z
    .array(
      z.object({
        type: z.nativeEnum(ReimbursementItemType),
        description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
        serviceDate: z.string().min(1, 'La fecha del servicio es requerida'),
        requestedAmount: z.number().positive('El monto debe ser un número positivo'),
        documentUrl: z.string().optional(),
      })
    )
    .min(1, 'Debe agregar al menos un item'),
})

type FormValues = z.infer<typeof formSchema>

interface ReimbursementFormModalProps {
  isOpen: boolean
  onClose: () => void
  contracts?: Contract[]
}

export const ReimbursementFormModal: React.FC<ReimbursementFormModalProps> = ({
  isOpen,
  onClose,
  contracts,
}) => {
  const { createReimbursement, isCreating } = useReimbursements()
  const [formData, setFormData] = useState<FormValues>({
    contractId: '',
    items: [
      {
        type: ReimbursementItemType.MEDICATION,
        description: '',
        serviceDate: format(new Date(), 'yyyy-MM-dd'),
        requestedAmount: 0,
      },
    ],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const activeContracts = contracts?.filter((contract) => contract.status === ContractStatus.ACTIVE)

  const resetForm = () => {
    setFormData({
      contractId: '',
      items: [
        {
          type: ReimbursementItemType.MEDICATION,
          description: '',
          serviceDate: format(new Date(), 'yyyy-MM-dd'),
          requestedAmount: 0,
        },
      ],
    })
    setErrors({})
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    itemIndex?: number
  ) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (itemIndex !== undefined) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, index) =>
          index === itemIndex
            ? {
                ...item,
                [name]: type === 'number' ? Number(value) : value,
              }
            : item
        ),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: any, itemIndex?: number) => {
    if (itemIndex !== undefined) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, index) =>
          index === itemIndex
            ? {
                ...item,
                [name]: value,
              }
            : item
        ),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          type: ReimbursementItemType.MEDICATION,
          description: '',
          serviceDate: format(new Date(), 'yyyy-MM-dd'),
          requestedAmount: 0,
        },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      formSchema.parse(formData)
      setErrors({})

      createReimbursement(formData, {
        onSuccess: () => {
          resetForm()
          onClose()
        },
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            const path = error.path.join('.')
            fieldErrors[path] = error.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrija los errores en el formulario')
      }
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
      modal={true}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Reembolso</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear una nueva solicitud de reembolso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Seleccione un Contrato Activo</Label>
            <Select
              value={formData.contractId}
              onValueChange={(value) => handleSelectChange('contractId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {formData.contractId ? (
                    <div className="flex items-center gap-2">
                      <span>
                        Contrato #
                        {activeContracts?.find((c) => c.id === formData.contractId)?.contractNumber}
                      </span>
                      <Badge
                        className={
                          statusColors[
                            activeContracts?.find((c) => c.id === formData.contractId)?.status ||
                              ContractStatus.ACTIVE
                          ]
                        }
                      >
                        {
                          statusLabels[
                            activeContracts?.find((c) => c.id === formData.contractId)?.status ||
                              ContractStatus.ACTIVE
                          ]
                        }
                      </Badge>
                    </div>
                  ) : (
                    'Seleccione un contrato...'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeContracts?.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span>Contrato #{contract.contractNumber}</span>
                        <Badge className={statusColors[contract.status]}>
                          {statusLabels[contract.status]}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{contract.insurance.name}</p>
                        <p>
                          {format(new Date(contract.startDate), 'dd/MM/yyyy')} -{' '}
                          {format(new Date(contract.endDate), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contractId && <p className="text-destructive text-sm">{errors.contractId}</p>}
          </div>

          {formData.contractId && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Items del Reembolso</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <IconPlus size={20} />
                  Agregar Item
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Item #{index + 1}</h4>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <IconTrash size={20} />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-3">
                      <Label htmlFor={`items.${index}.type`}>Tipo de Servicio</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value) => handleSelectChange('type', value, index)}
                      >
                        <SelectTrigger
                          id={`items.${index}.type`}
                          className={errors[`items.${index}.type`] ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ReimbursementItemType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getEnumLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`items.${index}.type`] && (
                        <p className="text-destructive text-sm">{errors[`items.${index}.type`]}</p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor={`items.${index}.serviceDate`}>Fecha del Servicio</Label>
                      <Input
                        id={`items.${index}.serviceDate`}
                        name="serviceDate"
                        type="date"
                        value={item.serviceDate}
                        onChange={(e) => handleChange(e, index)}
                        className={errors[`items.${index}.serviceDate`] ? 'border-red-500' : ''}
                      />
                      {errors[`items.${index}.serviceDate`] && (
                        <p className="text-destructive text-sm">
                          {errors[`items.${index}.serviceDate`]}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor={`items.${index}.requestedAmount`}>Monto Requerido</Label>
                      <Input
                        id={`items.${index}.requestedAmount`}
                        name="requestedAmount"
                        type="number"
                        value={item.requestedAmount}
                        onChange={(e) => handleChange(e, index)}
                        className={errors[`items.${index}.requestedAmount`] ? 'border-red-500' : ''}
                      />
                      {errors[`items.${index}.requestedAmount`] && (
                        <p className="text-destructive text-sm">
                          {errors[`items.${index}.requestedAmount`]}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor={`items.${index}.description`}>Descripción</Label>
                      <Textarea
                        id={`items.${index}.description`}
                        name="description"
                        value={item.description}
                        onChange={(e) => handleChange(e, index)}
                        className={errors[`items.${index}.description`] ? 'border-red-500' : ''}
                      />
                      {errors[`items.${index}.description`] && (
                        <p className="text-destructive text-sm">
                          {errors[`items.${index}.description`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-4">
            <Button type="submit" disabled={isCreating || !formData.contractId}>
              {isCreating ? 'Creando...' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
