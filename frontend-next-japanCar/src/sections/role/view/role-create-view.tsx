'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { RoleCreateEditForm } from '../role-create-edit-form';

// ----------------------------------------------------------------------

export function RoleCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new role"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Role', href: paths.dashboard.role.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoleCreateEditForm />
    </DashboardContent>
  );
}
