import { useInsurance } from '../useInsurances'
import { getEnumLabel } from '../insurances.interfaces'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, CheckCircle2, Clock, DollarSign, Calendar } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface InsuranceDetailsProps {
  insuranceId: string
}

export const InsuranceDetails = ({ insuranceId }: InsuranceDetailsProps) => {
  const { insurance, isLoading } = useInsurance(insuranceId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!insurance) return null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{insurance.name}</CardTitle>
                  <CardDescription className="text-lg mt-2">{getEnumLabel(insurance.type)}</CardDescription>
                </div>
                <Badge variant={insurance.isActive ? 'default' : 'secondary'} className="text-sm">
                  {insurance.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">{insurance.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="coverages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="coverages">Coberturas</TabsTrigger>
              <TabsTrigger value="benefits">Beneficios</TabsTrigger>
              <TabsTrigger value="requirements">Requisitos</TabsTrigger>
            </TabsList>
            <TabsContent value="coverages" className="space-y-4">
              {insurance.coverages?.map((coverage) => (
                <Card key={coverage.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Shield className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{coverage.name}</h3>
                        <p className="text-muted-foreground">{coverage.description}</p>
                        <div className="flex gap-4 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {coverage.coverageAmount}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {coverage.additionalCost}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="benefits" className="space-y-4">
              {insurance.benefits?.map((benefit) => (
                <Card key={benefit.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{benefit.name}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                        <Badge variant="outline" className="mt-2 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {benefit.additionalCost}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="requirements" className="space-y-4">
              {insurance.requirements?.map((requirement, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
                      <p className="text-muted-foreground">{requirement}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Precio base</span>
                <span className="font-semibold">${insurance.basePrice}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-muted-foreground">Frecuencias de pago disponibles</span>
                <div className="flex flex-wrap gap-2">
                  {insurance.availablePaymentFrequencies.map((frequency) => (
                    <Badge key={frequency} variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {getEnumLabel(frequency)}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <Button className="w-full" size="lg">
                Contratar ahora
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Por qué elegir este plan?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Protección completa</h4>
                  <p className="text-sm text-muted-foreground">Cobertura integral para tu tranquilidad</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Atención 24/7</h4>
                  <p className="text-sm text-muted-foreground">Soporte disponible en cualquier momento</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Precios competitivos</h4>
                  <p className="text-sm text-muted-foreground">Las mejores tarifas del mercado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
