import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { RoleListView } from '@/sections/role/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Role list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <RoleListView />;
}
