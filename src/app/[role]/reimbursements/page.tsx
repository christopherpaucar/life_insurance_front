'use client'

import React from 'react'
import { useReimbursements } from '@/modules/reimbursements/hooks/useReimbursements'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ReimbursementStatus,
  ReimbursementItemStatus,
} from '@/modules/reimbursements/reimbursements.interfaces'
import { IconPlus, IconSearch, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ReimbursementFormModal } from '@/modules/reimbursements/components/ReimbursementFormModal'
import { ReimbursementReviewModal } from '@/modules/reimbursements/components/ReimbursementReviewModal'
import { useAuthStore } from '@/modules/auth/auth.store'
import { RoleType } from '@/modules/auth/auth.interfaces'
import { useContract } from '../../../modules/contracts/hooks/useContract'
import { getEnumLabel } from '@/lib/utils/enum.utils'

const getStatusColor = (status: ReimbursementStatus) => {
  const colors = {
    [ReimbursementStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
    [ReimbursementStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
    [ReimbursementStatus.APPROVED]: 'bg-green-100 text-green-800',
    [ReimbursementStatus.PARTIALLY_APPROVED]: 'bg-orange-100 text-orange-800',
    [ReimbursementStatus.REJECTED]: 'bg-red-100 text-red-800',
    [ReimbursementStatus.PAID]: 'bg-purple-100 text-purple-800',
  }
  return colors[status]
}

const getItemStatusColor = (status: ReimbursementItemStatus) => {
  const colors = {
    [ReimbursementItemStatus.PENDING]: 'bg-gray-100 text-gray-800',
    [ReimbursementItemStatus.APPROVED]: 'bg-green-100 text-green-800',
    [ReimbursementItemStatus.REJECTED]: 'bg-red-100 text-red-800',
  }
  return colors[status]
}

export default function ReimbursementsPage() {
  const { reimbursements, isLoading } = useReimbursements()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<ReimbursementStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedReimbursement, setSelectedReimbursement] = React.useState<string | null>(null)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})

  const isReviewer = user?.role?.name === RoleType.REVIEWER

  const filteredReimbursements = React.useMemo(() => {
    return reimbursements.filter((reimbursement) => {
      const matchesSearch = reimbursement.requestNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesTab = activeTab === 'all' || reimbursement.status === activeTab
      return matchesSearch && matchesTab
    })
  }, [reimbursements, searchTerm, activeTab])

  const { contracts } = useContract()

  const handleTabChange = (value: string) => {
    setActiveTab(value as ReimbursementStatus | 'all')
  }

  const canReview = (status: ReimbursementStatus) => {
    return [ReimbursementStatus.SUBMITTED, ReimbursementStatus.UNDER_REVIEW].includes(status)
  }

  const toggleItemExpansion = (reimbursementId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [reimbursementId]: !prev[reimbursementId],
    }))
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Reembolsos</h1>
        {!isReviewer && (
          <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={20} />
            Nueva Solicitud
          </Button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Buscar por número de solicitud..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value={ReimbursementStatus.SUBMITTED}>Enviados</TabsTrigger>
          <TabsTrigger value={ReimbursementStatus.UNDER_REVIEW}>En Revisión</TabsTrigger>
          <TabsTrigger value={ReimbursementStatus.APPROVED}>Aprobados</TabsTrigger>
          <TabsTrigger value={ReimbursementStatus.PARTIALLY_APPROVED}>
            Parcialmente Aprobados
          </TabsTrigger>
          <TabsTrigger value={ReimbursementStatus.REJECTED}>Rechazados</TabsTrigger>
          <TabsTrigger value={ReimbursementStatus.PAID}>Pagados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : filteredReimbursements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No se encontraron reembolsos</div>
            ) : (
              filteredReimbursements.map((reimbursement) => (
                <Card key={reimbursement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            Solicitud #{reimbursement.requestNumber}
                          </h3>
                          <Badge className={getStatusColor(reimbursement.status)}>
                            {getEnumLabel(reimbursement.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Creado el{' '}
                          {format(new Date(reimbursement.createdAt), 'PPP', { locale: es })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${reimbursement.totalRequestedAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{reimbursement.items.length} items</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between"
                        onClick={() => toggleItemExpansion(reimbursement.id)}
                      >
                        <span>Ver Items</span>
                        {expandedItems[reimbursement.id] ? (
                          <IconChevronUp size={20} />
                        ) : (
                          <IconChevronDown size={20} />
                        )}
                      </Button>

                      {expandedItems[reimbursement.id] && (
                        <div className="mt-4 space-y-4">
                          {reimbursement.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-4 border rounded-lg bg-gray-50 space-y-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <Badge className={getItemStatusColor(item.status)}>
                                    {getEnumLabel(item.status)}
                                  </Badge>
                                  <p className="mt-1 text-sm font-medium">{item.type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    ${item.requestedAmount.toLocaleString()}
                                  </p>
                                  {item.approvedAmount > 0 && (
                                    <p className="text-sm text-green-600">
                                      ${item.approvedAmount.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <p className="text-xs text-gray-500">
                                Fecha de servicio:{' '}
                                {format(new Date(item.serviceDate), 'PPP', { locale: es })}
                              </p>
                              {item.rejectionReason && (
                                <p className="text-sm text-red-600">{item.rejectionReason}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {isReviewer && canReview(reimbursement.status) && (
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReimbursement(reimbursement.id)}
                        >
                          Revisar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ReimbursementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contracts={contracts || ([] as any)}
      />

      {selectedReimbursement && (
        <ReimbursementReviewModal
          isOpen={!!selectedReimbursement}
          onClose={() => setSelectedReimbursement(null)}
          reimbursement={reimbursements.find((r) => r.id === selectedReimbursement)!}
        />
      )}
    </div>
  )
}
