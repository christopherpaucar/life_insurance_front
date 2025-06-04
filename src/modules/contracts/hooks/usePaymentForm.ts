import { useState } from 'react'
import { IPaymentMethod } from '../../payment_methods/payment-methods.interfaces'

interface PaymentFormData {
  paymentMethod: IPaymentMethod
  p12File: File
}

export const usePaymentForm = (onSubmit: (data: PaymentFormData) => void) => {
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>(null)
  const [p12File, setP12File] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!p12File || !paymentMethod) return

    onSubmit({
      paymentMethod,
      p12File,
    })
  }

  return {
    paymentMethod,
    setPaymentMethod,
    p12File,
    setP12File,
    handleSubmit,
  }
}
