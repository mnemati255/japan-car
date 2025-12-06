import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { IBrand, IColor, IModel } from '@/types/car';
import { IGrid } from '@/types/common';
import useSWR, { mutate } from 'swr';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/BaseInfo`;

// ----------------------------------------------------------------------

const COLOR_BASE_URL = `${BASE_URL}/color`;

function mutateColors() {
  mutate(COLOR_BASE_URL, () => {});
}

export async function getColors() {
  const res = await axiosInstance.get<IGrid<IColor>>(COLOR_BASE_URL);
  return res;
}

export function useGetColors(page: number) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${COLOR_BASE_URL}?skip=${skip}&take=${take}`;

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

export async function createColor(color: IColor) {
  const response = await axiosInstance.post(COLOR_BASE_URL, color);
  if (response && response.status === 200) {
    mutateColors();
  }
  return response;
}

export async function updateColor(colorId: number, color: IColor) {
  const url = `${COLOR_BASE_URL}/${colorId}`;
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
  mutate(BRAND_BASE_URL, () => {});
}

export async function getBrands() {
  const res = await axiosInstance.get<IGrid<IBrand>>(BRAND_BASE_URL);
  return res;
}

export function useGetBrands(page: number) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${BRAND_BASE_URL}?skip=${skip}&take=${take}`;

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

export async function createBrand(brand: IBrand) {
  const response = await axiosInstance.post(BRAND_BASE_URL, brand);
  if (response && response.status === 200) {
    mutateBrands();
  }
  return response;
}

export async function updateBrand(brandId: number, brand: IBrand) {
  const url = `${BRAND_BASE_URL}/${brandId}`;
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
  mutate(MODEL_BASE_URL, () => {});
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

export function useGetModels(page: number) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;
  const url = `${MODEL_BASE_URL}?skip=${skip}&take=${take}`;

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

export async function createModel(model: IModel) {
  const response = await axiosInstance.post(MODEL_BASE_URL, model);
  if (response && response.status === 200) {
    mutateModels();
  }
  return response;
}

export async function updateModel(modelId: number, model: IModel) {
  const url = `${MODEL_BASE_URL}/${modelId}`;
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
