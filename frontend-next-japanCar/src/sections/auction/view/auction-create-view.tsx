'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { AuctionCreateEditForm } from '../auction-create-edit-form';
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

export function AuctionCreateView() {
  const { currentLang, t: tCommon } = useTranslate('common');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('auction.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('auction.auction'), href: paths.dashboard.auction.root },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuctionCreateEditForm lang={currentLang.value} />
    </DashboardContent>
  );
}
