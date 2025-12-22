'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { useTranslate } from '@/locales';
import { ICustomer } from '@/types/customer';
import { getItemById } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { CustomerCreateEditForm } from '../customer-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  customerId?: number;
};

export function CustomerEditView({ customerId }: Props) {
  const [currentCustomer, setCurrentCustomer] = useState<ICustomer>();
  const { t: tCommon } = useTranslate('common');

  useEffect(() => {
    if (customerId) {
      const getCustomer = async () => {
        const { status, data } = await getItemById<ICustomer>(
          endpoints.customer,
          customerId
        );
        if (status === 200) {
          setCurrentCustomer(data);
        }
      };
      getCustomer();
    }
  }, [customerId]);

  if (!currentCustomer) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('edit')}
        backHref={paths.dashboard.customer.root}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('customer.customer'), href: paths.dashboard.customer.root },
          { name: `${currentCustomer?.firstName} ${currentCustomer?.lastName}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CustomerCreateEditForm currentCustomer={currentCustomer} />
    </DashboardContent>
  );
}
