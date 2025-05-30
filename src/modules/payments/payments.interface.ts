import { Contract } from '../contracts/contract.interfaces'
import { IPaymentMethod } from '../payment_methods/payment-methods.interfaces'

export interface ITransaction {
  id: string
  amount: number
  status: string
  createdAt: Date
  updatedAt: Date
  contractId: string
  paymentMethodId: string
  retryCount: number
  nextPaymentDate: Date
  nextRetryPaymentDate: Date
  paymentMethod: IPaymentMethod
  contract: Contract
}
