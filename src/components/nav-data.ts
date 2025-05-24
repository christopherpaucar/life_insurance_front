import {
  IconDashboard,
  IconHelp,
  IconReport,
  IconSettings,
  IconUsers,
  IconKey,
  IconShieldCheck,
  IconHeartHandshake,
  IconClipboardList,
  IconWallet,
  IconReportMedical,
  IconUser,
} from '@tabler/icons-react'
import { NavItem, PERMISSIONS, RoleType } from '@/modules/auth/auth.interfaces'

// Admin navigation
export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: IconDashboard,
  },
  {
    title: 'Gestión de Roles',
    url: '/admin/roles',
    icon: IconKey,
  },
  {
    title: 'Gestión de Seguros',
    url: '/admin/insurance',
    icon: IconShieldCheck,
  },
  {
    title: 'Gestión de Usuarios',
    url: '/admin/users',
    icon: IconUsers,
  },
  {
    title: 'Contratación de Seguros',
    url: '/admin/contracts',
    icon: IconHeartHandshake,
  },
  {
    title: 'Revisión de Reembolsos',
    url: '/admin/reimbursements',
    icon: IconClipboardList,
  },
  {
    title: 'Historial de Pagos',
    url: '/admin/payments',
    icon: IconWallet,
  },
  {
    title: 'Solicitud de Reembolsos',
    url: '/admin/client-reimbursements',
    icon: IconReportMedical,
  },
  {
    title: 'Reportes',
    url: '/admin/reports',
    icon: IconReport,
    items: [
      {
        title: 'Seguros Impagos',
        url: '/admin/reports/unpaid',
      },
      {
        title: 'Contratos por Cliente',
        url: '/admin/reports/contracts-by-client',
      },
      {
        title: 'Solicitudes Pendientes',
        url: '/admin/reports/pending-requests',
      },
      {
        title: 'Contratos por Vencer',
        url: '/admin/reports/expiring-contracts',
      },
    ],
  },
]

export const agentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/agent/dashboard',
    icon: IconDashboard,
    permissions: PERMISSIONS[RoleType.AGENT],
  },
  {
    title: 'Contratación de Seguros',
    url: '/agent/insurance-review',
    icon: IconHeartHandshake,
    permissions: PERMISSIONS[RoleType.AGENT],
  },
  {
    title: 'Revisión de Reembolsos',
    url: '/agent/reimbursements',
    icon: IconClipboardList,
    permissions: PERMISSIONS[RoleType.AGENT],
  },
  {
    title: 'Reportes',
    url: '/agent/reports',
    icon: IconReport,
    permissions: PERMISSIONS[RoleType.AGENT],
    items: [
      {
        title: 'Seguros Impagos',
        url: '/agent/reports/unpaid',
      },
      {
        title: 'Contratos por Cliente',
        url: '/agent/reports/contracts-by-client',
      },
      {
        title: 'Solicitudes Pendientes',
        url: '/agent/reports/pending-requests',
      },
      {
        title: 'Contratos por Vencer',
        url: '/agent/reports/expiring-contracts',
      },
    ],
  },
]

export const clientNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/client/dashboard',
    icon: IconDashboard,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Planes de Seguro',
    url: '/client/insurances',
    icon: IconShieldCheck,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Mis Seguros',
    url: '/client/my-insurances',
    icon: IconHeartHandshake,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Historial de Pagos',
    url: '/client/payments',
    icon: IconWallet,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Solicitud de Reembolsos',
    url: '/client/reimbursements',
    icon: IconReportMedical,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
]

// Common secondary navigation
export const secondaryNavItems: NavItem[] = [
  {
    title: 'Mi Perfil',
    url: '/profile',
    icon: IconUser,
  },
  {
    title: 'Configuración',
    url: '/settings',
    icon: IconSettings,
  },
  {
    title: 'Ayuda',
    url: '/help',
    icon: IconHelp,
  },
]
