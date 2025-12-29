import { CONFIG } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { LangCode } from '@/locales';
import { IAuction } from '@/types/auction';
import useSWR, { mutate, SWRConfiguration } from 'swr';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const BASE_URL = `${CONFIG.serverUrl}/auction`;

function mutateAuctions() {
  mutate((key) => typeof key === 'string' && key.startsWith(BASE_URL), undefined, {
    revalidate: true,
  });
}

// ----------------------------------------------------------------------

export function useGetAuctions(locale: LangCode) {
  const url = `${BASE_URL}?locale=${locale}`;
  const { data, isLoading, error, isValidating } = useSWR<IAuction[]>(url, fetcher, {
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

export async function getAuctionById(id: number, locale: LangCode) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}?locale=${locale}`);
  return res;
}

// ----------------------------------------------------------------------

export async function createAuction(rowData: IAuction) {
  const url = BASE_URL;
  const response = await axiosInstance.post(`${url}`, rowData);
  if (response && response.status == 200) {
    mutateAuctions();
  }
  return response;
}

// ----------------------------------------------------------------------

export async function updateAuction(
  locale: LangCode,
  auctionId: number,
  rowData: IAuction
) {
  const url = `${BASE_URL}/${auctionId}?locale=${locale}`;
  const response = await axiosInstance.put(url, rowData);
  if (response && response.status == 200) {
    mutateAuctions();
  }

  return response;
}

// ----------------------------------------------------------------------

export async function deleteAuction(userId: number) {
  const url = `${BASE_URL}/${userId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutateAuctions();
  }
}
