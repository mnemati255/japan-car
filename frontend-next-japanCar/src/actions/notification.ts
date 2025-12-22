import { CONFIG } from '@/global-config';
import axiosInstance, { endpoints } from '@/lib/axios';
import { mutate } from 'swr';

const BASE_URL = `${CONFIG.serverUrl}/${endpoints.notification}`;

export async function markNotificationAsDone(notificationId: number) {
  const url = `${BASE_URL}/mark-as-done/${notificationId}`;
  const response = await axiosInstance.put(url);
  if (response && response.status === 200) {
    mutate((key) => typeof key === 'string' && key.startsWith(BASE_URL), undefined, {
      revalidate: true,
    });
  }
}
