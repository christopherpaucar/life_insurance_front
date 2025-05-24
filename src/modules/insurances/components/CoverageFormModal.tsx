import React, { useState, useEffect } from 'react'
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
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useInsuranceCoverages } from '../useInsurances'
import { CreateInsuranceCoverageDto, UpdateInsuranceCoverageDto } from '../insurances.interfaces'

const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  coverageAmount: z.coerce.number().positive('El monto de cobertura debe ser un número positivo'),
  additionalCost: z.coerce.number().min(0, 'El costo adicional debe ser un número positivo'),
})

type FormValues = z.infer<typeof formSchema>

interface CoverageFormModalProps {
  isOpen: boolean
  onClose: () => void
  insuranceId: string
  coverage?: any
  mode: 'create' | 'edit'
}

export const CoverageFormModal: React.FC<CoverageFormModalProps> = ({
  isOpen,
  onClose,
  insuranceId,
  coverage = null,
  mode = 'create',
}) => {
  const { createCoverage, updateCoverage, isCreating, isUpdating } =
    useInsuranceCoverages(insuranceId)
  const isProcessing = isCreating || isUpdating

  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    coverageAmount: 0,
    additionalCost: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === 'edit' && coverage && isOpen) {
      setFormData({
        name: coverage.name,
        description: coverage.description,
        coverageAmount: coverage.coverageAmount,
        additionalCost: coverage.additionalCost,
      })
    }
  }, [coverage, isOpen, mode])

  const resetForm = () => {
    if (mode === 'edit' && coverage) {
      setFormData({
        name: coverage.name,
        description: coverage.description,
        coverageAmount: coverage.coverageAmount,
        additionalCost: coverage.additionalCost,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        coverageAmount: 0,
        additionalCost: 0,
      })
    }
    setErrors({})
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      formSchema.parse(formData)
      setErrors({})

      if (mode === 'create') {
        createCoverage(formData as CreateInsuranceCoverageDto, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      } else if (mode === 'edit' && coverage) {
        const updateDto: UpdateInsuranceCoverageDto = {}

        if (formData.name !== coverage.name) updateDto.name = formData.name
        if (formData.description !== coverage.description)
          updateDto.description = formData.description
        if (formData.coverageAmount !== coverage.coverageAmount)
          updateDto.coverageAmount = formData.coverageAmount
        if (formData.additionalCost !== coverage.additionalCost)
          updateDto.additionalCost = formData.additionalCost

        if (Object.keys(updateDto).length === 0) {
          toast.info('No se detectaron cambios')
          onClose()
          return
        }

        updateCoverage(coverage.id as string, updateDto, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
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
      <DialogContent className="sm:max-w-[600px] pointer-events-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Crear Cobertura' : 'Editar Cobertura'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Añadir una nueva cobertura al plan'
              : 'Actualizar la información de la cobertura'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Nombre de la Cobertura</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Cobertura por Fallecimiento"
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
              placeholder="Cobertura que protege a los beneficiarios en caso de fallecimiento..."
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="coverageAmount">Monto de Cobertura (USD)</Label>
            <Input
              id="coverageAmount"
              name="coverageAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.coverageAmount || ''}
              onChange={handleChange}
              placeholder="100000"
              className={errors.coverageAmount ? 'border-red-500' : ''}
            />
            {errors.coverageAmount && (
              <p className="text-destructive text-sm">{errors.coverageAmount}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="additionalCost">Costo Adicional (USD)</Label>
            <Input
              id="additionalCost"
              name="additionalCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.additionalCost || ''}
              onChange={handleChange}
              placeholder="50"
              className={errors.additionalCost ? 'border-red-500' : ''}
            />
            {errors.additionalCost && (
              <p className="text-destructive text-sm">{errors.additionalCost}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Guardar Cobertura'
                  : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
