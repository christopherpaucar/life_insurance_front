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
import { IconPlus, IconTrash, IconInfoCircle } from '@tabler/icons-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Contract, ContractStatus } from '../../contracts/contract.interfaces'
import { statusColors, statusLabels } from '../../contracts/constants/contractStatus'
import { getEnumLabel } from '@/lib/utils/enum.utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent } from '@/components/ui/card'

const formSchema = z.object({
  contractId: z.string().min(1, 'Debe seleccionar un contrato'),
  items: z
    .array(
      z.object({
        type: z.nativeEnum(ReimbursementItemType),
        description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
        serviceDate: z.string().min(1, 'La fecha del servicio es requerida'),
        requestedAmount: z.number().positive('El monto debe ser un número positivo'),
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
  const [files, setFiles] = useState<File[]>([])
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
    setFiles([])
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const newFiles = [...files]
      newFiles[itemIndex] = file
      setFiles(newFiles)
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
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      formSchema.parse(formData)
      setErrors({})

      createReimbursement(formData, files, {
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader className="space-y-4 sticky top-0 z-10">
          <DialogTitle className="text-3xl font-bold text-primary">
            Nueva Solicitud de Reembolso
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Complete el formulario para solicitar el reembolso de sus gastos médicos. Asegúrese de
            tener a mano sus facturas y documentos de respaldo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 overflow-y-auto">
          <Card className="border-2">
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold text-primary">
                    Seleccione un Contrato Activo
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <IconInfoCircle size={18} className="text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Seleccione el contrato activo al que desea asociar este reembolso</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={formData.contractId}
                  onValueChange={(value) => handleSelectChange('contractId', value)}
                >
                  <SelectTrigger className="w-full border-2 focus:border-primary">
                    <SelectValue>
                      {formData.contractId ? (
                        <div className="flex items-center gap-2">
                          <span>
                            Contrato #
                            {
                              activeContracts?.find((c) => c.id === formData.contractId)
                                ?.contractNumber
                            }
                          </span>
                          <Badge
                            className={
                              statusColors[
                                activeContracts?.find((c) => c.id === formData.contractId)
                                  ?.status || ContractStatus.ACTIVE
                              ]
                            }
                          >
                            {
                              statusLabels[
                                activeContracts?.find((c) => c.id === formData.contractId)
                                  ?.status || ContractStatus.ACTIVE
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
                        <div className="flex items-center gap-2">
                          <span>Contrato #{contract.contractNumber}</span>
                          <Badge className={statusColors[contract.status]}>
                            {statusLabels[contract.status]}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {formData.contractId && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-primary">Items del Reembolso</h3>
                  <p className="text-sm text-gray-600">
                    Agregue cada servicio o medicamento que desea reembolsar
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="flex items-center gap-2 border-2 hover:bg-primary/10"
                >
                  <IconPlus size={20} className="text-primary" />
                  Agregar Item
                </Button>
              </div>

              <div className="space-y-6 max-h-[25vh] overflow-y-auto pr-2">
                {formData.items.map((item, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-2">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h4 className="font-medium text-xl text-primary">Item #{index + 1}</h4>
                          <p className="text-sm text-gray-600">
                            Complete los detalles del servicio o medicamento
                          </p>
                        </div>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <IconTrash size={20} />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="grid gap-3">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`items.${index}.type`}
                                className="text-primary font-medium"
                              >
                                Tipo de Servicio
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <IconInfoCircle size={16} className="text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Seleccione el tipo de servicio o medicamento que desea
                                      reembolsar
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Select
                              value={item.type}
                              onValueChange={(value) => handleSelectChange('type', value, index)}
                            >
                              <SelectTrigger
                                id={`items.${index}.type`}
                                className={`border-2 ${
                                  errors[`items.${index}.type`]
                                    ? 'border-red-500'
                                    : 'border-primary/20'
                                } focus:border-primary`}
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
                              <p className="text-destructive text-sm">
                                {errors[`items.${index}.type`]}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-3">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`items.${index}.requestedAmount`}
                                className="text-primary font-medium"
                              >
                                Monto Requerido
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <IconInfoCircle size={16} className="text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Monto total del servicio o medicamento que desea reembolsar
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Input
                              id={`items.${index}.requestedAmount`}
                              name="requestedAmount"
                              type="number"
                              value={item.requestedAmount}
                              onChange={(e) => handleChange(e, index)}
                              className={`border-2 ${
                                errors[`items.${index}.requestedAmount`]
                                  ? 'border-red-500'
                                  : 'border-primary/20'
                              } focus:border-primary`}
                            />
                            {errors[`items.${index}.requestedAmount`] && (
                              <p className="text-destructive text-sm">
                                {errors[`items.${index}.requestedAmount`]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid gap-3">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`items.${index}.serviceDate`}
                                className="text-primary font-medium"
                              >
                                Fecha del Servicio
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <IconInfoCircle size={16} className="text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Fecha en la que recibió el servicio o compró el medicamento
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Input
                              id={`items.${index}.serviceDate`}
                              name="serviceDate"
                              type="date"
                              value={item.serviceDate}
                              onChange={(e) => handleChange(e, index)}
                              className={`border-2 ${
                                errors[`items.${index}.serviceDate`]
                                  ? 'border-red-500'
                                  : 'border-primary/20'
                              } focus:border-primary`}
                            />
                            {errors[`items.${index}.serviceDate`] && (
                              <p className="text-destructive text-sm">
                                {errors[`items.${index}.serviceDate`]}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-3">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`items.${index}.description`}
                                className="text-primary font-medium"
                              >
                                Descripción
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <IconInfoCircle size={16} className="text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Describa el servicio o medicamento en detalle</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Textarea
                              id={`items.${index}.description`}
                              name="description"
                              value={item.description}
                              onChange={(e) => handleChange(e, index)}
                              className={`border-2 ${
                                errors[`items.${index}.description`]
                                  ? 'border-red-500'
                                  : 'border-primary/20'
                              } focus:border-primary`}
                              placeholder="Ej: Consulta médica con el Dr. Juan Pérez por dolor de espalda"
                            />
                            {errors[`items.${index}.description`] && (
                              <p className="text-destructive text-sm">
                                {errors[`items.${index}.description`]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-3 md:col-span-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`items.${index}.invoice`}
                              className="text-primary font-medium"
                            >
                              Factura
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <IconInfoCircle size={16} className="text-primary" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Suba la factura o comprobante del servicio en formato PDF o
                                    imagen
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`items.${index}.invoice`}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, index)}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 border-2 focus:border-primary"
                            />
                            {files[index] && (
                              <span className="text-sm text-gray-600">{files[index].name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 sticky bottom-0 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 hover:bg-primary/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !formData.contractId}
              className="bg-primary hover:bg-primary/90"
            >
              {isCreating ? 'Creando...' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
