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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Revisar Reembolso #{reimbursement.requestNumber}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Estado General</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as ReimbursementStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReimbursementStatus.APPROVED}>Aprobar</SelectItem>
                  <SelectItem value={ReimbursementStatus.PARTIALLY_APPROVED}>
                    Aprobar Parcialmente
                  </SelectItem>
                  <SelectItem value={ReimbursementStatus.REJECTED}>Rechazar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notas del Revisor</Label>
              <Textarea
                value={formData.reviewerNotes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reviewerNotes: e.target.value }))
                }
                placeholder="Ingrese sus notas sobre la revisión..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Items del Reembolso</h3>
              {reimbursement.items.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <p className="text-sm text-gray-600">{item.type}</p>
                    </div>
                    <div>
                      <Label>Fecha de Servicio</Label>
                      <p className="text-sm text-gray-600">{item.serviceDate}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Descripción</Label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Monto Solicitado</Label>
                      <p className="text-sm text-gray-600">${item.requestedAmount}</p>
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Select
                        value={formData.items?.find((i) => i.id === item.id)?.status}
                        onValueChange={(value) => handleItemChange(item.id, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ReimbursementItemStatus.APPROVED}>Aprobar</SelectItem>
                          <SelectItem value={ReimbursementItemStatus.REJECTED}>Rechazar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Monto Aprobado</Label>
                      <Input
                        type="number"
                        value={formData.items?.find((i) => i.id === item.id)?.approvedAmount}
                        onChange={(e) =>
                          handleItemChange(item.id, 'approvedAmount', Number(e.target.value))
                        }
                        min={0}
                        max={item.requestedAmount}
                      />
                    </div>
                  </div>

                  {formData.items?.find((i) => i.id === item.id)?.status ===
                    ReimbursementItemStatus.REJECTED && (
                    <div>
                      <Label>Razón de Rechazo</Label>
                      <Textarea
                        value={formData.items?.find((i) => i.id === item.id)?.rejectionReason}
                        onChange={(e) =>
                          handleItemChange(item.id, 'rejectionReason', e.target.value)
                        }
                        placeholder="Ingrese la razón del rechazo..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isReviewing}>
              {isReviewing ? 'Enviando...' : 'Enviar Revisión'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
