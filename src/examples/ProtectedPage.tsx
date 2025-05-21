'use client';

import { RoleType } from '@/modules/auth/auth.interfaces';
import { RoleGuard } from '@/components/layouts/RoleGuard';

export default function ProtectedAdminPage() {
  return (
    <RoleGuard allowedRoles={[RoleType.ADMIN, RoleType.SUPER_ADMIN]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Protected Page</h1>
        <p>This page is only accessible to users with Admin or Super Admin roles.</p>
      </div>
    </RoleGuard>
  );
}
