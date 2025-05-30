import { InsuranceType, PaymentFrequency, Relationship } from '../enums/insurance.enums'

const enumLabels = {
  [InsuranceType.LIFE]: 'Vida',
  [InsuranceType.HEALTH]: 'Salud',
  [PaymentFrequency.MONTHLY]: 'Mensual',
  [PaymentFrequency.QUARTERLY]: 'Trimestral',
  [PaymentFrequency.ANNUAL]: 'Anual',
  [Relationship.SPOUSE]: 'Cónyuge',
  [Relationship.CHILD]: 'Hijo',
  [Relationship.PARENT]: 'Padre',
  [Relationship.SIBLING]: 'Hermano',
  [Relationship.OTHER]: 'Otro',
}

export const getEnumLabel = (enumValue: string) => {
  return enumLabels[enumValue as keyof typeof enumLabels]
}
