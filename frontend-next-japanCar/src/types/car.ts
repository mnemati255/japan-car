export interface ICar {
  carId?: number;
  auctionId?: number;
  colorId: number;
  modelId: number;
  year: number;
  mileage: number;
  chasisNumber: string;
  purchasePrice: number;
  brandId?: number;
  engineVolume?: number | null | undefined;
  taxAmount?: number | null | undefined;
  finalPrice?: number | null | undefined;
  transportPrice?: number | null | undefined;
  auctionPrice?: number | null | undefined;
  fuelType?: string | null | undefined;
  createdAt?: string;
  images: File[] | string[];
  modelName?: string;
  brandName?: string;
  colorName?: string;
  auctionName?: string;
  manufactureMonth: number;
  transmissionType?: string | null | undefined;
  hasInsurance: boolean;
  insuranceStartDate?: string;
  insuranceEndDate?: string;
  insurancePolicyNumber?: string;
  plateType?: number;
  plateNumber?: string;
  scrapCost?: number | null | undefined;
  purchaseDate?: string;
}

export interface IColor {
  colorId?: number;
  colorName: string;
  createdAt?: string;
}

export interface IBrand {
  brandId?: number;
  brandName: string;
  createdAt?: string;
}

export interface IModel {
  modelId?: number;
  brandId?: number;
  modelName: string;
  brandName?: string;
  createdAt?: string;
}
