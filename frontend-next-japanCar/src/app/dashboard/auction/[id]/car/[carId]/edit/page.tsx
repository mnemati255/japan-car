import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { AuctionEditCarView } from '@/sections/auction/view/auction-edit-car-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Auction car edit | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number; carId: number }>;
};

export default async function Page({ params }: Props) {
  const { id: auctionId, carId } = await params;

  return <AuctionEditCarView auctionId={auctionId} carId={carId} />;
}
