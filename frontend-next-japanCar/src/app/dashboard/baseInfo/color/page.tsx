import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ColorListView } from '@/sections/baseInfo/view/color-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Color list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ColorListView />;
}
