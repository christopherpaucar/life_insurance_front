import { useInsurance } from '../useInsurances';
import { getEnumLabel } from '../insurances.interfaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  ArrowRight,
  Heart,
  Users,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

interface InsuranceDetailsProps {
  insuranceId: string;
}

export const InsuranceDetails = ({ insuranceId }: InsuranceDetailsProps) => {
  const { insurance, isLoading } = useInsurance(insuranceId);
  const router = useRouter();

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
    );
  }

  if (!insurance) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-3xl font-bold">{insurance.name}</CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    {getEnumLabel(insurance.type)}
                  </CardDescription>
                </div>
                <Badge
                  variant={insurance.deletedAt ? 'destructive' : 'default'}
                  className="text-sm"
                >
                  {insurance.deletedAt ? 'Inactivo' : 'Activo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">{insurance.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">+1000 clientes satisfechos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">98% de satisfacción</span>
                </div>
              </div>
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
                <Card key={coverage.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{coverage.name}</h3>
                          <Badge variant="secondary" className="text-sm">
                            Cobertura Principal
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{coverage.description}</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Monto de Cobertura</p>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-lg">
                                {coverage.coverageAmount}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Costo Adicional</p>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-lg">
                                {coverage.additionalCost}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Cobertura inmediata desde la activación</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="benefits" className="space-y-4">
              {insurance.benefits?.map((benefit) => (
                <Card key={benefit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{benefit.name}</h3>
                          <Badge variant="secondary" className="text-sm">
                            Beneficio Adicional
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{benefit.description}</p>
                        <div className="mt-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Costo del Beneficio</p>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-lg">
                                {benefit.additionalCost}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Incluido en tu plan actual</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="requirements" className="space-y-4">
              {insurance.requirements?.map((requirement, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{requirement}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Precio base</span>
                  <span className="text-2xl font-bold text-primary">${insurance.basePrice}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
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
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push(`/client/contracts/create?insuranceId=${insuranceId}`)}
              >
                Contratar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Proceso de contratación en menos de 5 minutos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Por qué elegir este plan?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Protección completa</h4>
                  <p className="text-sm text-muted-foreground">
                    Cobertura integral para tu tranquilidad
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Atención 24/7</h4>
                  <p className="text-sm text-muted-foreground">
                    Soporte disponible en cualquier momento
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
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
  );
};
