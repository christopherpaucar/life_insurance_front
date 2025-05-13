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
import { NavItem, Permission } from '@/modules/auth/auth.interfaces'

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
    title: 'Gestión de Clientes',
    url: '/admin/clients',
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

// Agent navigation
export const agentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/agent/dashboard',
    icon: IconDashboard,
    permissions: [Permission.MANAGE_CLIENTS, Permission.MANAGE_CONTRACTS],
  },
  {
    title: 'Gestión de Clientes',
    url: '/agent/clients',
    icon: IconUsers,
    permissions: [Permission.MANAGE_CLIENTS],
  },
  {
    title: 'Contratación de Seguros',
    url: '/agent/contracts',
    icon: IconHeartHandshake,
    permissions: [Permission.MANAGE_CONTRACTS],
  },
  {
    title: 'Revisión de Reembolsos',
    url: '/agent/reimbursements',
    icon: IconClipboardList,
    permissions: [Permission.REVIEW_REIMBURSEMENTS],
  },
  {
    title: 'Reportes',
    url: '/agent/reports',
    icon: IconReport,
    permissions: [Permission.VIEW_REPORTS],
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

// Client navigation
export const clientNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/client/dashboard',
    icon: IconDashboard,
    permissions: [Permission.MANAGE_OWN_CONTRACTS, Permission.VIEW_PAYMENT_HISTORY],
  },
  {
    title: 'Mis Seguros',
    url: '/client/contracts',
    icon: IconHeartHandshake,
    permissions: [Permission.MANAGE_OWN_CONTRACTS],
  },
  {
    title: 'Historial de Pagos',
    url: '/client/payments',
    icon: IconWallet,
    permissions: [Permission.VIEW_PAYMENT_HISTORY],
  },
  {
    title: 'Solicitud de Reembolsos',
    url: '/client/reimbursements',
    icon: IconReportMedical,
    permissions: [Permission.SUBMIT_REIMBURSEMENT],
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
