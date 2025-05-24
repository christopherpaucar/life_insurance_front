import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReviewFormProps {
  formData: any
  onSubmit: () => void
  onBack: () => void
  isLoading: boolean
}

export function ReviewForm({ formData, onSubmit, onBack, isLoading }: ReviewFormProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Fecha de inicio</dt>
              <dd className="text-lg">{formatDate(formData.startDate as string)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Fecha de fin</dt>
              <dd className="text-lg">{formatDate(formData.endDate as string)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Monto total</dt>
              <dd className="text-lg">Llenado por el agente en una fase posterior</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Frecuencia de pago</dt>
              <dd className="text-lg capitalize">{formData.paymentFrequency}</dd>
            </div>
            {formData.notes && (
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Notas</dt>
                <dd className="text-lg">{formData.notes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beneficiarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.beneficiaries.map((beneficiary: any, index: number) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Beneficiario {index + 1}</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Nombre</dt>
                    <dd className="text-lg">{beneficiary.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Relación</dt>
                    <dd className="text-lg capitalize">{beneficiary.relationship}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Porcentaje</dt>
                    <dd className="text-lg">{beneficiary.percentage}%</dd>
                  </div>
                  {beneficiary.contactInfo && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Información de contacto
                      </dt>
                      <dd className="text-lg">{beneficiary.contactInfo}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Creando contrato...' : 'Crear contrato'}
        </Button>
      </div>
    </div>
  )
}
