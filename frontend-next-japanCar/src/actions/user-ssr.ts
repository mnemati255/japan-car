import { CONFIG } from '@/global-config';
import axiosInstance from '@/lib/axios';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/user`;

// ----------------------------------------------------------------------

export async function getUserById(id: number) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res;
}
