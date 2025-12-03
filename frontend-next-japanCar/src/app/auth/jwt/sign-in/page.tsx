import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { JwtSignInView } from '@/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignInView />;
}
