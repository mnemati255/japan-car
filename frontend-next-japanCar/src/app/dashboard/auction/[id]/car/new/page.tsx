import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { AuctionCreateCarView } from '@/sections/auction/view/auction-create-car-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new car | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <AuctionCreateCarView auctionId={id} />;
}
