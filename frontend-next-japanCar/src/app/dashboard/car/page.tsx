import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CarsListView } from '@/sections/car/view/car-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Car list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CarsListView />;
}
