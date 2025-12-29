import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { AuctionListView } from '@/sections/baseInfo/view/auction-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Auction list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AuctionListView />;
}
