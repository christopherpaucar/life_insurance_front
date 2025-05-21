'use client';

import React from 'react';
import { RoleType } from '@/modules/auth/auth.interfaces';
import { RoleGuard } from '@/components/layouts/RoleGuard';
import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[RoleType.ADMIN, RoleType.SUPER_ADMIN]}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </RoleGuard>
  );
}
