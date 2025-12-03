import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { AuctionEditView } from '@/sections/auction/view';
import { getAuctionById } from '@/actions/auction-ssr';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Auction edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const currentAuction = await getAuctionById(id);
  
  return <AuctionEditView auction={currentAuction} />;
}
