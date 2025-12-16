import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { LangCode } from '@/locales';
import { IGrid } from '@/types/common';
import { ListResult } from '@/types/list-result';
import { IPart } from '@/types/part';
import useSWR, { mutate } from 'swr';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/part`;

function mutateParts() {
  mutate((key) => typeof key === 'string' && key.startsWith(BASE_URL), undefined, {
    revalidate: true,
  });
}

export function usePartList(
  locale: LangCode,
  page: number,
  keyword: string
): ListResult<IPart> {
  const res = useGetParts(locale, page, keyword);

  return {
    items: res.parts,
    totalPage: res.totalPage,
    empty: res.empty,
    isLoading: res.isLoading,
    error: res.error
  };
}

// ----------------------------------------------------------------------

export async function getParts() {
  const res = await axiosInstance.get<IGrid<IPart>>(`${BASE_URL}`);
  return res;
}

export function useGetParts(locale: LangCode, page: number, keyword: string) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${BASE_URL}?locale=${locale}&keyword=${keyword}&skip=${skip}&take=${take}`;

  const { data, isLoading, error, isValidating } = useSWR<IGrid<IPart>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    parts: data?.items || [],
    totalPage: data?.totalPage || 0,
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.items.length,
  };
}

export async function getPartById(lang: LangCode, id: number) {
  const response = await axiosInstance.get(`${BASE_URL}/${lang}/${id}`);
  return response;
}

export async function createPart(part: IPart) {
  const response = await axiosInstance.post(`${BASE_URL}`, part);
  if (response && response.status === 200) {
    mutateParts();
  }
  return response;
}

export async function updatePart(locale: LangCode, colorId: number, part: IPart) {
  const url = `${BASE_URL}/${colorId}?locale=${locale}`;
  const response = await axiosInstance.put(url, part);
  if (response && response.status === 200) {
    mutateParts();
  }
  return response;
}

export async function deletePart(partId: number) {
  const url = `${BASE_URL}/${partId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutateParts();
  }
}
