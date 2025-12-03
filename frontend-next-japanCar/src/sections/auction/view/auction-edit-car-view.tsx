'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { ICar, IColor, IModel } from '@/types/car';
import { getColors, getModels } from '@/actions/base-info';
import { AuctionCreateEditCarForm } from '../auction-create-edit-car-form';
import { getCarById } from '@/actions/car';
import { convertUrlToFile } from '@/utils/convert-url-to-file';
import { CONFIG } from '@/global-config';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
  carId: number;
};

export function AuctionEditCarView({ auctionId, carId }: Props) {
  const [currentCar, setCurrentCar] = useState<ICar | null>(null);
  const [colors, setColors] = useState<IColor[]>([]);
  const [models, setModels] = useState<IModel[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (auctionId) {
      const getBaseInfo = async () => {
        const { status, data } = await getColors();
        if (status == 200) setColors(data);

        const { status: status2, data: data2 } = await getModels();
        if (status2 == 200) setModels(data2);
      };
      const getCar = async () => {
        const { status, data } = await getCarById(carId);
        if (status === 200) {
          setCurrentCar(data);
        }
      };
      getBaseInfo();
      getCar();
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
          { name: currentCar?.modelName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuctionCreateEditCarForm
        currentCar={currentCar}
        colors={colors}
        models={models}
        auctionId={auctionId}
        files={files}
      />
    </DashboardContent>
  );
}
