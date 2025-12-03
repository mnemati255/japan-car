'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { RoleCreateEditForm } from '../role-create-edit-form';
import { IRoleItem } from '@/types/role';
import { useEffect, useState } from 'react';
import { getRoleById } from '@/actions/role';

// ----------------------------------------------------------------------

type Props = {
  roleId?: number;
};

export function RoleEditView({ roleId }: Props) {
  const [currentRole, setCurrentRole] = useState<IRoleItem | null>(null);

  useEffect(() => {
    if (roleId) {
      const getRole = async () => {
        const { status, data } = await getRoleById(roleId);
        if (status === 200) {
          setCurrentRole(data);
        }
      };
      getRole();
    }
  }, [roleId]);

  if (!currentRole) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.role.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Role', href: paths.dashboard.role.root },
          { name: currentRole?.roleName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoleCreateEditForm currentRole={currentRole} />
    </DashboardContent>
  );
}
