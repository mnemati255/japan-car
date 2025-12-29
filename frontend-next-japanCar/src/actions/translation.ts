import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { ITranslation, ITranslation2 } from '@/types/translation';
import useSWR from 'swr';

const BASE_URL = `${CONFIG.serverUrl}/Translation`;

export function useGetTranslations() {
  const { data, isLoading, error } = useSWR<ITranslation[]>(BASE_URL, fetcher, {
    ...swrOptions,
  });

  return {
    translations: data || [],
    isLoading,
    error,
  };
}

export async function createTr(data: ITranslation2[]) {
  await axiosInstance.post(BASE_URL, data);
}
