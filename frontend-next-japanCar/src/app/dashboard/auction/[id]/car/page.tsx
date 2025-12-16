import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { CarListView } from '@/sections/car/view/car-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Auction cars | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <CarListView auctionId={id} />;
}
