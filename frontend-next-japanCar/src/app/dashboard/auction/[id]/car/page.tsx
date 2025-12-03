import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { AuctionCarsListView } from '@/sections/auction/view/auction-cars-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Auction cars | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <AuctionCarsListView auctionId={id} />;
}
