import { FileText, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Contract } from '../contract.interfaces'

interface ContractHistoryProps {
  contract: Contract
}

export function ContractHistory({ contract }: ContractHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historial de Cambios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Contrato creado</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(contract.startDate), 'PPP', { locale: es })}
              </div>
            </div>
          </div>
          {contract.signedAt && (
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Contrato firmado</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(contract.signedAt), 'PPP', { locale: es })}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
