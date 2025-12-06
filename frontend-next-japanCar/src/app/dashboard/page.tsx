// import type { Metadata } from 'next';

// import { CONFIG } from '@/global-config';

// // import { OverviewAppView } from '@/sections/overview/app/view';

// // ----------------------------------------------------------------------

// export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

// export default function Page() {
//   return <OverviewAppView />;
// }

'use client';

import { useRouter } from '@/routes/hooks';
import { paths } from '@/routes/paths';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(paths.dashboard.auction.root);
  }, [router]);

  return null;
}
