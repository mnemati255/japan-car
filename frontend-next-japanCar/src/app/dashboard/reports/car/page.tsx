import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CarReportView } from '@/sections/reports/view/car-report-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Cars report | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CarReportView />;
}
