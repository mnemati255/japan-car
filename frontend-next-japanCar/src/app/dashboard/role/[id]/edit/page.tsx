import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { RoleEditView } from '@/sections/role/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Role edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <RoleEditView roleId={id} />;
}
