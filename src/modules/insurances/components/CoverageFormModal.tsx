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
import { useCoverages } from '../useCoverages'
import { ICoverage } from '../interfaces/insurance.interfaces'
import { CreateCoverageDto, UpdateCoverageDto } from '../dtos/insurance.dtos'

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
})

type FormValues = z.infer<typeof formSchema>

interface CoverageFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  coverage?: ICoverage | null
}

export function CoverageFormModal({ open, onClose, mode, coverage }: CoverageFormModalProps) {
  const { createCoverage, updateCoverage, isCreating, isUpdating } = useCoverages()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: coverage?.name ?? '',
      description: coverage?.description ?? '',
    },
    values: coverage
      ? {
          name: coverage.name,
          description: coverage.description,
        }
      : undefined,
  })

  const onSubmit = (values: FormValues) => {
    if (mode === 'create') {
      createCoverage(values as CreateCoverageDto)
    } else if (mode === 'edit' && coverage) {
      updateCoverage(coverage.id, values as UpdateCoverageDto)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nueva Cobertura' : 'Editar Cobertura'}</DialogTitle>
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
