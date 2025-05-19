import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ContractForm } from '../components/ContractForm'
import { BeneficiariesForm } from '../components/BeneficiariesForm'
import { ReviewForm } from '../components/ReviewForm'
import { useCreateContract } from '../hooks/useCreateContract'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export function ContractPage() {
  const searchParams = useSearchParams()
  const insuranceId = searchParams.get('insuranceId')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('contract')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [formData, setFormData] = useState({
    insuranceId: insuranceId || '',
    startDate: '',
    endDate: '',
    paymentFrequency: 'monthly',
    beneficiaries: [],
    notes: '',
  })

  const { mutate: createContract, isPending } = useCreateContract({
    onSuccess: () => {
      toast.success('Contract created successfully')
      router.push('/contracts')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleNext = () => {
    if (activeTab === 'contract') {
      setCompletedSteps([...completedSteps, 'contract'])
      setActiveTab('beneficiaries')
    } else if (activeTab === 'beneficiaries') {
      setCompletedSteps([...completedSteps, 'beneficiaries'])
      setActiveTab('review')
    }
  }

  const handleBack = () => {
    if (activeTab === 'beneficiaries') {
      setActiveTab('contract')
    } else if (activeTab === 'review') {
      setActiveTab('beneficiaries')
    }
  }

  const handleSubmit = () => {
    createContract(formData)
  }

  const isStepCompleted = (step: string) => completedSteps.includes(step)
  const isStepEnabled = (step: string) => {
    if (step === 'contract') return true
    if (step === 'beneficiaries') return isStepCompleted('contract')
    if (step === 'review') return isStepCompleted('beneficiaries')
    return false
  }

  const getStepStatus = (step: string) => {
    if (activeTab === step) return 'current'
    if (isStepCompleted(step)) return 'completed'
    if (isStepEnabled(step)) return 'enabled'
    return 'disabled'
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contract" disabled={!isStepEnabled('contract')} className="relative">
                1. Detalles del Contrato
                {getStepStatus('contract') === 'completed' && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2">
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="beneficiaries" disabled={!isStepEnabled('beneficiaries')} className="relative">
                2. Beneficiarios
                {getStepStatus('beneficiaries') === 'completed' && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2">
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="review" disabled={!isStepEnabled('review')} className="relative">
                3. Revisión
                {getStepStatus('review') === 'completed' && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2">
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 mb-6">
              <div className="text-sm text-muted-foreground">
                {activeTab === 'contract' && 'Paso 1: Complete los detalles del contrato'}
                {activeTab === 'beneficiaries' && 'Paso 2: Agregue los beneficiarios del contrato'}
                {activeTab === 'review' && 'Paso 3: Revise y confirme la información del contrato'}
              </div>
            </div>
            <TabsContent value="contract">
              <ContractForm formData={formData} setFormData={setFormData} onNext={handleNext} />
            </TabsContent>
            <TabsContent value="beneficiaries">
              <BeneficiariesForm
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            </TabsContent>
            <TabsContent value="review">
              <ReviewForm formData={formData} onSubmit={handleSubmit} onBack={handleBack} isLoading={isPending} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
