import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { CarEditView } from '@/sections/car/view/car-edit-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Car edit | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: number; carId: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <CarEditView carId={id} />;
}
