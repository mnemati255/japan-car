import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AuctionCreateView } from '@/sections/auction/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new auction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AuctionCreateView />;
}
