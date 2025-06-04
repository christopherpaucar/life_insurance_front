import { useAuthStore } from '@/modules/auth/auth.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Contract, ContractStatus, TransactionStatus } from '../contract.interfaces'
import Link from 'next/link'
import { AlertCircle, CreditCard, Calendar, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ContractPaymentInfoProps {
  contract: Contract
}

export function ContractPaymentInfo({ contract }: ContractPaymentInfoProps) {
  const { user } = useAuthStore()
  const nextPayment = contract.transactions?.find(
    (transaction) => transaction.status === TransactionStatus.PENDING
  )
  const failedPayment = contract.transactions?.find(
    (transaction) => transaction.status === TransactionStatus.FAILED
  )

  const getDunningStatus = () => {
    if (!failedPayment) return null

    if (failedPayment.retryCount < 2) {
      return {
        level: 'warning',
        message: `Se intentó realizar el pago pero no se pudo. Se intentará nuevamente el ${format(
          new Date(failedPayment.nextRetryPaymentDate || new Date()),
          'PPP',
          { locale: es }
        )}`,
      }
    } else if (failedPayment.retryCount < 4) {
      return {
        level: 'error',
        message: `Se intentó realizar el pago pero no se pudo. Se intentará nuevamente el ${format(
          new Date(failedPayment.nextRetryPaymentDate || new Date()),
          'PPP',
          { locale: es }
        )}`,
      }
    } else {
      return {
        level: 'error',
        message: `Tu póliza será suspendida el ${format(
          new Date(failedPayment.retireDate || new Date()),
          'PPP',
          {
            locale: es,
          }
        )}`,
      }
    }
  }

  const dunningStatus = getDunningStatus()

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Información de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Hola {user?.name}, tu póliza está{' '}
              <strong className="text-blue-900">
                {contract.status === ContractStatus.ACTIVE ? 'activa' : 'inactiva'}
              </strong>
            </p>
            {nextPayment && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-blue-900">Próximo intento de cobro</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">${nextPayment.amount}</p>
                <p className="text-sm text-gray-600">
                  Fecha de vencimiento:{' '}
                  {format(new Date(nextPayment.nextPaymentDate), 'PPP', { locale: es })}
                </p>
              </div>
            )}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <p className="font-medium text-blue-900">Método de pago</p>
              </div>
              <p className="text-sm text-gray-600">
                Pago automático con tarjeta que termina en 4242.
                <br />
                <Link
                  href="/payment-methods"
                  className="text-violet-600 hover:underline font-bold text-sm"
                >
                  Cambiar método de pago
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {dunningStatus && (
        <Alert variant={dunningStatus.level === 'warning' ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Estado de pago</AlertTitle>
          <AlertDescription>{dunningStatus.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Información importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Los pagos se procesan automáticamente en la fecha de vencimiento</li>
            <li>• Puedes cambiar tu método de pago en cualquier momento</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
