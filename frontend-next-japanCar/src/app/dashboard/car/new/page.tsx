import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';
import { CarCreateView } from '@/sections/car/view/car-create-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new car | Dashboard - ${CONFIG.appName}`,
};

export default async function Page() {
  return <CarCreateView  />;
}
