import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  IReimbursement,
  IReviewReimbursement,
  ReimbursementItemStatus,
  ReimbursementStatus,
} from '../reimbursements.interfaces'
import { useReimbursements } from '../hooks/useReimbursements'
import { getEnumLabel } from '@/lib/utils/enum.utils'
import { Card, CardContent } from '@/components/ui/card'
import { IconInfoCircle } from '@tabler/icons-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ReimbursementReviewModalProps {
  isOpen: boolean
  onClose: () => void
  reimbursement: IReimbursement
}

export const ReimbursementReviewModal: React.FC<ReimbursementReviewModalProps> = ({
  isOpen,
  onClose,
  reimbursement,
}) => {
  const { reviewReimbursement, isReviewing } = useReimbursements()
  const [formData, setFormData] = React.useState<IReviewReimbursement>({
    status: ReimbursementStatus.UNDER_REVIEW,
    reviewerNotes: '',
    items: reimbursement.items.map((item) => ({
      id: item.id,
      status: ReimbursementItemStatus.PENDING,
      approvedAmount: item.requestedAmount,
    })),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void reviewReimbursement(reimbursement.id, formData, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const handleItemChange = (itemId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-gradient-to-b from-white to-blue-50">
        <DialogHeader className="space-y-4 sticky top-0 bg-gradient-to-b from-white to-blue-50 z-10 pb-4">
          <DialogTitle className="text-3xl font-bold text-primary">
            Revisar Reembolso #{reimbursement.requestNumber}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8 overflow-y-auto">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold text-primary">Estado General</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <IconInfoCircle size={18} className="text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Seleccione el estado general de la solicitud de reembolso</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value as ReimbursementStatus }))
                  }
                >
                  <SelectTrigger className="border-2 border-primary/20 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ReimbursementStatus.UNDER_REVIEW}>En revisión</SelectItem>
                    <SelectItem value={ReimbursementStatus.APPROVED}>Aprobar</SelectItem>
                    <SelectItem value={ReimbursementStatus.PARTIALLY_APPROVED}>
                      Aprobar Parcialmente
                    </SelectItem>
                    <SelectItem value={ReimbursementStatus.REJECTED}>Rechazar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold text-primary">Notas del Revisor</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <IconInfoCircle size={18} className="text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Agregue notas o comentarios sobre su revisión</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  value={formData.reviewerNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reviewerNotes: e.target.value }))
                  }
                  placeholder="Ingrese sus notas sobre la revisión..."
                  className="border-2 border-primary/20 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-primary">Items del Reembolso</h3>
                <p className="text-sm text-gray-600">Revise y apruebe cada item individualmente</p>
              </div>
            </div>

            <div className="space-y-6 max-h-[25vh] overflow-y-auto pr-2">
              {reimbursement.items.map((item) => (
                <Card
                  key={item.id}
                  className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Tipo</Label>
                        <p className="text-sm text-gray-600">{getEnumLabel(item.type)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Fecha de Servicio</Label>
                        <p className="text-sm text-gray-600">{item.serviceDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-primary font-medium">Descripción</Label>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Monto Solicitado</Label>
                        <p className="text-sm text-gray-600">${item.requestedAmount}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Estado</Label>
                        <Select
                          value={formData.items?.find((i) => i.id === item.id)?.status}
                          onValueChange={(value) => handleItemChange(item.id, 'status', value)}
                        >
                          <SelectTrigger className="border-2 border-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ReimbursementItemStatus.APPROVED}>
                              Aprobar
                            </SelectItem>
                            <SelectItem value={ReimbursementItemStatus.REJECTED}>
                              Rechazar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Monto Aprobado</Label>
                        <Input
                          type="number"
                          value={formData.items?.find((i) => i.id === item.id)?.approvedAmount}
                          onChange={(e) =>
                            handleItemChange(item.id, 'approvedAmount', Number(e.target.value))
                          }
                          min={0}
                          max={item.requestedAmount}
                          className="border-2 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    {formData.items?.find((i) => i.id === item.id)?.status ===
                      ReimbursementItemStatus.REJECTED && (
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Razón de Rechazo</Label>
                        <Textarea
                          value={formData.items?.find((i) => i.id === item.id)?.rejectionReason}
                          onChange={(e) =>
                            handleItemChange(item.id, 'rejectionReason', e.target.value)
                          }
                          placeholder="Ingrese la razón del rechazo..."
                          className="border-2 border-primary/20 focus:border-primary"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-gradient-to-b from-blue-50 to-white z-10 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-primary/20 hover:bg-primary/10"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isReviewing} className="bg-primary hover:bg-primary/90">
              {isReviewing ? 'Enviando...' : 'Enviar Revisión'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
