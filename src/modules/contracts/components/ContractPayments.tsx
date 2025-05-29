import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Contract, TransactionStatus } from '../contract.interfaces'

interface ContractPaymentsProps {
  contract: Contract
}

export function ContractPayments({ contract }: ContractPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historial de Pagos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {contract.transactions?.map((transaction) => (
              <div key={transaction.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.status === TransactionStatus.PAID
                          ? 'bg-green-100'
                          : transaction.status === TransactionStatus.FAILED
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                      }`}
                    >
                      {transaction.status === TransactionStatus.PAID ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : transaction.status === TransactionStatus.FAILED ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">${transaction.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'PPP', { locale: es })}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      transaction.status === TransactionStatus.PAID
                        ? 'bg-green-500'
                        : transaction.status === TransactionStatus.FAILED
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                    }
                  >
                    {transaction.status === TransactionStatus.PAID
                      ? 'Pagado'
                      : transaction.status === TransactionStatus.FAILED
                        ? 'Fallido'
                        : 'Pendiente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
