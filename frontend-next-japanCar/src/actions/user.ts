import { CONFIG } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { IUser } from '@/types/user';
import useSWR, { mutate, SWRConfiguration } from 'swr';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const BASE_URL = `${CONFIG.serverUrl}/user`;

// ----------------------------------------------------------------------

export function useGetUsers(keyword: string) {
  const url = `${BASE_URL}?keyword=${keyword}`;
  const { data, isLoading, error, isValidating } = useSWR<IUser[]>(url, fetcher, {
    ...swrOptions,
  });

  return {
    users: data || [],
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.length,
  };
}

// ----------------------------------------------------------------------

export async function getUserById(id: number) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res;
}

// ----------------------------------------------------------------------

export async function createUser(rowData: IUser) {
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
}

// ----------------------------------------------------------------------

export async function updateUsere(userId: number, rowData: IUser) {
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
}

// ----------------------------------------------------------------------

export async function deleteUser(userId: number) {
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
