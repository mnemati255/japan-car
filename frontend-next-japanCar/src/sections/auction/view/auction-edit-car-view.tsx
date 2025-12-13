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
import { CreateEditCarForm } from '@/sections/car/car-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
  carId: number;
};

export function AuctionEditCarView({ auctionId, carId }: Props) {
  const [currentCar, setCurrentCar] = useState<ICar | null>(null);
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    console.log(333)
    if (auctionId) {
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
    }
  }, [auctionId, carId]);

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
        backHref={paths.dashboard.auction.cars(auctionId)}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Auction', href: paths.dashboard.auction.root },
          { name: 'Cars', href: paths.dashboard.auction.cars(auctionId) },
          { name: `Chasis Num: ${currentCar?.chasisNumber}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CreateEditCarForm
        currentCar={currentCar}
        colors={colors}
        brands={brands}
        auctionId={auctionId}
        files={files}
      />
    </DashboardContent>
  );
}
