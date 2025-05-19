import { ContractStatus } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Download, Calendar, User, DollarSign, Clock, AlertCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthService } from '../../auth/useAuth'
import { useContract, AttachmentType } from '../hooks/useContract'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ContractDetailsProps {
  contractId: string
}

export const statusColors = {
  [ContractStatus.ACTIVE]: 'bg-green-500',
  [ContractStatus.PENDING_SIGNATURE]: 'bg-yellow-500',
  [ContractStatus.EXPIRED]: 'bg-red-500',
  [ContractStatus.CANCELLED]: 'bg-gray-500',
  [ContractStatus.DRAFT]: 'bg-gray-500',
  [ContractStatus.PENDING_BASIC_DOCUMENTS]: 'bg-blue-500',
}

export const statusLabels = {
  [ContractStatus.ACTIVE]: 'Activo',
  [ContractStatus.PENDING_SIGNATURE]: 'Pendiente de firma',
  [ContractStatus.EXPIRED]: 'Vencido',
  [ContractStatus.CANCELLED]: 'Cancelado',
  [ContractStatus.DRAFT]: 'Borrador',
  [ContractStatus.PENDING_BASIC_DOCUMENTS]: 'Pendiente de documentos básicos',
}

export function ContractDetails({ contractId }: ContractDetailsProps) {
  const { user } = useAuthService()
  const { contract, isLoading, updateContract, uploadAttachment, signContract } = useContract(contractId)
  const [activeTab, setActiveTab] = useState('details')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<AttachmentType | null>(null)

  const requiredDocuments = [
    { type: AttachmentType.IDENTIFICATION, label: 'Identificación' },
    { type: AttachmentType.MEDICAL_RECORD, label: 'Historial Médico' },
  ]

  const hasUploadedDocument = (type: AttachmentType) => {
    return contract?.attachments?.some((attachment) => attachment.type === type)
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

  const isClient = user?.roles.some((role) => role.name === 'CLIENTE')
  const isAgent = user?.roles.some((role) => role.name === 'AGENTE')

  console.log({ isClient, isAgent })

  const handleStatusChange = (status: ContractStatus) => {
    setSelectedStatus(status)
    setShowConfirmModal(true)
  }

  const confirmStatusChange = () => {
    if (selectedStatus) {
      updateContract({ id: contractId, data: { status: selectedStatus } })
      setShowConfirmModal(false)
      setSelectedStatus(null)
    }
  }

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

  const handleSignContract = () => {
    signContract({ contractId })
  }

  console.log(contract)

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
                <Select value={contract.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ContractStatus).map((status) => (
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
              <Button onClick={confirmStatusChange}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Información del Contrato
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Seguro</dt>
                        <dd className="text-lg font-medium">{contract.insurance.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Fecha de inicio</dt>
                        <dd className="text-lg">{format(new Date(contract.startDate), 'PPP', { locale: es })}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Fecha de fin</dt>
                        <dd className="text-lg">{format(new Date(contract.endDate), 'PPP', { locale: es })}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Frecuencia de pago</dt>
                        <dd className="text-lg capitalize">{contract.paymentFrequency}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Información de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Monto total</dt>
                        <dd className="text-2xl font-bold text-primary">${contract.totalAmount}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Monto por cuota</dt>
                        <dd className="text-lg">${contract.installmentAmount}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {contract.beneficiaries?.length > 0 && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Beneficiarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contract.beneficiaries.map((beneficiary) => (
                          <div key={beneficiary.id} className="p-4 border rounded-lg space-y-2">
                            <div className="font-medium">
                              {beneficiary.firstName} {beneficiary.lastName}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-muted-foreground">Porcentaje</div>
                              <div>{beneficiary.percentage}%</div>
                              <div className="text-muted-foreground">Relación</div>
                              <div>{beneficiary.relationship}</div>
                              <div className="text-muted-foreground">Contacto</div>
                              <div>{beneficiary.contactInfo}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contract.notes && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Notas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{contract.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <div className="space-y-6">
                {isClient && contract.status === ContractStatus.PENDING_BASIC_DOCUMENTS && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Documentos Requeridos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Por favor, sube los siguientes documentos para continuar con el proceso de tu seguro.
                        </AlertDescription>
                      </Alert>

                      <div className="grid gap-4">
                        {requiredDocuments.map((doc) => (
                          <div key={doc.type} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium">{doc.label}</div>
                              {hasUploadedDocument(doc.type) ? (
                                <div className="text-sm text-green-600">Documento subido</div>
                              ) : (
                                <div className="text-sm text-muted-foreground">Pendiente</div>
                              )}
                            </div>
                            {!hasUploadedDocument(doc.type) && (
                              <Button variant="outline" onClick={() => setSelectedDocType(doc.type)} asChild>
                                <label>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Subir
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                </label>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isClient && contract.status === ContractStatus.PENDING_SIGNATURE && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleSignContract} className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Firmar Contrato
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {contract.attachments?.map((attachment) => (
                    <Card key={attachment.fileUrl}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{attachment.fileName}</div>
                              <div className="text-sm text-muted-foreground">
                                {requiredDocuments.find((doc) => doc.type === attachment.type)?.label ||
                                  'Otro documento'}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
