import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { RepairEditView } from '@/sections/car/view/repair-edit-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Repair edit | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number; repairId: number }>;
};

export default async function Page({ params }: Props) {
  const { id, repairId } = await params;

  return <RepairEditView repairId={repairId} carId={id} />;
}
