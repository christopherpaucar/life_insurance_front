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
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="h-10 w-1/2 rounded-lg bg-muted animate-pulse mb-4" />
        <div className="flex flex-row gap-8 w-full justify-center">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="w-80 h-[400px] flex flex-col transition-all duration-300 hover:shadow-xl rounded-2xl"
            >
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-4">
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
      </div>
    )
  }

  const firstActive = insurances.find((i) => !i.deletedAt)

  return (
    <div className="flex flex-col items-center gap-8 p-2">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Nuestros Planes de Seguro</h1>
        <p className="text-lg text-muted-foreground">
          Elige el plan que mejor se adapte a tus necesidades y protege tu futuro hoy mismo.
        </p>
      </div>
      <div className="flex flex-row flex-wrap gap-8 justify-center w-full">
        {insurances.map((insurance) => {
          const isFeatured = firstActive && insurance.id === firstActive.id
          return (
            <Card
              key={insurance.id}
              className={`w-80 flex flex-col rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-2xl bg-white relative ${isFeatured ? 'border-primary scale-105 z-10' : 'border-muted'} group`}
              style={{ minHeight: 420 }}
            >
              {isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  Recomendado
                </div>
              )}
              <CardHeader className="flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl pb-0">
                <CardTitle className="text-2xl font-bold text-center group-hover:text-primary transition-colors mb-1">
                  {insurance.name}
                </CardTitle>
                <CardDescription className="text-sm text-center mb-2">{getEnumLabel(insurance.type)}</CardDescription>
                <Badge variant={insurance.deletedAt ? 'secondary' : 'default'} className="mb-2 animate-pulse">
                  {insurance.deletedAt ? 'Inactivo' : 'Activo'}
                </Badge>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-primary">${insurance.basePrice}</span>
                  <span className="text-base text-muted-foreground">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between p-6">
                <ul className="mb-6 space-y-2">
                  <li className="text-sm text-muted-foreground">{insurance.description}</li>
                  <li className="text-sm text-foreground font-medium">Frecuencias disponibles:</li>
                  <li>
                    <div className="flex flex-wrap gap-2">
                      {insurance.availablePaymentFrequencies.map((frequency) => (
                        <Badge key={frequency} variant="outline" className="text-xs px-2 py-1">
                          {getEnumLabel(frequency)}
                        </Badge>
                      ))}
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 p-6 pt-0">
                <Button
                  className={`w-full text-lg font-bold py-6 rounded-xl transition-all duration-300 ${isFeatured ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'}`}
                  onClick={() => router.push(`/${role}/insurances/${insurance.id}`)}
                >
                  {isFeatured ? '¡Elegir este plan!' : 'Ver detalles'}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
