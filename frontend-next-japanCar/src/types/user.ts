export type IUser = {
  userId?: number;
  userName: string;
  password?: string;
  email?: string | null;
  roleIds: number[];
  isActive: boolean;
  createdAt?: string;
};
