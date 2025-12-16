import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { RepairCreateView } from '@/sections/car/view/repair-create-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new repair | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number; carId: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <RepairCreateView carId={id} />;
}
