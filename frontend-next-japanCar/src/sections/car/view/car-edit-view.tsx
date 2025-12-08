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

// ----------------------------------------------------------------------

type Props = {
  carId: number;
};

export function EditCarView({ carId }: Props) {
  const [currentCar, setCurrentCar] = useState<ICar | null>(null);
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const getBaseInfo = async () => {
      const { status, data } = await getColors();
      if (status == 200) setColors(data.items);

      const { status: status2, data: data2 } = await getBrands();
      if (status2 == 200) setBrands(data2.items);
    };
    const getCar = async () => {
      const { status, data } = await getCarById(carId);
      if (status === 200) {
        setCurrentCar(data);
      }
    };
    getBaseInfo();
    getCar();
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
        heading="Edit"
        backHref={paths.dashboard.car.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cars', href: paths.dashboard.car.root },
          { name: `Chasis Num: ${currentCar?.chasisNumber}` },
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
