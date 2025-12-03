export type IRoleItem = {
  roleId?: number;
  roleName: string;
  description?: string | null | undefined;
  permissionIds: number[];
  createdAt?: string;
};

export type IPermissionItem = {
  permissionId: number;
  permissionName: string;
};
