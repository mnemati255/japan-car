export interface ICar {
  carId?: number;
  auctionId?: number;
  colorId: number;
  modelId: number;
  year: number;
  mileage: number;
  chasisNumber: string;
  purchasePrice: number;
  engineVolume?: number | null | undefined;
  taxAmount?: number | null | undefined;
  finalPrice?: number | null | undefined;
  fuelType?: string | null | undefined;
  technicalTestResult?: string | null | undefined;
  usageStatus?: string | null | undefined;
  createdAt?: string;
  images: File[] | string[];
  modelName?: string;
  brandName?: string;
  colorName?: string;
}

export interface IColor {
  colorId: number;
  colorName: string;
}

export interface IModel {
  modelId: number;
  modelName: string;
}
