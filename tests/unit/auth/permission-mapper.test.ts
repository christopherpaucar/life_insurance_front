import { describe, it, expect } from 'vitest'
import { mapPermissions } from '@/modules/auth/permission-mapper'
import { Permission } from '@/modules/auth/auth.interfaces'

describe('permission-mapper', () => {
  it('debe mapear permisos del backend a permisos del frontend', () => {
    const backendPermissions = ['role:create', 'insurance:read', 'client:update', 'report:view']
    const expectedFrontendPermissions = [
      Permission.MANAGE_ROLES,
      Permission.MANAGE_INSURANCE,
      Permission.MANAGE_CLIENTS,
      Permission.VIEW_REPORTS
    ]
    const result = mapPermissions(backendPermissions)
    expect(result).toEqual(expectedFrontendPermissions)
  })

  it('debe ignorar permisos no mapeados', () => {
    const backendPermissions = ['role:create', 'unknown:permission', 'insurance:read']
    const expectedFrontendPermissions = [
      Permission.MANAGE_ROLES,
      Permission.MANAGE_INSURANCE
    ]
    const result = mapPermissions(backendPermissions)
    expect(result).toEqual(expectedFrontendPermissions)
  })

  it('debe devolver un array vacío si no hay permisos', () => {
    const backendPermissions: string[] = []
    const result = mapPermissions(backendPermissions)
    expect(result).toEqual([])
  })
}) 