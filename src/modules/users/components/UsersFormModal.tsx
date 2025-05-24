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
import { IUser, RoleType } from '@/modules/auth/auth.interfaces'
import { useUsers } from '@/modules/users/useUsers'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const password = Array.from({ length: 8 }, () => {
    const charSet = [chars, numbers, symbols]
    const charSetIndex = Math.floor(Math.random() * 3)
    return charSet[charSetIndex].charAt(Math.floor(Math.random() * charSet[charSetIndex].length))
  }).join('')

  return password
}

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.string().min(1, 'Debe seleccionar un rol'),
})

type FormValues = z.infer<typeof formSchema>

interface ClientFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  user: IUser | null
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ open, onClose, mode, user }) => {
  const { createUser, updateUser, isCreating, isUpdating } = useUsers()
  const isProcessing = isCreating || isUpdating

  const [formData, setFormData] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    role: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === 'edit' && user && open) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role.name,
      })
    }
  }, [user, open, mode])

  const resetForm = () => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role.name,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
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

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword()
    setFormData((prev) => ({ ...prev, password: newPassword }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      formSchema.parse(formData)
      setErrors({})

      if (mode === 'create') {
        createUser(
          {
            ...formData,
            role: formData.role as RoleType,
          },
          {
            onSuccess: () => {
              resetForm()
              onClose()
            },
          }
        )
      } else if (mode === 'edit' && user) {
        const updateDto: Partial<FormValues> = {}
        Object.keys(formData).forEach((key) => {
          if (formData[key as keyof FormValues] !== user[key as keyof IUser]) {
            updateDto[key as keyof FormValues] = formData[key as keyof FormValues]
          }
        })

        if (Object.keys(updateDto).length === 0) {
          toast.info('No se detectaron cambios')
          onClose()
          return
        }

        updateUser(user.id, updateDto, {
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
          <DialogTitle>{mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Complete el formulario para crear un nuevo usuario'
              : 'Modifique la información del usuario'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Contraseña</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="default"
                onClick={handleGeneratePassword}
                className="h-9"
              >
                Generar
              </Button>
            </div>
            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
            >
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RoleType.SUPER_ADMIN}>Super Administrador</SelectItem>
                <SelectItem value={RoleType.ADMIN}>Administrador</SelectItem>
                <SelectItem value={RoleType.CLIENT}>Cliente</SelectItem>
                <SelectItem value={RoleType.AGENT}>Agente</SelectItem>
                <SelectItem value={RoleType.REVIEWER}>Revisor</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-destructive text-sm">{errors.role}</p>}
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
