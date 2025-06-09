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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'
import { InsuranceDetailsForm } from './InsuranceDetailsForm'
import { PaymentFrequency, InsuranceType } from '../enums/insurance.enums'
import {
  IInsurance,
  InsuranceBenefitRelationDto,
  InsuranceCoverageRelationDto,
} from '../interfaces/insurance.interfaces'
import { CreateInsuranceDto, UpdateInsuranceDto } from '../dtos/insurance.dtos'
import { getEnumLabel } from '../../../lib/utils/enum.utils'

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
  coverages: z
    .array(
      z.object({
        id: z.string(),
        coverageAmount: z.coerce.number(),
        additionalCost: z.coerce.number(),
      })
    )
    .default([]),
  benefits: z
    .array(
      z.object({
        id: z.string(),
        additionalCost: z.coerce.number(),
      })
    )
    .default([]),
})

type FormValues = z.infer<typeof formSchema>

interface InsuranceFormModalProps {
  isOpen: boolean
  onClose: () => void
  insurance?: IInsurance | null
  mode?: 'create' | 'edit'
}

export const InsuranceFormModal: React.FC<InsuranceFormModalProps> = ({
  isOpen,
  onClose,
  insurance = null,
  mode = 'create',
}) => {
  const { createInsurance, updateInsurance, isCreating, isUpdating } = useInsurances()
  const isProcessing = isCreating || isUpdating

  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    type: InsuranceType.LIFE,
    basePrice: 0,
    requirements: [],
    availablePaymentFrequencies: [PaymentFrequency.MONTHLY],
    order: 0,
    coverages: [],
    benefits: [],
  })

  const [newRequirement, setNewRequirement] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [modifiedCoverages, setModifiedCoverages] = useState<InsuranceCoverageRelationDto[]>([])
  const [modifiedBenefits, setModifiedBenefits] = useState<InsuranceBenefitRelationDto[]>([])

  const resetForm = useCallback(() => {
    if (mode === 'edit' && insurance) {
      setFormData({
        name: insurance.name,
        description: insurance.description,
        type: insurance.type,
        basePrice: Number(
          insurance.prices.find((price) => price.frequency === PaymentFrequency.MONTHLY)?.price
        ),
        requirements: insurance.requirements || [],
        availablePaymentFrequencies: insurance.prices.map((price) => price.frequency),
        order: insurance.order,
        coverages: insurance.coverages.map((coverage) => ({
          id: coverage.id,
          coverageAmount: Number(coverage.coverageAmount) || 0,
          additionalCost: Number(coverage.additionalCost) || 0,
        })),
        benefits: insurance.benefits.map((benefit) => ({
          id: benefit.id,
          additionalCost: Number(benefit.additionalCost) || 0,
        })),
      })
    } else {
      setFormData({
        name: '',
        description: '',
        type: InsuranceType.LIFE,
        basePrice: 0,
        requirements: [],
        availablePaymentFrequencies: [PaymentFrequency.MONTHLY],
        order: 1,
        coverages: [],
        benefits: [],
      })
    }
    setNewRequirement('')
    setErrors({})
    setModifiedCoverages([])
    setModifiedBenefits([])
  }, [mode, insurance])

  useEffect(() => {
    if (mode === 'edit' && insurance && isOpen) {
      setFormData({
        name: insurance.name,
        description: insurance.description,
        type: insurance.type,
        basePrice: Number(
          insurance.prices.find((price) => price.frequency === PaymentFrequency.MONTHLY)?.price
        ),
        requirements: insurance.requirements || [],
        availablePaymentFrequencies: insurance.prices.map((price) => price.frequency),
        order: insurance.order,
        coverages: insurance.coverages.map((coverageRelation) => ({
          id: coverageRelation.coverage.id,
          coverageAmount: Number(coverageRelation.coverageAmount) || 0,
          additionalCost: Number(coverageRelation.additionalCost) || 0,
        })),
        benefits: insurance.benefits.map((benefitRelation) => ({
          id: benefitRelation.benefit.id,
          additionalCost: Number(benefitRelation.additionalCost) || 0,
        })),
      })
    }

    return () => {
      resetForm()
    }
  }, [insurance, isOpen, mode, resetForm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
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
    if (frequency === PaymentFrequency.MONTHLY) return
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

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(1, Number(e.target.value)), 10)
    setFormData((prev) => ({
      ...prev,
      order: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      formSchema.parse(formData)

      setErrors({})

      if (mode === 'create') {
        createInsurance(formData as CreateInsuranceDto, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      } else if (mode === 'edit' && insurance) {
        const updateDto: UpdateInsuranceDto = {}

        if (formData.name !== insurance.name) updateDto.name = formData.name
        if (formData.description !== insurance.description)
          updateDto.description = formData.description
        if (formData.type !== insurance.type) updateDto.type = formData.type
        if (
          formData.basePrice !==
          Number(
            insurance.prices.find((price) => price.frequency === PaymentFrequency.MONTHLY)?.price
          )
        )
          updateDto.basePrice = formData.basePrice
        if (formData.order !== insurance.order) updateDto.order = formData.order

        const reqChanged =
          JSON.stringify(formData.requirements) !== JSON.stringify(insurance.requirements || [])
        const freqChanged =
          JSON.stringify(formData.availablePaymentFrequencies) !==
          JSON.stringify(insurance.prices.map((price) => price.frequency) || [])

        if (reqChanged) updateDto.requirements = formData.requirements
        if (freqChanged)
          updateDto.availablePaymentFrequencies = formData.availablePaymentFrequencies

        if (modifiedCoverages.length > 0) {
          updateDto.coverages = modifiedCoverages
        }

        if (modifiedBenefits.length > 0) {
          updateDto.benefits = modifiedBenefits
        }

        const hasChanges = Object.keys(updateDto).length > 0

        if (!hasChanges) {
          toast.info('No hay cambios para guardar')
          onClose()
          return
        }

        updateInsurance(insurance.id, updateDto, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const addCoverages = (coverages: InsuranceCoverageRelationDto[]) => {
    setFormData((prev) => {
      const updatedCoverages = [...prev.coverages]
      coverages.forEach((newCoverage) => {
        const existingIndex = updatedCoverages.findIndex((c) => c.id === newCoverage.id)
        if (existingIndex !== -1) {
          updatedCoverages[existingIndex] = newCoverage
        } else {
          updatedCoverages.push(newCoverage)
        }
      })
      return {
        ...prev,
        coverages: updatedCoverages,
      }
    })
    setModifiedCoverages((prev) => {
      const updatedCoverages = [...prev]
      coverages.forEach((newCoverage) => {
        const existingIndex = updatedCoverages.findIndex((c) => c.id === newCoverage.id)
        if (existingIndex !== -1) {
          updatedCoverages[existingIndex] = newCoverage
        } else {
          updatedCoverages.push(newCoverage)
        }
      })
      return updatedCoverages
    })
  }

  const addBenefits = (benefits: InsuranceBenefitRelationDto[]) => {
    setFormData((prev) => {
      const updatedBenefits = [...prev.benefits]
      benefits.forEach((newBenefit) => {
        const existingIndex = updatedBenefits.findIndex((b) => b.id === newBenefit.id)
        if (existingIndex !== -1) {
          updatedBenefits[existingIndex] = newBenefit
        } else {
          updatedBenefits.push(newBenefit)
        }
      })
      return {
        ...prev,
        benefits: updatedBenefits,
      }
    })
    setModifiedBenefits((prev) => {
      const updatedBenefits = [...prev]
      benefits.forEach((newBenefit) => {
        const existingIndex = updatedBenefits.findIndex((b) => b.id === newBenefit.id)
        if (existingIndex !== -1) {
          updatedBenefits[existingIndex] = newBenefit
        } else {
          updatedBenefits.push(newBenefit)
        }
      })

      return updatedBenefits
    })
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
      <DialogContent className="sm:max-w-[800px] pointer-events-auto max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Plan</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del plan"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ingrese la descripción del plan"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Seguro</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de seguro" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InsuranceType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getEnumLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="basePrice">Precio Base</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="Ingrese el precio base"
                />
                {errors.basePrice && <p className="text-sm text-red-500">{errors.basePrice}</p>}
              </div>

              <div className="grid gap-3">
                <Label>Requisitos</Label>
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Ingrese un requisito"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newRequirement.trim()) {
                        setFormData((prev) => ({
                          ...prev,
                          requirements: [...prev.requirements, newRequirement.trim()],
                        }))
                        setNewRequirement('')
                      }
                    }}
                  >
                    Añadir
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm">{req}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            requirements: prev.requirements.filter((_, i) => i !== index),
                          }))
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
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
              <InsuranceDetailsForm
                coverages={formData.coverages}
                benefits={formData.benefits}
                addCoverages={addCoverages}
                addBenefits={addBenefits}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
