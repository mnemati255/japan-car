'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { IBrand, ICar, IColor } from '@/types/car';
import { getBrands, getColors } from '@/actions/base-info';
import { getCarById } from '@/actions/car';
import { convertUrlToFile } from '@/utils/convert-url-to-file';
import { CONFIG } from '@/global-config';
import { CreateEditCarForm } from '../car-create-edit-form';
import { useTranslate, useTranslateFromServer } from '@/locales';

// ----------------------------------------------------------------------

type Props = {
  carId: number;
};

export function CarEditView({ carId }: Props) {
  const [currentCar, setCurrentCar] = useState<ICar | null>(null);
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { t: tCommon } = useTranslate('commo');
  const { formFields } = useTranslateFromServer();

  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes, carRes] = await Promise.all([
        getBrands(),
        getColors(),
        getCarById(carId),
      ]);
      if (brandsRes.status == 200) setBrands(brandsRes.data.items);
      if (colorsRes.status == 200) setColors(colorsRes.data.items);
      if (carRes.status == 200) setCurrentCar(carRes.data);
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

      <CreateEditCarForm
        currentCar={currentCar}
        colors={colors}
        brands={brands}
        files={files}
      />
    </DashboardContent>
  );
}
