'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { RoleCreateEditForm } from '../role-create-edit-form';
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

export function RoleCreateView() {
  const { t: tCommon } = useTranslate('common');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('role.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('role.role'), href: paths.dashboard.role.root },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoleCreateEditForm />
    </DashboardContent>
  );
}
