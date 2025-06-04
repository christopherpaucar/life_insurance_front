import { Calendar, DollarSign, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getEnumLabel } from '../../../lib/utils/enum.utils'
import { Contract } from '../contract.interfaces'

interface ContractOverviewProps {
  contract: Contract
}

export function ContractOverview({ contract }: ContractOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información del Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Seguro</dt>
              <dd className="text-lg font-medium">{contract.insurance.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Fecha de inicio</dt>
              <dd className="text-lg">
                {format(new Date(contract.startDate), 'PPP', { locale: es })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Fecha de fin</dt>
              <dd className="text-lg">
                {format(new Date(contract.endDate), 'PPP', { locale: es })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Frecuencia de pago</dt>
              <dd className="text-lg capitalize">{getEnumLabel(contract.paymentFrequency)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Monto total</dt>
              <dd className="text-2xl font-bold text-primary">${contract.totalAmount}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Monto por cuota ({getEnumLabel(contract.paymentFrequency)})
              </dt>
              <dd className="text-lg">${contract.transactions?.[0]?.amount ?? 0} USD</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {contract.beneficiaries?.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Beneficiarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contract.beneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="p-4 border rounded-lg space-y-2">
                  <div className="font-medium">
                    {beneficiary.firstName} {beneficiary.lastName}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Porcentaje</div>
                    <div>{beneficiary.percentage}%</div>
                    <div className="text-muted-foreground">Relación</div>
                    <div>{getEnumLabel(beneficiary.relationship)}</div>
                    <div className="text-muted-foreground">Contacto</div>
                    <div>{beneficiary.contactInfo}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
