import { ContractStatus } from '../contract.interfaces'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, FileText, Receipt, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthService } from '../../auth/useAuth'
import { useContract } from '../hooks/useContract'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { RoleType } from '../../auth/auth.interfaces'
import { Progress } from '@/components/ui/progress'
import { statusColors, statusLabels } from '../constants/contractStatus'
import { PaymentForm } from './PaymentForm'
import { ContractOverview } from './ContractOverview'
import { ContractDocuments } from './ContractDocuments'
import { ContractPayments } from './ContractPayments'
import { ContractHistory } from './ContractHistory'
import { useContractState } from '../hooks/useContractState'
import { ContractPaymentInfo } from './ContractPaymentInfo'
import { IPaymentMethod } from '../../payment_methods/payment-methods.interfaces'

interface ContractDetailsProps {
  contractId: string
}

export function ContractDetails({ contractId }: ContractDetailsProps) {
  const { user } = useAuthService()
  const {
    contract,
    isLoading,
    updateContract,
    uploadAttachment,
    activateContractByAgent,
    activateContractByClient,
    isActivatingByClient,
  } = useContract(contractId)

  const {
    activeTab,
    setActiveTab,
    showConfirmModal,
    setShowConfirmModal,
    selectedStatus,
    selectedDocType,
    setSelectedDocType,
    showPaymentForm,
    setShowPaymentForm,
    handleStatusChange,
    confirmStatusChange,
  } = useContractState()

  const getProgressPercentage = () => {
    if (!contract) return 0
    const totalSteps = 3
    let completedSteps = 0

    if (contract.status !== ContractStatus.DRAFT) completedSteps++
    if (contract.attachments?.length > 0) completedSteps++
    if (contract.signatureUrl) completedSteps++

    return (completedSteps / totalSteps) * 100
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!contract) {
    return <div>No se encontró el contrato</div>
  }

  const isClient = user?.role?.name === RoleType.CLIENT
  const isAgent = user?.role?.name === RoleType.AGENT

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedDocType) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', selectedDocType)
      uploadAttachment({ contractId, file: formData })
      setSelectedDocType(null)
    }
  }

  const handlePaymentSubmit = (data: { paymentMethod: IPaymentMethod; p12File: File }) => {
    activateContractByClient({
      contractId,
      paymentMethodId: data.paymentMethod.id,
      p12File: data.p12File,
    })
    setShowPaymentForm(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Detalles del Contrato</CardTitle>
              <p className="text-sm text-muted-foreground">Contrato #{contract.contractNumber}</p>
            </div>
            <div className="flex items-center gap-4">
              {isAgent && (
                <Select
                  value={contract.status}
                  onValueChange={(status) => handleStatusChange(status as ContractStatus)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ContractStatus)
                      .filter((status) => status !== ContractStatus.ACTIVE)
                      .map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              <Badge className={`${statusColors[contract.status]} text-white px-4 py-1`}>
                {statusLabels[contract.status]}
              </Badge>
              {isClient && contract.status === ContractStatus.AWAITING_CLIENT_CONFIRMATION && (
                <Button onClick={() => setShowPaymentForm(true)}>Activar Contrato</Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar cambio de estado</DialogTitle>
              <DialogDescription>
                ¿Estás seguro que deseas cambiar el estado del contrato a{' '}
                {selectedStatus && statusLabels[selectedStatus]}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() =>
                  confirmStatusChange(
                    () =>
                      updateContract({
                        id: contractId,
                        data: { status: selectedStatus as ContractStatus },
                      }),
                    () => activateContractByAgent({ contractId })
                  )
                }
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Activar contrato</DialogTitle>
              <DialogDescription>
                Ingresa los datos de tu tarjeta y sube tu archivo P12 para firmar el contrato
              </DialogDescription>
            </DialogHeader>
            <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isActivatingByClient} />
          </DialogContent>
        </Dialog>

        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Progreso del contrato</h3>
              <span className="text-sm text-muted-foreground">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Pagos
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historial
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <ContractOverview contract={contract} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <ContractDocuments
                contract={contract}
                isClient={isClient}
                isAgent={isAgent}
                onFileUpload={handleFileUpload}
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
              />
            </TabsContent>

            <TabsContent value="payments" className="mt-6 space-y-6">
              {isClient &&
                [
                  ContractStatus.ACTIVE,
                  ContractStatus.EXPIRED,
                  ContractStatus.CANCELLED,
                  ContractStatus.INACTIVE,
                ].includes(contract.status) && <ContractPaymentInfo contract={contract} />}
              <ContractPayments contract={contract} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <ContractHistory contract={contract} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
