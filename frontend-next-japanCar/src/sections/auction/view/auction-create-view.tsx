'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { AuctionCreateEditForm } from '../auction-create-edit-form';

// ----------------------------------------------------------------------

export function AuctionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new auction"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Auction', href: paths.dashboard.auction.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuctionCreateEditForm />
    </DashboardContent>
  );
}
