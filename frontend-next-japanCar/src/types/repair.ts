export interface IRepair {
  repairId?: number;
  carId:number;
  repairDate: string;
  mechanicId?: number | null;
  dashboardReplacerId?: number | null;
  steeringReplacerId?: number | null;
  mechanicTechnicalNote?: string | null;
  parts: IRepairedPart[];
  
  createdAt?: string;
  mechanicName?: string;
}

export interface IRepairedPart {
  carPartId?: number;
  partId: number;
  partCost: number;
  partCount?: number;
  mechanicId?: number;
  // replaceDate: string;
}
