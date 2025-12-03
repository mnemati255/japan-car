'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { AuctionCreateEditCarForm } from '../auction-create-edit-car-form';
import { useEffect, useState } from 'react';
import { IColor, IModel } from '@/types/car';
import { getColors, getModels } from '@/actions/base-info';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
};

export function AuctionCreateCarView({ auctionId }: Props) {
  const [colors, setColors] = useState<IColor[]>([]);
  const [models, setModels] = useState<IModel[]>([]);

  useEffect(() => {
    const getBaseInfo = async () => {
      const { status, data } = await getColors();
      if (status == 200) setColors(data);

      const { status: status2, data: data2 } = await getModels();
      if (status2 == 200) setModels(data2);
    };
    getBaseInfo();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new car"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Auction', href: paths.dashboard.auction.root },
          { name: 'Cars', href: paths.dashboard.auction.cars(auctionId) },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AuctionCreateEditCarForm colors={colors} models={models} auctionId={auctionId} />
    </DashboardContent>
  );
}
