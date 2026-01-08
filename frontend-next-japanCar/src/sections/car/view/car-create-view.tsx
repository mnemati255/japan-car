'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { IBrand, IColor } from '@/types/car';
import { useTranslate } from '@/locales';
import { IAuction } from '@/types/auction';
import { getItems } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { IGrid } from '@/types/common';
import { IUser } from '@/types/user';
import CarCreateEditForm from '../car-create-edit-form';
import { ICustomer } from '@/types/customer';

// ----------------------------------------------------------------------

export function CarCreateView() {
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [auctions, setAuctions] = useState<IAuction[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const { t: tCommon } = useTranslate('common');

  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes, auctionsRes, usersRes, customersRes] =
        await Promise.all([
          getItems<IGrid<IBrand>>(endpoints.baseInfo.brand),
          getItems<IGrid<IColor>>(endpoints.baseInfo.color),
          getItems<IGrid<IAuction>>(endpoints.baseInfo.auction),
          getItems<IUser[]>(endpoints.user),
          getItems<IGrid<ICustomer>>(endpoints.customer),
        ]);
      if (brandsRes.status === 200) setBrands(brandsRes.data.items);
      if (colorsRes.status === 200) setColors(colorsRes.data.items);
      if (auctionsRes.status === 200) setAuctions(auctionsRes.data.items);
      if (usersRes.status === 200) setUsers(usersRes.data);
      if (customersRes.status === 200) setCustomers(customersRes.data.items);
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
      <CarCreateEditForm
        auctions={auctions}
        brands={brands}
        colors={colors}
        users={users}
        customers={customers}
      />
      {/* <CreateEditCarForm2
        colors={colors}
        brands={brands}
        auctionId={auctionId}
        auctions={auctions}
        users={users}
      /> */}
    </DashboardContent>
  );
}
