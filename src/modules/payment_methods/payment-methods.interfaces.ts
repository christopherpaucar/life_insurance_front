export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

export interface IPaymentMethod {
  id: string
  type: PaymentMethodType
  details: Record<string, any>
  isValid: boolean
  isDefault: boolean
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: string
}

export interface CreatePaymentMethodDto {
  type: PaymentMethodType
  details: Record<string, any>
  isDefault: boolean
}
