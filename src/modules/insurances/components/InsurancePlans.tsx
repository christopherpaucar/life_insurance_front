import { useInsurances } from '../useInsurances'
import { getEnumLabel } from '../insurances.interfaces'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

interface InsurancePlansProps {
  role: string
}

export const InsurancePlans = ({ role }: InsurancePlansProps) => {
  const { insurances, isLoading } = useInsurances()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insurances.map((insurance) => (
        <Card key={insurance.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{insurance.name}</CardTitle>
                <CardDescription>{getEnumLabel(insurance.type)}</CardDescription>
              </div>
              <Badge variant={insurance.isActive ? 'default' : 'secondary'}>
                {insurance.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground mb-4">{insurance.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Precio base:</span>
                <span className="text-sm">${insurance.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Frecuencias disponibles:</span>
                <div className="flex gap-1">
                  {insurance.availablePaymentFrequencies.map((frequency) => (
                    <Badge key={frequency} variant="outline" className="text-xs">
                      {getEnumLabel(frequency)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push(`/${role}/insurances/${insurance.id}`)}>
              Ver detalles
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
