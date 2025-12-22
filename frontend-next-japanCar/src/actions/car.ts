// ----------------------------------------------------------------------

import { CONFIG, swrOptions } from '@/global-config';
import axiosInstance, { fetcher } from '@/lib/axios';
import { LangCode } from '@/locales';
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

export function useGetCars(
  locale: LangCode,
  page: number,
  filters: any,
  auctionId?: number
) {
  const skip = (page - 1) * CONFIG.appSettings.pageSize;
  const take = CONFIG.appSettings.pageSize;

  const query = new URLSearchParams({
    skip,
    take,
    locale,
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

  fd.append('dto.dto.ScrapCost', car.scrapCost?.toString() ?? '');
  fd.append('dto.dto.ManufactureMonth', car.manufactureMonth.toString());
  fd.append('dto.dto.TransmissionType', car.transmissionType ?? '');
  fd.append('dto.dto.PlateType', car.plateType?.toString() ?? '');
  fd.append('dto.dto.PlateNumber', car.plateNumber ?? '');
  fd.append('dto.dto.PurchaseDate', car.purchaseDate ?? '');
  fd.append('dto.dto.HasInsurance', car.hasInsurance.toString());
  fd.append('dto.dto.InsuranceEndDate', car.insuranceEndDate ?? '');
  fd.append('dto.dto.ForSale', car.forSale?.toString() ?? '');
  fd.append('dto.dto.TransportFrom', car.transportFrom?.toString() ?? '');
  fd.append('dto.dto.TransportTo', car.transportTo?.toString() ?? '');
  fd.append('dto.dto.TransportConfirm', car.transportConfirm?.toString() ?? '');
  fd.append('dto.dto.TransportDate', car.transportDate ?? '');
  fd.append('dto.dto.TransportDateReceived', car.transportDateReceived ?? '');
  fd.append(
    'dto.dto.NeedsPoliceCertificate',
    car.needsPoliceCertificate?.toString() ?? ''
  );
  fd.append(
    'dto.dto.PoliceCertificateRequestedDate',
    car.policeCertificateRequestedDate ?? ''
  );
  fd.append(
    'dto.dto.PoliceCertificateReceivedDate',
    car.policeCertificateReceivedDate ?? ''
  );
  fd.append('dto.dto.DeedRequestedDate', car.deedRequestedDate ?? '');
  fd.append('dto.dto.DeedIssuedDate', car.deedIssuedDate ?? '');
  fd.append('dto.dto.PlateRegisteredDate', car.plateRegisteredDate ?? '');

  fd.append('dto.dto.SentToMunicipality', car.sentToMunicipality.toString() ?? '');
  fd.append('dto.dto.MunicipalitySentDate', car.municipalitySentDate ?? '');
  fd.append('dto.dto.MunicipalitySentToPerson', car.municipalitySentToPerson ?? '');
  fd.append('dto.dto.SentToAuction', car.sentToAuction.toString() ?? '');
  fd.append('dto.dto.AuctionSentDate', car.auctionSentDate ?? '');
  fd.append('dto.dto.AuctionSentToPerson', car.auctionSentToPerson ?? '');
  fd.append('dto.dto.PlateRevoked', car.plateRevoked.toString() ?? '');
  fd.append('dto.dto.PlateRevokedDate', car.plateRevokedDate ?? '');

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
