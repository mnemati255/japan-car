'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { RoleCreateEditForm } from '../role-create-edit-form';
import { IRoleItem } from '@/types/role';

// ----------------------------------------------------------------------

type Props = {
  role?: IRoleItem;
};

export function RoleEditView({ role: currentRole }: Props) {
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
