import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { RoleEditView } from '@/sections/role/view';
import { getRoleById } from '@/actions/role-ssr';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Role edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentRole = await getRoleById(id);

  return <RoleEditView role={currentRole} />;
}
