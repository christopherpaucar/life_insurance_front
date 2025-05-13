import React, { useState } from 'react'
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
import { CreateInsuranceDto } from '../insurances.interfaces'

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.coerce.number().positive('El precio debe ser un número positivo'),
  duration: z.coerce.number().int().positive('La duración debe ser un número entero positivo'),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface CreateInsuranceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateInsuranceModal: React.FC<CreateInsuranceModalProps> = ({ isOpen, onClose }) => {
  const { createInsurance, isCreating } = useInsurances()

  // Form state
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    isActive: true,
  })

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 0,
      isActive: true,
    })
    setErrors({})
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
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

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
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

      // Submit data
      createInsurance(formData as CreateInsuranceDto, {
        onSuccess: () => {
          resetForm()
          onClose()
        },
      })
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
          <DialogTitle>Crear Plan de Seguro</DialogTitle>
          <DialogDescription>Añadir un nuevo plan de seguro al catálogo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Plan de seguro que ofrece cobertura completa..."
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-3">
              <Label htmlFor="price">Precio (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="299.99"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="duration">Duración (meses)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration || ''}
                onChange={handleChange}
                placeholder="12"
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && <p className="text-destructive text-sm">{errors.duration}</p>}
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0">
            <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={handleCheckboxChange} />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isActive">Plan Activo</Label>
              <p className="text-muted-foreground text-sm">
                El plan estará disponible inmediatamente para su contratación
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Guardando...' : 'Guardar Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
