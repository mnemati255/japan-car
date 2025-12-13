'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { UserCreateEditForm } from '../user-create-edit-form';
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

export function UserCreateView() {
  const { t: tCommon } = useTranslate('common');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('user.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('user.user'), href: paths.dashboard.user.root },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateEditForm />
    </DashboardContent>
  );
}
