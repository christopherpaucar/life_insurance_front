import { ContractStatus } from '../../modules/contracts/contract.interfaces'
import {
  InsuranceType,
  PaymentFrequency,
  Relationship,
} from '../../modules/insurances/enums/insurance.enums'
import {
  ReimbursementItemStatus,
  ReimbursementItemType,
  ReimbursementStatus,
} from '../../modules/reimbursements/reimbursements.interfaces'

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
  [ContractStatus.ACTIVE]: 'Activo',
  [ContractStatus.INACTIVE]: 'Inactivo',
  [ContractStatus.EXPIRED]: 'Expirado',
  [ContractStatus.CANCELLED]: 'Cancelado',
  [ReimbursementStatus.SUBMITTED]: 'Enviado',
  [ReimbursementStatus.UNDER_REVIEW]: 'En revisión',
  [ReimbursementStatus.APPROVED]: 'Aprobado',
  [ReimbursementStatus.REJECTED]: 'Rechazado',
  [ReimbursementStatus.PAID]: 'Pagado',
  [ReimbursementStatus.PARTIALLY_APPROVED]: 'Parcialmente aprobado',
  [ReimbursementItemStatus.PENDING]: 'Pendiente',
  [ReimbursementItemType.CONSULTATION]: 'Consulta',
  [ReimbursementItemType.MEDICATION]: 'Medicamento',
  [ReimbursementItemType.SURGERY]: 'Cirugía',
  [ReimbursementItemType.DIAGNOSTIC]: 'Examen de diagnóstico',
  [ReimbursementItemType.HOSPITALIZATION]: 'Hospitalización',
}

export const getEnumLabel = (enumValue: string) => {
  return enumLabels[enumValue as keyof typeof enumLabels]
}
