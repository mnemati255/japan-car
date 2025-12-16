import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { BrandListView } from '@/sections/baseInfo/view/brand-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Brand list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <BrandListView />;
}
