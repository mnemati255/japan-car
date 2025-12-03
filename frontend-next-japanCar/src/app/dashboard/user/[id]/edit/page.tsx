import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { UserEditView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <UserEditView userId={id} />;
}
