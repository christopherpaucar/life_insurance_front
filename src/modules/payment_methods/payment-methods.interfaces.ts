export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

export interface IPaymentMethod {
  id: string
  type: PaymentMethodType
  name: string
  details: Record<string, any>
  isValid: boolean
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: string
}
