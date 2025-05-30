import { CheckCircle2, Clock, XCircle, CreditCard, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Contract, TransactionStatus } from '../contract.interfaces'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ContractPaymentsProps {
  contract: Contract
}

export function ContractPayments({ contract }: ContractPaymentsProps) {
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PAID:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case TransactionStatus.FAILED:
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PAID:
        return 'bg-green-100'
      case TransactionStatus.FAILED:
        return 'bg-red-100'
      default:
        return 'bg-yellow-100'
    }
  }

  const getStatusBadgeColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PAID:
        return 'bg-green-500'
      case TransactionStatus.FAILED:
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getStatusLabel = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PAID:
        return 'Pagado'
      case TransactionStatus.FAILED:
        return 'Fallido'
      default:
        return 'Pendiente'
    }
  }

  const getPaymentMethod = () => {
    return 'Tarjeta terminada en 4242'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Historial de Pagos ({contract.transactions?.length || 0})
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Pagado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span>Pendiente</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span>Fallido</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {contract.transactions?.map((transaction) => (
              <div key={transaction.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <div className="font-medium">${transaction.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(transaction.nextPaymentDate), 'PPP', { locale: es })}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{getPaymentMethod()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusBadgeColor(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </Badge>
                    {transaction.status === TransactionStatus.FAILED &&
                      transaction.retryCount > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                <span>Intento {transaction.retryCount}/4</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Próximo intento:{' '}
                                {format(
                                  new Date(transaction.nextRetryPaymentDate || new Date()),
                                  'PPP',
                                  { locale: es }
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
