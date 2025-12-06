import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { BaseInfoTabsView } from '@/sections/baseInfo/view/base-info-tabs-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Brand list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <BaseInfoTabsView />;
}
