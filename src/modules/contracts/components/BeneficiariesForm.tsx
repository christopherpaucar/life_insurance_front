import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash2, HelpCircle } from 'lucide-react'

const beneficiarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  contactInfo: z.string().optional(),
})

const formSchema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, 'At least one beneficiary is required'),
})

type FormData = z.infer<typeof formSchema>

interface BeneficiariesFormProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const relationships = ['spouse', 'child', 'parent', 'sibling', 'other']

export function BeneficiariesForm({ formData, setFormData, onNext, onBack }: BeneficiariesFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beneficiaries:
        formData.beneficiaries.length > 0
          ? formData.beneficiaries
          : [{ name: '', relationship: '', percentage: 100, contactInfo: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'beneficiaries',
  })

  const onSubmit = (data: FormData) => {
    setFormData({
      ...formData,
      beneficiaries: data.beneficiaries,
    })
    onNext()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(onSubmit)(e)
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Beneficiario {index + 1}</h3>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`beneficiaries.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Nombre</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ingrese el nombre completo del beneficiario.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`beneficiaries.${index}.relationship`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Relación</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Seleccione la relación del beneficiario con el titular del contrato.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar relación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationships.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>
                              {relationship.charAt(0).toUpperCase() + relationship.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`beneficiaries.${index}.percentage`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Porcentaje</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ingrese el porcentaje que recibirá el beneficiario. La suma total debe ser 100%.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`beneficiaries.${index}.contactInfo`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Información de contacto</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ingrese la información de contacto del beneficiario (opcional).</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: '', relationship: '', percentage: 0, contactInfo: '' })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Beneficiario
        </Button>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Volver
          </Button>
          <Button type="submit">Siguiente</Button>
        </div>
      </form>
    </Form>
  )
}
