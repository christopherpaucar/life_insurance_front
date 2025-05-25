import React, { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useInsurances } from '../useInsurances'
import {
  IInsurance,
  CreateInsuranceDto,
  UpdateInsuranceDto,
  InsuranceType,
  PaymentFrequency,
  getEnumLabel,
} from '../insurances.interfaces'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'
import { InsuranceDetailsForm } from './InsuranceDetailsForm'

const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  type: z.nativeEnum(InsuranceType, {
    errorMap: () => ({ message: 'Por favor seleccione un tipo de seguro válido' }),
  }),
  basePrice: z.coerce.number().positive('El precio debe ser un número positivo'),
  requirements: z.array(z.string()).default([]),
  availablePaymentFrequencies: z.array(z.nativeEnum(PaymentFrequency)).default([]),
  order: z.coerce.number().default(0),
})

type FormValues = z.infer<typeof formSchema>

interface InsuranceFormModalProps {
  isOpen: boolean
  onClose: () => void
  insurance?: IInsurance | null // Optional for edit mode
  mode: 'create' | 'edit'
}

export const InsuranceFormModal: React.FC<InsuranceFormModalProps> = ({
  isOpen,
  onClose,
  insurance = null,
  mode = 'create',
}) => {
  const { createInsurance, updateInsurance, isCreating, isUpdating } = useInsurances()
  const isProcessing = isCreating || isUpdating

  // Form state
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    type: InsuranceType.LIFE, // Default value
    basePrice: 0,
    requirements: [],
    availablePaymentFrequencies: [],
    order: 0,
  })

  // New requirement input state
  const [newRequirement, setNewRequirement] = useState('')

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal closes
  const resetForm = useCallback(() => {
    if (mode === 'edit' && insurance) {
      setFormData({
        name: insurance.name,
        description: insurance.description,
        type: insurance.type,
        basePrice: insurance.basePrice,
        requirements: insurance.requirements || [],
        availablePaymentFrequencies: insurance.availablePaymentFrequencies || [],
        order: insurance.order,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        type: InsuranceType.LIFE,
        basePrice: 0,
        requirements: [],
        availablePaymentFrequencies: [],
        order: 0,
      })
    }
    setNewRequirement('')
    setErrors({})
  }, [mode, insurance])

  // Load insurance data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && insurance && isOpen) {
      setFormData({
        name: insurance.name,
        description: insurance.description,
        type: insurance.type,
        basePrice: insurance.basePrice,
        requirements: insurance.requirements || [],
        availablePaymentFrequencies: insurance.availablePaymentFrequencies || [],
        order: insurance.order,
      })
    }

    return () => {
      resetForm()
    }
  }, [insurance, isOpen, mode, resetForm])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : 0,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFrequencyToggle = (frequency: PaymentFrequency) => {
    setFormData((prev) => {
      const currentFrequencies = prev.availablePaymentFrequencies || []
      if (currentFrequencies.includes(frequency)) {
        return {
          ...prev,
          availablePaymentFrequencies: currentFrequencies.filter(
            (f: PaymentFrequency) => f !== frequency
          ),
        }
      } else {
        return {
          ...prev,
          availablePaymentFrequencies: [...currentFrequencies, frequency],
        }
      }
    })
  }

  // Add requirement
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()],
      }))
      setNewRequirement('')
    }
  }

  // Remove requirement
  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || [],
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data with Zod
      formSchema.parse(formData)

      // Clear errors
      setErrors({})

      if (mode === 'create') {
        // Submit data for create
        createInsurance(formData as CreateInsuranceDto, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      } else if (mode === 'edit' && insurance) {
        // Create UpdateInsuranceDto with only changed fields
        const updateDto: UpdateInsuranceDto = {}

        if (formData.name !== insurance.name) updateDto.name = formData.name
        if (formData.description !== insurance.description)
          updateDto.description = formData.description
        if (formData.type !== insurance.type) updateDto.type = formData.type
        if (formData.basePrice !== insurance.basePrice) updateDto.basePrice = formData.basePrice
        if (formData.order !== insurance.order) updateDto.order = formData.order

        // For arrays, we need to check if they've actually changed
        const reqChanged =
          JSON.stringify(formData.requirements) !== JSON.stringify(insurance.requirements || [])
        const freqChanged =
          JSON.stringify(formData.availablePaymentFrequencies) !==
          JSON.stringify(insurance.availablePaymentFrequencies || [])

        if (reqChanged) updateDto.requirements = formData.requirements
        if (freqChanged)
          updateDto.availablePaymentFrequencies = formData.availablePaymentFrequencies

        // Only update if there are changes
        if (Object.keys(updateDto).length === 0) {
          toast.info('No se detectaron cambios')
          onClose()
          return
        }

        // Submit data for update
        updateInsurance(insurance.id, updateDto, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Convert Zod errors to record
        const fieldErrors: Record<string, string> = {}
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0].toString()] = error.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrija los errores en el formulario')
      } else {
        console.error('Error inesperado:', err)
        toast.error('Ha ocurrido un error inesperado')
      }
    }
  }

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(1, Number(e.target.value)), 10)
    setFormData((prev) => ({
      ...prev,
      rank: value,
    }))
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
      <DialogContent className="sm:max-w-[800px] pointer-events-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Plan de Seguro' : 'Editar Plan de Seguro'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Añadir un nuevo plan de seguro al catálogo'
              : 'Actualizar la información del plan de seguro'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nombre del Plan</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seguro de Vida Premium"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Plan de seguro que ofrece cobertura completa..."
                  className={errors.description ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-destructive text-sm">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="type">Tipo de Seguro</Label>
                <Select
                  value={formData.type as InsuranceType}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione un tipo de seguro" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InsuranceType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getEnumLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-destructive text-sm">{errors.type}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="basePrice">Precio Base (USD)</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice || ''}
                  onChange={handleChange}
                  placeholder="299.99"
                  className={errors.basePrice ? 'border-red-500' : ''}
                />
                {errors.basePrice && <p className="text-destructive text-sm">{errors.basePrice}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-3">
                <Label>Requisitos</Label>
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Agregar requisito"
                  />
                  <Button type="button" onClick={addRequirement}>
                    Agregar
                  </Button>
                </div>
                {formData.requirements && formData.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span className="text-sm">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Frecuencias de Pago Disponibles</Label>
                <div className="flex flex-wrap gap-3">
                  {Object.values(PaymentFrequency).map((frequency) => (
                    <div key={frequency} className="flex items-center space-x-2">
                      <Checkbox
                        id={`freq-${frequency}`}
                        checked={(formData.availablePaymentFrequencies || []).includes(
                          frequency.toLowerCase() as PaymentFrequency
                        )}
                        onCheckedChange={() => handleFrequencyToggle(frequency)}
                      />
                      <Label htmlFor={`freq-${frequency}`}>{getEnumLabel(frequency)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0">
                <Input
                  id="order"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.order}
                  onChange={handleOrderChange}
                  className="w-20"
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="order">Orden del Plan</Label>
                  <p className="text-muted-foreground text-sm">Valor del 1 al 10</p>
                </div>
              </div>
            </div>
          </div>

          {mode === 'edit' && insurance && (
            <div className="pt-6 border-t">
              <InsuranceDetailsForm />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isProcessing} onClick={handleSubmit}>
              {isProcessing
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Guardar Plan'
                  : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
