import { CONFIG, swrOptions } from '@/global-config';
import { fetcher } from '@/lib/axios';
import { ITranslation } from '@/types/translation';
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
