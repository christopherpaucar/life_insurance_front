import { useState } from 'react'
import { ContractStatus, AttachmentType } from '../contract.interfaces'

export function useContractState() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<AttachmentType | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handleStatusChange = (status: ContractStatus) => {
    setSelectedStatus(status)
    setShowConfirmModal(true)
  }

  const confirmStatusChange = (onConfirm: () => void, confirmAgent: () => void) => {
    if (selectedStatus) {
      if (selectedStatus === ContractStatus.AWAITING_CLIENT_CONFIRMATION) {
        confirmAgent()
      } else {
        onConfirm()
      }

      setShowConfirmModal(false)
      setSelectedStatus(null)
    }
  }

  return {
    activeTab,
    setActiveTab,
    showConfirmModal,
    setShowConfirmModal,
    selectedStatus,
    setSelectedStatus,
    selectedDocType,
    setSelectedDocType,
    showPaymentForm,
    setShowPaymentForm,
    handleStatusChange,
    confirmStatusChange,
  }
}
