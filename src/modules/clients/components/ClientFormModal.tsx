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
import { useClients } from '../useClients'
import { Client } from '../clients.interfaces'

const formSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  identificationNumber: z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 caracteres'),
  birthDate: z.string().min(1, 'Debe seleccionar una fecha de nacimiento'),
})

type FormValues = z.infer<typeof formSchema>

interface ClientFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  client: Client | null
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  open,
  onClose,
  mode,
  client,
}) => {
  const { createClient, updateClient, isCreating, isUpdating } = useClients()
  const isProcessing = isCreating || isUpdating

  const [formData, setFormData] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    identificationNumber: '',
    birthDate: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === 'edit' && client && open) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        identificationNumber: client.identificationNumber,
        birthDate: client.birthDate,
      })
    }
  }, [client, open, mode])

  const resetForm = () => {
    if (mode === 'edit' && client) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        identificationNumber: client.identificationNumber,
        birthDate: client.birthDate,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        identificationNumber: '',
        birthDate: '',
      })
    }
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      formSchema.parse(formData)
      setErrors({})

      if (mode === 'create') {
        createClient(formData, {
          onSuccess: () => {
            resetForm()
            onClose()
          },
        })
      } else if (mode === 'edit' && client) {
        const updateDto: Partial<FormValues> = {}
        Object.keys(formData).forEach((key) => {
          if (formData[key as keyof FormValues] !== client[key as keyof Client]) {
            updateDto[key as keyof FormValues] = formData[key as keyof FormValues]
          }
        })

        if (Object.keys(updateDto).length === 0) {
          toast.info('No se detectaron cambios')
          onClose()
          return
        }

        updateClient(client.id, updateDto, {
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
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm()
          onClose()
        }
      }}
      modal={true}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Complete el formulario para crear un nuevo cliente'
              : 'Modifique la información del cliente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="identificationNumber">Número de Documento</Label>
            <Input
              id="identificationNumber"
              name="identificationNumber"
              value={formData.identificationNumber || ''}
              onChange={handleChange}
              className={errors.identificationNumber ? 'border-red-500' : ''}
            />
            {errors.identificationNumber && (
              <p className="text-destructive text-sm">{errors.identificationNumber}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate || ''}
              onChange={handleChange}
              className={errors.birthDate ? 'border-red-500' : ''}
            />
            {errors.birthDate && <p className="text-destructive text-sm">{errors.birthDate}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
