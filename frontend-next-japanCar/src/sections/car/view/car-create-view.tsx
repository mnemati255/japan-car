'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { IBrand, IColor } from '@/types/car';
import { getBrands, getColors } from '@/actions/base-info';
import { CreateEditCarForm } from '../car-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
};

export function CreateCarView({ auctionId }: Props) {
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);

  useEffect(() => {
    const getBaseInfo = async () => {
      const { status, data } = await getColors();
      if (status == 200) setColors(data.items);

      const { status: status2, data: data2 } = await getBrands();
      if (status2 == 200) setBrands(data2.items);
    };
    getBaseInfo();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new car"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cars', href: paths.dashboard.car.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CreateEditCarForm colors={colors} brands={brands} auctionId={auctionId} />
    </DashboardContent>
  );
}
