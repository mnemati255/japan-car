import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { MechanicListView } from '@/sections/baseInfo/view/mechanic-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Mechanic list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <MechanicListView />;
}
