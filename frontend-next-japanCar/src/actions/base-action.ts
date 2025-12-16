import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { LangCode } from '@/locales';
import { IGrid } from '@/types/common';
import { ListResult } from '@/types/list-result';
import useSWR, { mutate } from 'swr';

const BASE_URL = `${CONFIG.serverUrl}`;

function mutateItems(url: string) {
  mutate(
    (key) => typeof key === 'string' && key.startsWith(`${BASE_URL}/${url}`),
    undefined,
    {
      revalidate: true,
    }
  );
}

export async function getItems<T>(url: string) {
  const res = await axiosInstance.get<T>(`${BASE_URL}/${url}`);
  return res;
}

export function useGetPaginatedItems<T>(
  url: string,
  page: number,
  keyword?: string | null,
  locale?: LangCode | null,
  filters?: any | null
): ListResult<T> {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;

  const params = {
    skip,
    take,
    ...filters,
  };
  if (keyword != null && keyword !== '') {
    params.keyword = keyword;
  }
  const query = new URLSearchParams(params).toString();

  // url = `${BASE_URL}/${url}?keyword=${keyword}&skip=${skip}&take=${take}`;
  url = `${BASE_URL}/${url}?${query}`;
  if (locale) {
    url = `${url}&locale=${locale}`;
  }

  const { data, isLoading, error } = useSWR<IGrid<T>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    items: data?.items || [],
    totalPage: data?.totalPage || 0,
    empty: !isLoading && !data?.items.length,
    isLoading,
    error,
  };
}

export function useList<T>(
  url: string,
  page: number,
  keyword: string,
  locale: LangCode
): ListResult<T> {
  const res = useGetPaginatedItems<T>(url, page, keyword, locale);

  return {
    items: res.items,
    totalPage: res.totalPage,
    empty: res.empty,
    isLoading: res.isLoading,
    error: res.error,
  };
}

export async function getItemById<T>(
  url: string,
  id: number,
  lang?: LangCode,
  langInQuery: boolean = false
) {
  let endpoint = `${BASE_URL}/${url}/${id}`;
  if (lang) {
    if (langInQuery) endpoint = `${BASE_URL}/${url}/${id}?locale=${lang}`;
    else endpoint = `${BASE_URL}/${url}/${lang}/${id}`;
  }
  const response = await axiosInstance.get<T>(endpoint);
  return response;
}

export async function createItem<T>(url: string, item: T) {
  const response = await axiosInstance.post(`${BASE_URL}/${url}`, item);
  if (response && response.status === 200) {
    mutateItems(url);
  }
  return response;
}

export async function updateItem<T>(
  url: string,
  itemId: number,
  item: T,
  locale?: LangCode
) {
  let endpoint = `${BASE_URL}/${url}/${itemId}`;
  if (locale) {
    endpoint = `${BASE_URL}/${url}/${itemId}?locale=${locale}`;
  }
  const response = await axiosInstance.put(endpoint, item);
  if (response && response.status === 200) {
    mutateItems(url);
  }
  return response;
}

export async function deleteItem(url: string, itemId: number) {
  const endpoint = `${BASE_URL}/${url}/${itemId}`;
  const response = await axiosInstance.delete(endpoint);
  if (response && response.status === 200) {
    mutateItems(url);
  }
}
