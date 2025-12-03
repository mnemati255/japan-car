import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { JwtSignUpView } from '@/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignUpView />;
}
