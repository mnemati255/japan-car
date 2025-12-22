export interface IPart {
  partId?: number;
  partPrice: number;
  partName: string;
  partDescription?: string | undefined | null;
  createdAt?: string;
}

export interface ICarPart {
  carPartId?: number;
  partId: number;
  partCost: number;
  partCount: number;
  mechanicId: number;
  replaceDate: string;
}
