import { Permission } from './auth.interfaces'

// Map backend permission strings to frontend Permission enum values
const PERMISSION_MAP: Record<string, Permission> = {
  // Admin permissions
  'role:create': Permission.MANAGE_ROLES,
  'role:read': Permission.MANAGE_ROLES,
  'role:update': Permission.MANAGE_ROLES,
  'role:delete': Permission.MANAGE_ROLES,

  'insurance:create': Permission.MANAGE_INSURANCE,
  'insurance:read': Permission.MANAGE_INSURANCE,
  'insurance:update': Permission.MANAGE_INSURANCE,
  'insurance:delete': Permission.MANAGE_INSURANCE,

  // Agent & Admin permissions
  'client:create': Permission.MANAGE_CLIENTS,
  'client:read': Permission.MANAGE_CLIENTS,
  'client:update': Permission.MANAGE_CLIENTS,
  'client:delete': Permission.MANAGE_CLIENTS,

  'contract:create': Permission.MANAGE_CONTRACTS,
  'contract:read': Permission.MANAGE_CONTRACTS,
  'contract:update': Permission.MANAGE_CONTRACTS,
  'contract:delete': Permission.MANAGE_CONTRACTS,

  'reimbursement:approve': Permission.REVIEW_REIMBURSEMENTS,
  'reimbursement:reject': Permission.REVIEW_REIMBURSEMENTS,

  'report:view': Permission.VIEW_REPORTS,

  // Client permissions
  'contract:sign': Permission.MANAGE_OWN_CONTRACTS,
  'contract:upload': Permission.MANAGE_OWN_CONTRACTS,

  'payment:view': Permission.VIEW_PAYMENT_HISTORY,

  'reimbursement:create': Permission.SUBMIT_REIMBURSEMENT,
  'reimbursement:upload': Permission.SUBMIT_REIMBURSEMENT,

  // Super admin permissions
  'all:create': Permission.MANAGE_ROLES,
  'all:read': Permission.MANAGE_ROLES,
  'all:update': Permission.MANAGE_ROLES,
  'all:delete': Permission.MANAGE_ROLES,
  'all:manage': Permission.MANAGE_ROLES,
}

/**
 * Maps backend permission strings to frontend Permission enum values
 */
export function mapPermissions(backendPermissions: string[]): Permission[] {
  const frontendPermissions = new Set<Permission>()

  backendPermissions.forEach((permission) => {
    const mappedPermission = PERMISSION_MAP[permission]
    if (mappedPermission) {
      frontendPermissions.add(mappedPermission)
    }
  })

  return Array.from(frontendPermissions)
}
