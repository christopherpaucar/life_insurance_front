/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Button } from '@/components/ui/button'
import {
  PaymentMethodType,
  IPaymentMethod,
  CreatePaymentMethodDto,
} from '../payment-methods.interfaces'
import { Switch } from '@/components/ui/switch'

const formSchema = z.object({
  type: z.nativeEnum(PaymentMethodType),
  details: z.object({
    cardNumber: z.string().min(16, 'El número de tarjeta debe tener 16 dígitos'),
    cardHolderName: z.string().min(1, 'El nombre es requerido'),
    cardExpirationDate: z
      .string()
      .min(5, 'La fecha de expiración es requerida')
      .refine((date) => {
        const [month, year] = date.split('/')
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100
        const currentMonth = currentDate.getMonth() + 1
        const expYear = parseInt(year)
        const expMonth = parseInt(month)

        if (expYear < currentYear || expYear > 30) return false
        if (expYear === currentYear && expMonth < currentMonth) return false
        if (expMonth < 1 || expMonth > 12) return false

        return true
      }, 'La fecha de expiración debe ser válida y estar entre la fecha actual y 2030'),
    cardCvv: z.string().min(3, 'El CVV es requerido'),
  }),
  isDefault: z.boolean().optional(),
})

export type PaymentMethodFormValues = z.infer<typeof formSchema>

interface PaymentMethodFormProps {
  onSubmit: (data: CreatePaymentMethodDto | Partial<CreatePaymentMethodDto>) => void
  defaultValues?: IPaymentMethod
  isLoading?: boolean
}

export function PaymentMethodForm({ onSubmit, defaultValues, isLoading }: PaymentMethodFormProps) {
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    }
    return value
  }

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length === 0) return ''
    if (v.length <= 2) return v
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`
  }

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultValues?.type ?? PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: defaultValues?.details.cardNumber
          ? formatCardNumber(defaultValues.details.cardNumber)
          : '',
        cardHolderName: defaultValues?.details.cardHolderName?.toUpperCase() ?? '',
        cardExpirationDate: defaultValues?.details.cardExpirationDate
          ? formatExpirationDate(defaultValues.details.cardExpirationDate)
          : '',
        cardCvv: defaultValues?.details.cardCvv ?? '',
      },
      isDefault: defaultValues?.isDefault ?? false,
    },
  })

  const handleSubmit = (data: PaymentMethodFormValues) => {
    const changedFields: Partial<PaymentMethodFormValues> = {}

    if (data.type !== defaultValues?.type) {
      changedFields.type = data.type
    }

    if (data.isDefault !== defaultValues?.isDefault) {
      changedFields.isDefault = data.isDefault
    }

    const hasChangedDetails = Object.entries(data.details).some(
      ([key, value]) => value !== defaultValues?.details[key as keyof typeof data.details]
    )

    if (hasChangedDetails) {
      changedFields.details = {
        ...data.details,
        cardNumber: data.details.cardNumber.replace(/\s/g, ''),
        cardHolderName: data.details.cardHolderName.toUpperCase(),
        cardExpirationDate: data.details.cardExpirationDate.replace('/', ''),
      }
    }

    onSubmit(changedFields)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit(handleSubmit)()
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Tarjeta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de tarjeta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PaymentMethodType.CREDIT_CARD}>Tarjeta de Crédito</SelectItem>
                  <SelectItem value={PaymentMethodType.DEBIT_CARD}>Tarjeta de Débito</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Tarjeta</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234 5678 9012 3456"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    field.onChange(formatted)
                  }}
                  maxLength={19}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.cardHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre en la Tarjeta</FormLabel>
              <FormControl>
                <Input
                  placeholder="JOHN DOE"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase())
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="details.cardExpirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Expiración</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MM/YY"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatExpirationDate(e.target.value)
                      field.onChange(formatted)
                    }}
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.cardCvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pago por defecto</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          Guardar
        </Button>
      </form>
    </Form>
  )
}
