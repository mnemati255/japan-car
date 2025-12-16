'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { IBrand, IColor } from '@/types/car';
import { getBrands, getColors } from '@/actions/base-info';
import { CreateEditCarForm } from '../car-create-edit-form';
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
};

export function CarCreateView({ auctionId }: Props) {
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const { t: tCommon } = useTranslate('common');

  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes] = await Promise.all([getBrands(), getColors()]);
      if (brandsRes.status === 200) setBrands(brandsRes.data.items);
      if (colorsRes.status === 200) setColors(colorsRes.data.items);
    })();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('car.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('car.cars'), href: paths.dashboard.car.root },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CreateEditCarForm colors={colors} brands={brands} auctionId={auctionId} />
    </DashboardContent>
  );
}
