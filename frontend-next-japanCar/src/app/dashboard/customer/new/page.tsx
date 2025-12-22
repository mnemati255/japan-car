import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CustomerCreateView } from '@/sections/customer/view/customer-create-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new customer | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <CustomerCreateView />;
}
