'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { useTranslate } from '@/locales';
import { CustomerCreateEditForm } from '../customer-create-edit-form';

// ----------------------------------------------------------------------

export function CustomerCreateView() {
  const { t: tCommon } = useTranslate('common');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('customer.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('customer.customers'), href: paths.dashboard.user.root },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CustomerCreateEditForm />
    </DashboardContent>
  );
}
