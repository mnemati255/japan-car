import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { NotificationListView } from '@/sections/notification/view/notification-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Notification list | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <NotificationListView boxType="inbox" />;
}
