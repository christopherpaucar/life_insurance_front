import { useState } from 'react'
import { PaymentMethodType } from '../hooks/useContract'

interface PaymentFormData {
  paymentMethodType: PaymentMethodType
  paymentDetails: {
    cardNumber: string
    cardHolderName: string
    cardExpirationDate: string
    cardCvv: string
  }
  p12File: File
}

export const usePaymentForm = (onSubmit: (data: PaymentFormData) => void) => {
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolderName, setCardHolderName] = useState('')
  const [cardExpirationDate, setCardExpirationDate] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [p12File, setP12File] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!p12File) return

    onSubmit({
      paymentMethodType: PaymentMethodType.CREDIT_CARD,
      paymentDetails: {
        cardNumber,
        cardHolderName,
        cardExpirationDate,
        cardCvv,
      },
      p12File,
    })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  return {
    cardNumber,
    setCardNumber,
    cardHolderName,
    setCardHolderName,
    cardExpirationDate,
    setCardExpirationDate,
    cardCvv,
    setCardCvv,
    p12File,
    setP12File,
    handleSubmit,
    formatCardNumber,
    formatExpirationDate,
  }
}
