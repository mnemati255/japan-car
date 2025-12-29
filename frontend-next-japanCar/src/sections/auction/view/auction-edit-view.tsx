'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { AuctionCreateEditForm } from '../auction-create-edit-form';
import { IAuction } from '@/types/auction';
import { useEffect, useState } from 'react';
import { getAuctionById } from '@/actions/auction';
import { LangCode, useTranslate } from '@/locales';
import { useSearchParams } from 'next/navigation';

// ----------------------------------------------------------------------

type Props = {
  auctionId?: number;
};

export function AuctionEditView({ auctionId }: Props) {
  const [currentAuction, setCurrentAuction] = useState<IAuction | null>(null);
  const { currentLang, t: tCommon } = useTranslate('common');
  const lang = useSearchParams().get('lang') as LangCode | null;

  useEffect(() => {
    if (auctionId) {
      const getCurrentAuction = async () => {
        const { status, data } = await getAuctionById(
          auctionId,
          lang ?? currentLang.value
        );
        if (status === 200) {
          setCurrentAuction(data);
        }
      };
      getCurrentAuction();
    }
  }, [auctionId, currentLang.value, lang]);

  if (!currentAuction) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('edit')}
        backHref={paths.dashboard.auction.root}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('auction.auction'), href: paths.dashboard.auction.root },
          { name: currentAuction?.auctionName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuctionCreateEditForm
        currentAuction={currentAuction}
        lang={lang ?? currentLang.value}
      />
    </DashboardContent>
  );
}
