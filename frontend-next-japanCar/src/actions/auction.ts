import { CONFIG } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { IAuctionItem } from '@/types/auction';
import useSWR, { mutate, SWRConfiguration } from 'swr';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const BASE_URL = `${CONFIG.serverUrl}/auction`;

// ----------------------------------------------------------------------

export function useGetAuctions() {
  const url = BASE_URL;
  const { data, isLoading, error, isValidating } = useSWR<IAuctionItem[]>(url, fetcher, {
    ...swrOptions,
  });

  return {
    auctions: data || [],
    auctionsLoading: isLoading,
    auctionsError: error,
    auctionsValidating: isValidating,
    auctionsEmpty: !isLoading && !data?.length,
  };
}

// ----------------------------------------------------------------------

export async function createAuction(rowData: IAuctionItem) {
  /**
   * on server
   */
  const url = BASE_URL;
  const response = await axiosInstance.post(url, rowData);
  if (response && response.status == 200) {
    /**
     * in local
     */
    mutate(BASE_URL, () => {});
  }

  return response;
}

// ----------------------------------------------------------------------

export async function updateAuction(userId: number, rowData: IAuctionItem) {
  /**
   * on server
   */
  const url = `${BASE_URL}/${userId}`;
  const response = await axiosInstance.put(url, rowData);
  if (response && response.status == 200) {
    /**
     * in local
     */
    mutate(BASE_URL, () => {});
  }

  return response;
}

// ----------------------------------------------------------------------

export async function deleteAuction(userId: number) {
  /**
   * on server
   */
  const url = `${BASE_URL}/${userId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    /**
     * in local
     */
    mutate(BASE_URL, () => {});
  }
}
