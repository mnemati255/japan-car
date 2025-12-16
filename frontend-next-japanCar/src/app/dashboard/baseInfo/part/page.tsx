import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PartListView } from '@/sections/baseInfo/view/part-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Part list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PartListView />;
}
