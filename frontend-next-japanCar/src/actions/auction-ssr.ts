import { CONFIG } from '@/global-config';
import axiosInstance from '@/lib/axios';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/auction`;

// ----------------------------------------------------------------------

export async function getAuctionById(id: number) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res.data;
}
