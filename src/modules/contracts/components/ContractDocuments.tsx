import { FileText, FileUp, Download, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AttachmentType, Contract, ContractStatus } from '../contract.interfaces'

interface ContractDocumentsProps {
  contract: Contract
  isClient: boolean
  isAgent: boolean
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectedDocType: AttachmentType | null
  setSelectedDocType: (type: AttachmentType | null) => void
}

const requiredDocuments = [
  { type: AttachmentType.IDENTIFICATION, label: 'Identificación', icon: FileText },
  { type: AttachmentType.MEDICAL_RECORD, label: 'Historial Médico', icon: FileText },
]

export function ContractDocuments({
  contract,
  isClient,
  isAgent,
  onFileUpload,
  setSelectedDocType,
}: ContractDocumentsProps) {
  const getDocumentStatus = (type: AttachmentType) => {
    const attachment = contract?.attachments?.find((a) => a.type === type)
    if (!attachment) return 'pending'
    return 'completed'
  }

  return (
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
                Por favor, sube los siguientes documentos para continuar con el proceso de tu
                seguro.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {requiredDocuments.map((doc) => {
                const Icon = doc.icon
                const status = getDocumentStatus(doc.type)
                return (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            status === 'completed' ? 'text-green-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{doc.label}</div>
                        {status === 'completed' ? (
                          <div className="text-sm text-green-600">Documento subido</div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Pendiente</div>
                        )}
                      </div>
                    </div>
                    {status !== 'completed' && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedDocType(doc.type)}
                        asChild
                      >
                        <label>
                          <FileUp className="h-4 w-4 mr-2" />
                          Subir
                          <input
                            type="file"
                            className="hidden"
                            onChange={onFileUpload}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos del Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {contract.attachments?.map((attachment) => (
                <div key={attachment.fileUrl} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{attachment.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {requiredDocuments.find((doc) => doc.type === attachment.type)?.label ||
                            'Otro documento'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={attachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descargar documento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {isAgent && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDocType(attachment.type)}
                              >
                                <FileUp className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Solicitar nuevo documento</p>
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
    </div>
  )
}
