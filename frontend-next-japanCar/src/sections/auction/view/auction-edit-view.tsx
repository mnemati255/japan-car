'use client';

import type { IUserItem } from '@/types/user';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { AuctionCreateEditForm } from '../auction-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  auction?: IUserItem;
};

export function AuctionEditView({ auction: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.user.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: currentUser?.userName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuctionCreateEditForm currentAuction={currentUser} />
    </DashboardContent>
  );
}
