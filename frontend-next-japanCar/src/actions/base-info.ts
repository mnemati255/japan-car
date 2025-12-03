import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { IColor, IModel } from '@/types/car';
import useSWR from 'swr';

const BASE_URL = `${CONFIG.serverUrl}/BaseInfo`;

// ----------------------------------------------------------------------

export async function getColors() {
  const url = `${BASE_URL}/color`;
  const res = await axiosInstance.get(url);
  return res;
}

// ----------------------------------------------------------------------

export async function getModels() {
  const url = `${BASE_URL}/model`;
  const res = await axiosInstance.get(url);
  return res;
}

// ----------------------------------------------------------------------

export function useGetColors() {
  const url = `${BASE_URL}/color`;
  const { data, isLoading, error } = useSWR<IColor[]>(url, fetcher, { ...swrOptions });

  return {
    colors: data || [],
    isLoading,
    error,
    empty: !isLoading && !data?.length,
  };
}

// ----------------------------------------------------------------------

export function useGetModels() {
  const url = `${BASE_URL}/model`;
  const { data, isLoading, error } = useSWR<IModel[]>(url, fetcher, { ...swrOptions });

  return {
    models: data || [],
    isLoading,
    error,
    empty: !isLoading && !data?.length,
  };
}
