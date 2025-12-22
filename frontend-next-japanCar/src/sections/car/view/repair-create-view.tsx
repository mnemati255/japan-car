'use client';

import { getItemById, getItems } from '@/actions/base-action';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { DashboardContent } from '@/layouts/dashboard';
import { endpoints } from '@/lib/axios';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { paths } from '@/routes/paths';
import { ICar } from '@/types/car';
import { IGrid } from '@/types/common';
import { IMechanic } from '@/types/mechanic';
import { IPart } from '@/types/part';
import { useEffect, useState } from 'react';
import { RepairCreateEditForm } from '../repair-create-edit-form';

type Props = {
  carId: number;
};

export function RepairCreateView({ carId }: Props) {
  const [car, setCar] = useState<ICar>();
  const [parts, setParts] = useState<IPart[]>([]);
  const [mechanics, setMechanics] = useState<IMechanic[]>([]);
  const { t: tCommon, currentLang } = useTranslate('common');
  const { translations: formFields } = useTranslateFromServer();

  useEffect(() => {
    (async () => {
      const [carRes, partsRes, mechanicsRes] = await Promise.all([
        getItemById<ICar>(endpoints.car, carId),
        getItems<IGrid<IPart>>(endpoints.baseInfo.part),
        getItems<IGrid<IMechanic>>(endpoints.baseInfo.mechanic),
      ]);
      if (carRes.status == 200) setCar(carRes.data);
      if (partsRes.status == 200) setParts(partsRes.data.items);
      if (mechanicsRes.status == 200) setMechanics(mechanicsRes.data.items);
    })();
  }, [carId]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('repair.createNew')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('car.cars'), href: paths.dashboard.car.root },
          { name: `${formFields['ChassisNumber']}: ${car?.chasisNumber ?? ''}` },
          { name: tCommon('repair.repairs'), href: paths.dashboard.car.repair(carId) },
          { name: tCommon('create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RepairCreateEditForm
        car={car!}
        parts={parts}
        mechanics={mechanics}
        lang={currentLang.value}
      />
    </DashboardContent>
  );
}
