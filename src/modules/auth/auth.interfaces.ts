/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAuthResponse {
  user: IUser
  token: string
}

export interface IUser {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
  onboardingCompleted: boolean
  birthDate?: Date
  bloodType?: BloodType
  gender?: string
  height?: number
  weight?: number
  address?: string
  phoneNumber?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalHistory?: Record<string, any>
  lifestyle?: Record<string, any>
}

export interface IOnboarding {
  birthDate: Date
  bloodType: BloodType
  gender: string
  height: number
  weight: number
  address: string
  phoneNumber: string
  emergencyContact: string
  emergencyPhone: string
  medicalHistory?: Record<string, any>
  lifestyle?: Record<string, any>
}

export interface LoginDto {
  email: string
  password: string
}

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMINISTRADOR',
  REVIEWER = 'REVISOR',
  CLIENT = 'CLIENTE',
  AGENT = 'AGENTE',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role: RoleType
}

export interface NavItem {
  title: string
  url: string
  icon?: React.FC<any>
  permissions?: string[]
  items?: Omit<NavItem, 'icon' | 'items'>[]
}

export enum ALL_PERMISSIONS {
  CREATE = 'all:create',
  READ = 'all:read',
  UPDATE = 'all:update',
  DELETE = 'all:delete',
  MANAGE = 'all:manage',
}

export enum CLIENT_PERMISSIONS {
  CREATE = 'client:create',
  READ = 'agent:read',
  UPDATE = 'agent:update',
  DELETE = 'agent:delete',
  MANAGE = 'agent:manage',
}

export enum ROLE_PERMISSIONS {
  READ = 'role:read',
  CREATE = 'role:create',
  UPDATE = 'role:update',
  DELETE = 'role:delete',
  MANAGE = 'role:manage',
}

export enum INSURANCE_PERMISSIONS {
  READ = 'insurance:read',
  CREATE = 'insurance:create',
  UPDATE = 'insurance:update',
  DELETE = 'insurance:delete',
  MANAGE = 'insurance:manage',
}

export enum CONTRACT_PERMISSIONS {
  READ = 'contract:read',
  CREATE = 'contract:create',
  UPDATE = 'contract:update',
  DELETE = 'contract:delete',
  MANAGE = 'contract:manage',
  SIGN = 'contract:sign',
  UPLOAD = 'contract:upload',
}

export enum REIMBURSEMENT_PERMISSIONS {
  READ = 'reimbursement:read',
  CREATE = 'reimbursement:create',
  UPDATE = 'reimbursement:update',
  DELETE = 'reimbursement:delete',
  MANAGE = 'reimbursement:manage',
  APPROVE = 'reimbursement:approve',
  REJECT = 'reimbursement:reject',
  UPLOAD = 'reimbursement:upload',
}

enum REPORT_PERMISSIONS {
  VIEW = 'report:view',
}

enum PAYMENT_PERMISSIONS {
  VIEW = 'payment:view',
}

export const PERMISSIONS = {
  [RoleType.SUPER_ADMIN]: [
    ALL_PERMISSIONS.CREATE,
    ALL_PERMISSIONS.READ,
    ALL_PERMISSIONS.UPDATE,
    ALL_PERMISSIONS.DELETE,
    ALL_PERMISSIONS.MANAGE,
  ],
  [RoleType.ADMIN]: [
    ROLE_PERMISSIONS.READ,
    ROLE_PERMISSIONS.CREATE,
    ROLE_PERMISSIONS.UPDATE,
    ROLE_PERMISSIONS.DELETE,
    INSURANCE_PERMISSIONS.READ,
    INSURANCE_PERMISSIONS.CREATE,
    INSURANCE_PERMISSIONS.UPDATE,
    INSURANCE_PERMISSIONS.DELETE,
    CLIENT_PERMISSIONS.READ,
    CLIENT_PERMISSIONS.CREATE,
    CLIENT_PERMISSIONS.UPDATE,
    CLIENT_PERMISSIONS.DELETE,
    CONTRACT_PERMISSIONS.READ,
    CONTRACT_PERMISSIONS.CREATE,
    CONTRACT_PERMISSIONS.UPDATE,
    CONTRACT_PERMISSIONS.DELETE,
    REIMBURSEMENT_PERMISSIONS.READ,
    REIMBURSEMENT_PERMISSIONS.APPROVE,
    REIMBURSEMENT_PERMISSIONS.REJECT,
    REPORT_PERMISSIONS.VIEW,
  ],
  [RoleType.AGENT]: [
    CLIENT_PERMISSIONS.READ,
    CLIENT_PERMISSIONS.CREATE,
    CLIENT_PERMISSIONS.UPDATE,
    CLIENT_PERMISSIONS.DELETE,
    CONTRACT_PERMISSIONS.READ,
    CONTRACT_PERMISSIONS.CREATE,
    CONTRACT_PERMISSIONS.UPDATE,
    CONTRACT_PERMISSIONS.DELETE,
    REIMBURSEMENT_PERMISSIONS.READ,
    REIMBURSEMENT_PERMISSIONS.APPROVE,
    REIMBURSEMENT_PERMISSIONS.REJECT,
    REPORT_PERMISSIONS.VIEW,
  ],
  [RoleType.REVIEWER]: [
    CLIENT_PERMISSIONS.READ,
    CONTRACT_PERMISSIONS.READ,
    REIMBURSEMENT_PERMISSIONS.READ,
    REIMBURSEMENT_PERMISSIONS.APPROVE,
    REIMBURSEMENT_PERMISSIONS.REJECT,
  ],
  [RoleType.CLIENT]: [
    CONTRACT_PERMISSIONS.READ,
    CONTRACT_PERMISSIONS.SIGN,
    CONTRACT_PERMISSIONS.UPLOAD,
    PAYMENT_PERMISSIONS.VIEW,
    REIMBURSEMENT_PERMISSIONS.CREATE,
    REIMBURSEMENT_PERMISSIONS.READ,
    REIMBURSEMENT_PERMISSIONS.UPLOAD,
    INSURANCE_PERMISSIONS.READ,
  ],
}
