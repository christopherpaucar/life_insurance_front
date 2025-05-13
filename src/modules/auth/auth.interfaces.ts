export interface IAuthResponse {
  user: IUser
  token: string
}

export interface IUser {
  id: string
  name: string
  email: string
  roles: {
    id: string
    name: string
    permissions: string[]
  }[]
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

export enum Permission {
  // Admin permissions
  MANAGE_ROLES = 'manage_roles',
  MANAGE_INSURANCE = 'manage_insurance',

  // Agent & Admin permissions
  MANAGE_CLIENTS = 'manage_clients',
  MANAGE_CONTRACTS = 'manage_contracts',
  REVIEW_REIMBURSEMENTS = 'review_reimbursements',
  VIEW_REPORTS = 'view_reports',

  // Client permissions
  MANAGE_OWN_CONTRACTS = 'manage_own_contracts',
  VIEW_PAYMENT_HISTORY = 'view_payment_history',
  SUBMIT_REIMBURSEMENT = 'submit_reimbursement',
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role: RoleType | string // Allow string to be more flexible
}

export interface NavItem {
  title: string
  url: string
  icon?: React.FC<any>
  permissions?: Permission[]
  items?: Omit<NavItem, 'icon' | 'items'>[]
}
