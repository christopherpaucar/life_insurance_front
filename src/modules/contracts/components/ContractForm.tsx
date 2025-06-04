import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { format, addMonths, addQuarters, addYears } from 'date-fns'
import { CalendarIcon, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { getEnumLabel } from '../../insurances'

type Frequency = 'monthly' | 'quarterly' | 'yearly'

const formSchema = z.object({
  startDate: z.date({
    required_error: 'La fecha de inicio es requerida',
  }),
  paymentFrequency: z.enum(['monthly', 'quarterly', 'yearly']),
  periods: z.number().min(1, 'Debe ser al menos 1 periodo'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ContractFormProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  availableFrequencies: Frequency[]
}

export function ContractForm({
  formData,
  setFormData,
  onNext,
  availableFrequencies,
}: ContractFormProps) {
  const [showCustomPeriod, setShowCustomPeriod] = useState(false)
  const [periodOptions, setPeriodOptions] = useState<number[]>([1, 2, 3, 4, 5, 6, 12, 24, 36])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      paymentFrequency: formData.paymentFrequency,
      periods: formData.periods,
      notes: formData.notes,
    },
  })

  const calculateEndDate = (startDate: Date, frequency: string, periods: number): Date => {
    switch (frequency) {
      case 'monthly':
        return addMonths(startDate, periods)
      case 'quarterly':
        return addQuarters(startDate, periods)
      case 'yearly':
        return addYears(startDate, periods)
      default:
        return startDate
    }
  }

  const onSubmit = (data: FormData) => {
    const endDate = calculateEndDate(data.startDate, data.paymentFrequency, data.periods)
    const { periods, ...rest } = data
    console.log(periods, formData.periods)

    setFormData({
      ...formData,
      ...rest,
      startDate: data.startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
    onNext()
  }

  const handleFrequencyChange = (value: string) => {
    const frequency = value as Frequency
    form.setValue('paymentFrequency', frequency)
    setShowCustomPeriod(false)

    switch (frequency) {
      case 'monthly':
        setPeriodOptions([1, 3, 6, 12, 24, 36])
        break
      case 'quarterly':
        setPeriodOptions([1, 2, 3, 4, 5, 6])
        break
      case 'yearly':
        setPeriodOptions([1, 2, 3, 4, 5])
        break
    }
  }

  const getPeriodLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return 'meses'
      case 'quarterly':
        return 'trimestres'
      case 'yearly':
        return 'años'
      default:
        return ''
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit(onSubmit)(e)
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-2">
                <FormLabel>Fecha de inicio</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Seleccione la fecha de inicio del contrato</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Seleccionar fecha</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    lang="es"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentFrequency"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Frecuencia de pago</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Seleccione con qué frecuencia se realizarán los pagos del contrato</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Select onValueChange={handleFrequencyChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableFrequencies.map((frequency, index) => {
                    return (
                      <SelectItem key={`${frequency}-${index}`} value={frequency}>
                        {getEnumLabel(frequency)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="periods"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Número de periodos</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Seleccione el número de periodos para la duración del contrato</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {!showCustomPeriod ? (
                <Select
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setShowCustomPeriod(true)
                    } else {
                      field.onChange(Number(value))
                    }
                  }}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar número de periodos" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {periodOptions.map((period) => (
                      <SelectItem key={period} value={period.toString()}>
                        {period} {getPeriodLabel(form.getValues('paymentFrequency'))}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCustomPeriod(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Notas</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Agregue cualquier información adicional relevante para el contrato</p>
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

        <div className="flex justify-end">
          <Button type="submit">Siguiente</Button>
        </div>
      </form>
    </Form>
  )
}
