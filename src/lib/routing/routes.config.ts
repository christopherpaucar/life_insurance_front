import { RoleType } from '@/modules/auth/auth.interfaces'

export interface RouteConfig {
  path: string
  public: boolean
  exact?: boolean
  allowedRoles?: RoleType[]
  defaultRedirect?: string
}

export interface RoleRouteMap {
  [RoleType.SUPER_ADMIN]: string
  [RoleType.ADMIN]: string
  [RoleType.AGENT]: string
  [RoleType.CLIENT]: string
  [RoleType.REVIEWER]: string
}

// Default landing pages for each role
export const roleDefaultRoutes: RoleRouteMap = {
  [RoleType.SUPER_ADMIN]: '/admin/dashboard',
  [RoleType.ADMIN]: '/admin/dashboard',
  [RoleType.AGENT]: '/agent/dashboard',
  [RoleType.CLIENT]: '/client/dashboard',
  [RoleType.REVIEWER]: '/reviewer/dashboard',
}

// Public routes that don't require authentication
export const publicRoutes: RouteConfig[] = [
  { path: '/login', public: true },
  { path: '/register', public: true },
  { path: '/about', public: true },
]

// Private routes with role-based access control
export const privateRoutes: RouteConfig[] = [
  // Dashboard route - to be redirected based on role
  {
    path: '/dashboard',
    public: false,
    allowedRoles: [],
    defaultRedirect: '/login',
  },

  // Root path - redirect based on role
  {
    path: '/',
    public: false,
    exact: true,
    defaultRedirect: '/login',
  },

  // Common user routes
  { path: '/profile', public: false },
  { path: '/onboarding', public: false },
  { path: '/user/profile', public: false },
  { path: '/user/settings', public: false },

  // Admin routes
  { path: '/admin', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },
  { path: '/admin/dashboard', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },
  { path: '/admin/users', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },
  { path: '/admin/settings', public: false, allowedRoles: [RoleType.ADMIN, RoleType.SUPER_ADMIN] },

  // Client routes
  { path: '/client', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/dashboard', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/policies', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/claims', public: false, allowedRoles: [RoleType.CLIENT] },
  { path: '/client/payments', public: false, allowedRoles: [RoleType.CLIENT] },

  // Agent routes
  { path: '/agent', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/dashboard', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/clients', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/policies', public: false, allowedRoles: [RoleType.AGENT] },
  { path: '/agent/sales', public: false, allowedRoles: [RoleType.AGENT] },

  // Reviewer routes
  { path: '/reviewer', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/dashboard', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/claims', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/policies', public: false, allowedRoles: [RoleType.REVIEWER] },
  { path: '/reviewer/reports', public: false, allowedRoles: [RoleType.REVIEWER] },
]

// Combine all routes for easier access
export const allRoutes = [...publicRoutes, ...privateRoutes]
