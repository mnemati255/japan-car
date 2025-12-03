import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AuctionListView } from '@/sections/auction/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Auction list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AuctionListView />;
}
