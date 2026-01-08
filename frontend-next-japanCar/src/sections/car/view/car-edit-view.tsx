'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { IBrand, ICar, IColor } from '@/types/car';
import { convertUrlToFile } from '@/utils/convert-url-to-file';
import { CONFIG } from '@/global-config';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { getItemById, getItems } from '@/actions/base-action';
import { IGrid } from '@/types/common';
import { endpoints } from '@/lib/axios';
import { IAuction } from '@/types/auction';
import { IUser } from '@/types/user';
import CarCreateEditForm from '../car-create-edit-form';
import { ICustomer } from '@/types/customer';

// ----------------------------------------------------------------------

type Props = {
  carId: number;
};

export function CarEditView({ carId }: Props) {
  const [currentCar, setCurrentCar] = useState<ICar | null>(null);
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [auctions, setAuctions] = useState<IAuction[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { t: tCommon } = useTranslate('commo');
  const { translations: formFields } = useTranslateFromServer();

  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes, auctionsRes, usersRes, carRes, customersRes] =
        await Promise.all([
          getItems<IGrid<IBrand>>(endpoints.baseInfo.brand),
          getItems<IGrid<IColor>>(endpoints.baseInfo.color),
          getItems<IGrid<IAuction>>(endpoints.baseInfo.auction),
          getItems<IUser[]>(endpoints.user),
          getItemById<ICar>(endpoints.car, carId),
          getItems<IGrid<ICustomer>>(endpoints.customer),
        ]);
      if (brandsRes.status == 200) setBrands(brandsRes.data.items);
      if (colorsRes.status == 200) setColors(colorsRes.data.items);
      if (auctionsRes.status === 200) setAuctions(auctionsRes.data.items);
      if (usersRes.status === 200) setUsers(usersRes.data);
      if (carRes.status == 200) setCurrentCar(carRes.data);
      if (customersRes.status === 200) setCustomers(customersRes.data.items);
    })();
  }, [carId]);

  useEffect(() => {
    if (currentCar) {
      const getFilesFromUrls = async () => {
        const filesFromUrls: File[] = await Promise.all(
          currentCar.images.map((image) =>
            convertUrlToFile(`${CONFIG.carsImagesDir}/${image}`)
          )
        );
        setFiles(filesFromUrls);
      };
      getFilesFromUrls();
    }
  }, [carId, currentCar]);

  if (!currentCar) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('edit')}
        backHref={paths.dashboard.car.root}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('car.cars'), href: paths.dashboard.car.root },
          { name: `${formFields['ChassisNumber']} : ${currentCar?.chasisNumber ?? ''}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CarCreateEditForm
        auctions={auctions}
        brands={brands}
        colors={colors}
        users={users}
        files={files}
        currentCar={currentCar}
        customers={customers}
      />

      {/* <CreateEditCarForm2
        currentCar={currentCar}
        colors={colors}
        brands={brands}
        files={files}
        auctions={auctions}
        users={users}
      /> */}
    </DashboardContent>
  );
}
