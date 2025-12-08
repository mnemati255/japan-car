// ----------------------------------------------------------------------

import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { ICar } from '@/types/car';
import { IGrid } from '@/types/common';
import useSWR, { mutate } from 'swr';

const BASE_URL = `${CONFIG.serverUrl}/car`;

// ----------------------------------------------------------------------

function mutateCars() {
  mutate((key) => typeof key === 'string' && key.startsWith(BASE_URL), undefined, {
    revalidate: true,
  });
}

export function useGetCars(page: number, filters: any, auctionId?: number) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;

  const query = new URLSearchParams({
    skip: skip,
    take: take,
    ...filters,
  }).toString();

  const url = !auctionId
    ? `${BASE_URL}?${query}`
    : `${BASE_URL}?auctionId=${auctionId}&${query}`;

  const { data, isLoading, error, isValidating } = useSWR<IGrid<ICar>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    cars: data?.items || [],
    totalPage: data?.totalPage || 0,
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.items.length,
  };
}

// ----------------------------------------------------------------------

export async function createEditCar(
  car: ICar,
  auctionId: number | null,
  carId: number | null
) {
  const url = BASE_URL;

  const fd = new FormData();

  if (auctionId) fd.append('dto.dto.AuctionId', auctionId.toString());
  fd.append('dto.dto.ChasisNumber', car.chasisNumber);
  fd.append('dto.dto.ColorId', car.colorId.toString());
  fd.append('dto.dto.EngineVolume', car.engineVolume?.toString() ?? '');
  fd.append('dto.dto.FinalPrice', car.finalPrice?.toString() ?? '');
  fd.append('dto.dto.FuelType', car.fuelType ?? '');
  fd.append('dto.dto.Mileage', car.mileage.toString());
  fd.append('dto.dto.ModelId', car.modelId.toString());
  fd.append('dto.dto.PurchasePrice', car.purchasePrice.toString());
  fd.append('dto.dto.TaxAmount', car.taxAmount?.toString() ?? '');
  fd.append('dto.dto.TransportPrice', car.transportPrice?.toString() ?? '');
  fd.append('dto.dto.AuctionPrice', car.auctionPrice?.toString() ?? '');
  fd.append('dto.dto.Year', car.year.toString());
  car.images.forEach((item) => {
    fd.append('dto.Images', item);
  });

  const api = !carId
    ? axiosInstance.post(url, fd)
    : axiosInstance.put(`${url}/${carId}`, fd);

  const response = await api;
  if (response && response.status == 200) {
    mutateCars();
  }

  return response;
}

// ----------------------------------------------------------------------

export async function updateCarOfAuction(carId: number, car: ICar) {
  const url = `${BASE_URL}/${carId}`;
  const response = await axiosInstance.put(url, car);
  if (response && response.status == 200) {
    mutateCars();
  }

  return response;
}

// ----------------------------------------------------------------------

export async function deleteCar(carId: number) {
  const url = `${BASE_URL}/${carId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutateCars();
  }
}

// ----------------------------------------------------------------------

export function useGetCarsOfAuction(auctionId: number, page: number, filters: any) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;

  const query = new URLSearchParams({
    skip: skip,
    take: take,
    ...filters,
  }).toString();

  const url = `${BASE_URL}/cars-of-auction/${auctionId}?${query}`;

  const { data, isLoading, error, isValidating } = useSWR<IGrid<ICar>>(url, fetcher, {
    ...swrOptions,
  });

  return {
    cars: data?.items || [],
    totalPage: data?.totalPage || 0,
    isLoading,
    error,
    isValidating,
    empty: !isLoading && !data?.items.length,
  };
}

// ----------------------------------------------------------------------

export async function getCarById(id: number) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res;
}
