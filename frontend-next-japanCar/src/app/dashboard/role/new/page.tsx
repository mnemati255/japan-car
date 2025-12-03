import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { RoleCreateView } from '@/sections/role/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new role | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <RoleCreateView />;
}
