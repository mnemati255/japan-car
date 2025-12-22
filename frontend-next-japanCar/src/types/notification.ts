export type BoxType = 'inbox' | 'resolved';

export interface INotification {
  notificationId: number;
  carId: number;
  carModel: string;
  carBrand: string;
  carYear: number;
  carColor: number;
  notificationType: number;
  message: string;
  dueDate: string;
  createdAt: string;
  resolvedDate: string;
  isResolved: boolean;
  resolvedBy?: string;
}
