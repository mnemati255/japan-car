'use client';

import { useRouter } from '@/routes/hooks';
import { paths } from '@/routes/paths';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(paths.auth.jwt.signIn);
  }, [router]);

  return null;
}
