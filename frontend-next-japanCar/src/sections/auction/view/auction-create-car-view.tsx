'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { IBrand, IColor } from '@/types/car';
import { CreateEditCarForm } from '@/sections/car/car-create-edit-form';
import { useTranslate } from '@/locales';
import { getItems } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { IGrid } from '@/types/common';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
};

export function AuctionCreateCarView({ auctionId }: Props) {
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const { t: tCommon } = useTranslate('common');
  
  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes] = await Promise.all([
        getItems<IGrid<IBrand>>(endpoints.baseInfo.brand),
        getItems<IGrid<IColor>>(endpoints.baseInfo.color),
      ]);
      if(brandsRes.status == 200) setBrands(brandsRes.data.items);
      if(colorsRes.status == 200) setColors(colorsRes.data.items);
    })();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('car.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('auction.auction'), href: paths.dashboard.auction.root },
          { name: tCommon('car.cars'), href: paths.dashboard.auction.cars(auctionId) },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* <CreateEditCarForm colors={colors} brands={brands} auctionId={auctionId} /> */}
    </DashboardContent>
  );
}
