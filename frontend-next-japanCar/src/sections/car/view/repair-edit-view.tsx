'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { useSearchParams } from 'next/navigation';
import { IRepair } from '@/types/repair';
import { getItemById, getItems } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { RepairCreateEditForm } from '../repair-create-edit-form';
import { ICar } from '@/types/car';
import { IPart } from '@/types/part';
import { IMechanic } from '@/types/mechanic';
import { IGrid } from '@/types/common';

// ----------------------------------------------------------------------

type Props = {
  carId: number;
  repairId: number;
};

export function RepairEditView({ carId, repairId }: Props) {
  const [currentRepair, setCurrentRepair] = useState<IRepair>();
  const { currentLang, t: tCommon } = useTranslate('common');
  const { translations: formFields } = useTranslateFromServer();
  const lang = useSearchParams().get('lang') as LangCode | null;
  const [car, setCar] = useState<ICar>();
  const [parts, setParts] = useState<IPart[]>([]);
  const [mechanics, setMechanics] = useState<IMechanic[]>([]);

  useEffect(() => {
    (async () => {
      const [repairRes, carRes, partsRes, mechanicsRes] = await Promise.all([
        getItemById<IRepair>(
          `${endpoints.repair}/by-id`,
          repairId,
          lang ?? currentLang.value,
          true
        ),
        getItemById<ICar>(endpoints.car, carId),
        getItems<IGrid<IPart>>(endpoints.baseInfo.part),
        getItems<IGrid<IMechanic>>(endpoints.baseInfo.mechanic),
      ]);
      if (repairRes.status == 200) setCurrentRepair(repairRes.data);
      if (carRes.status == 200) setCar(carRes.data);
      if (partsRes.status == 200) setParts(partsRes.data.items);
      if (mechanicsRes.status == 200) setMechanics(mechanicsRes.data.items);
    })();
  }, [carId, currentLang.value, lang, repairId]);

  if (!currentRepair) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('edit')}
        backHref={paths.dashboard.car.repair(carId)}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('car.cars'), href: paths.dashboard.car.root },
          { name: `${formFields['ChassisNumber']}: ${car?.chasisNumber ?? ''}` },
          { name: tCommon('repair.repairs'), href: paths.dashboard.car.repair(carId) },
          { name: tCommon('edit') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RepairCreateEditForm
        currentRepair={currentRepair}
        lang={lang ?? currentLang.value}
        parts={parts}
        mechanics={mechanics}
        car={car!}
      />
    </DashboardContent>
  );
}
