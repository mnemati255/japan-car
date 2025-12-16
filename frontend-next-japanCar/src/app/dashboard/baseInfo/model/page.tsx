import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ModelListView } from '@/sections/baseInfo/view/model-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Model list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ModelListView />;
}
