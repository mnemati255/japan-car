import { CONFIG } from '@/global-config';
import axiosInstance from '@/lib/axios';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/role`;

// ----------------------------------------------------------------------

export async function getRoleById(id: number) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res?.data;
}
