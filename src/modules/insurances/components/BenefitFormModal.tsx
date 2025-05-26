import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useBenefits } from '../useBenefits'
import { IBenefit, CreateBenefitDto, UpdateBenefitDto } from '../insurances.interfaces'

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
})

type FormValues = z.infer<typeof formSchema>

interface BenefitFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  benefit?: IBenefit | null
}

export function BenefitFormModal({ open, onClose, mode, benefit }: BenefitFormModalProps) {
  const { createBenefit, updateBenefit, isCreating, isUpdating } = useBenefits()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: benefit?.name ?? '',
      description: benefit?.description ?? '',
    },
    values: benefit
      ? {
          name: benefit.name,
          description: benefit.description,
        }
      : undefined,
  })

  const onSubmit = (values: FormValues) => {
    if (mode === 'create') {
      createBenefit(values as CreateBenefitDto)
    } else if (mode === 'edit' && benefit) {
      updateBenefit(benefit.id, values as UpdateBenefitDto)
    }
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Beneficio' : 'Editar Beneficio'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? 'Guardando...'
                  : mode === 'create'
                    ? 'Crear'
                    : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
