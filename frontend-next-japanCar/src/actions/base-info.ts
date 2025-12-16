import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { LangCode } from '@/locales';
import { IBrand, IColor, IModel } from '@/types/car';
import { IGrid } from '@/types/common';
import { ListResult } from '@/types/list-result';
import useSWR, { mutate } from 'swr';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/BaseInfo`;

export function useBrandList(
  locale: LangCode,
  page: number,
  keyword: string
): ListResult<IBrand> {
  const res = useGetBrands(locale, page, keyword);

  return {
    items: res.brands,
    totalPage: res.totalPage,
    empty: res.empty,
    isLoading: res.isLoading,
    error: res.error
  };
}

export function useColorList(
  locale: LangCode,
  page: number,
  keyword: string
): ListResult<IColor> {
  const res = useGetColors(locale, page, keyword);

  return {
    items: res.colors,
    totalPage: res.totalPage,
    empty: res.empty,
    isLoading: res.isLoading,
    error: res.error
  };
}

export function useModelList(
  locale: LangCode,
  page: number,
  keyword: string
): ListResult<IModel> {
  const res = useGetModels(locale, page, keyword);

  return {
    items: res.models,
    totalPage: res.totalPage,
    empty: res.empty,
    isLoading: res.isLoading,
    error: res.error
  };
}

// ----------------------------------------------------------------------

const COLOR_BASE_URL = `${BASE_URL}/color`;

function mutateColors() {
  mutate((key) => typeof key === 'string' && key.startsWith(COLOR_BASE_URL), undefined, {
    revalidate: true,
  });
}

export async function getColors() {
  const res = await axiosInstance.get<IGrid<IColor>>(`${COLOR_BASE_URL}`);
  return res;
}

export function useGetColors(locale: LangCode, page: number, keyword: string) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${COLOR_BASE_URL}?locale=${locale}&keyword=${keyword}&skip=${skip}&take=${take}`;

  const { data, isLoading, error, isValidating } = useSWR<IGrid<IColor>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    colors: data?.items || [],
    totalPage: data?.totalPage || 0,
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.items.length,
  };
}

export async function getColorById(lang: LangCode, id: number) {
  const response = await axiosInstance.get(`${COLOR_BASE_URL}/${lang}/${id}`);
  return response;
}

export async function createColor(color: IColor) {
  const response = await axiosInstance.post(`${COLOR_BASE_URL}`, color);
  if (response && response.status === 200) {
    mutateColors();
  }
  return response;
}

export async function updateColor(locale: LangCode, colorId: number, color: IColor) {
  const url = `${COLOR_BASE_URL}/${colorId}?locale=${locale}`;
  const response = await axiosInstance.put(url, color);
  if (response && response.status === 200) {
    mutateColors();
  }
  return response;
}

export async function deleteColor(colorId: number) {
  const url = `${COLOR_BASE_URL}/${colorId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutateColors();
  }
}

// ----------------------------------------------------------------------

const BRAND_BASE_URL = `${BASE_URL}/brand`;

function mutateBrands() {
  mutate((key) => typeof key === 'string' && key.startsWith(BRAND_BASE_URL), undefined, {
    revalidate: true,
  });
}

export async function getBrands() {
  const res = await axiosInstance.get<IGrid<IBrand>>(BRAND_BASE_URL);
  return res;
}

export function useGetBrands(locale: LangCode, page: number, keyword: string) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${BRAND_BASE_URL}?locale=${locale}&keyword=${keyword}&skip=${skip}&take=${take}`;

  const { data, isLoading, error, isValidating } = useSWR<IGrid<IBrand>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    brands: data?.items || [],
    totalPage: data?.totalPage || 0,
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.items.length,
  };
}

export async function getBrandById(lang: LangCode, id: number) {
  const response = await axiosInstance.get(`${BRAND_BASE_URL}/${lang}/${id}`);
  return response;
}

export async function createBrand(brand: IBrand) {
  const response = await axiosInstance.post(BRAND_BASE_URL, brand);
  if (response && response.status === 200) {
    mutateBrands();
  }
  return response;
}

export async function updateBrand(locale: LangCode, brandId: number, brand: IBrand) {
  const url = `${BRAND_BASE_URL}/${brandId}?locale=${locale}`;
  const response = await axiosInstance.put(url, brand);
  if (response && response.status === 200) {
    mutateBrands();
  }
  return response;
}

export async function deleteBrand(brandId: number) {
  const url = `${BRAND_BASE_URL}/${brandId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutateBrands();
  }
}

// ----------------------------------------------------------------------

const MODEL_BASE_URL = `${BASE_URL}/model`;

function mutateModels() {
  mutate((key) => typeof key === 'string' && key.startsWith(MODEL_BASE_URL), undefined, {
    revalidate: true,
  });
}

export async function getModelsOfBrand(brandId: number) {
  const url = `${BASE_URL}/model/${brandId}`;
  const res = await axiosInstance.get<IModel[]>(url);
  return res;
}

export async function getModels() {
  const res = await axiosInstance.get<IGrid<IModel>>(MODEL_BASE_URL);
  return res;
}

export function useGetModels(locale: LangCode, page: number, keyword: string) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${MODEL_BASE_URL}?locale=${locale}&keyword=${keyword}&skip=${skip}&take=${take}`;

  const { data, isLoading, error, isValidating } = useSWR<IGrid<IModel>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    models: data?.items || [],
    totalPage: data?.totalPage || 0,
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.items.length,
  };
}

export async function getModelById(lang: LangCode, id: number) {
  const response = await axiosInstance.get(`${MODEL_BASE_URL}/${lang}/${id}`);
  return response;
}

export async function createModel(model: IModel) {
  const response = await axiosInstance.post(MODEL_BASE_URL, model);
  if (response && response.status === 200) {
    mutateModels();
  }
  return response;
}

export async function updateModel(locale: LangCode, modelId: number, model: IModel) {
  const url = `${MODEL_BASE_URL}/${modelId}?locale=${locale}`;
  const response = await axiosInstance.put(url, model);
  if (response && response.status === 200) {
    mutateModels();
  }
  return response;
}

export async function deleteModel(modelId: number) {
  const url = `${MODEL_BASE_URL}/${modelId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutateModels();
  }
}

// ----------------------------------------------------------------------
