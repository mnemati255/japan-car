'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { AuctionCreateEditForm } from '../auction-create-edit-form';
import { IAuctionItem } from '@/types/auction';
import { useEffect, useState } from 'react';
import { getAuctionById } from '@/actions/auction';

// ----------------------------------------------------------------------

type Props = {
  auctionId?: number;
};

export function AuctionEditView({ auctionId }: Props) {
  const [currentAuction, setCurrentAuction] = useState<IAuctionItem | null>(null);

  useEffect(() => {
    if (auctionId) {
      const getAuction = async () => {
        const { status, data } = await getAuctionById(auctionId);
        if (status === 200) {
          setCurrentAuction(data);
        }
      };
      getAuction();
    }
  }, [auctionId]);

  if (!currentAuction) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.auction.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Auction', href: paths.dashboard.auction.root },
          { name: currentAuction?.auctionName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuctionCreateEditForm currentAuction={currentAuction} />
    </DashboardContent>
  );
}
