export interface ICar {
  carId?: number;
  auctionId?: number;
  colorId: number;
  modelId: number;
  grad?: string;
  point?: string;
  year: number;
  mileage: number;
  katashaki: string;
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
  insuranceEndDate?: string;
  plateType?: number;
  plateNumber?: string;
  scrapCost?: number | null | undefined;
  purchaseDate?: string;
  forSale?: number;
  transportFrom?: number;
  transportTo?: number;
  transportConfirm?: boolean;
  transportDate?: string;
  transportDateReceived?: string;
  needsPoliceCertificate?: boolean;
  policeCertificateRequestedDate?: string;
  policeCertificateReceivedDate?: string;
  deedRequestedDate?: string;
  deedIssuedDate?: string;
  plateRegisteredDate?: string;
  sukuraNumber?: number;
  sentToMunicipality: boolean;
  municipalitySentDate?: string;
  municipalitySentToPerson?: string;
  sentToAuction: boolean;
  auctionSentDate?: string;
  auctionSentToPerson?: string;
  plateRevoked: boolean;
  plateRevokedDate?: string;
  transportConfirmUserId?: number;
  policeCertificateNumber?: number;
  actionNumber?: number;
  actionDeadlineDate?: string;
  municipalityDeadlineDate?: string;
  plateRevokedDeadLine?: string;
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

export interface ICarFilter {
  brandId?: string;
  modelId: string;
  colorId: string;
  year: string;
  katashaki: string;
  chasisNumber: string;
  fuelType?: string;
  transmissionType?: string;
  plateType?: string;
  plateNumber?: string;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  purchasePriceFrom?: string;
  purchasePriceTo?: string;
  transportDateFrom?: string;
  transportDateTo?: string;
  hasPoliceCertificate?: string;
  policeCertificateReceivedDateFrom?: string;
  policeCertificateReceivedDateTo?: string;
  municipalitySentDateFrom?: string;
  municipalitySentDateTo?: string;
}
