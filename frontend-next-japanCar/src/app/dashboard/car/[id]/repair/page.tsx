import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { RepairsListView } from '@/sections/car/view/repairs-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Car repairs | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number; carId: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <RepairsListView carId={id} />;
}
