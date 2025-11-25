export interface IRole {
  roleId?: number;
  roleName: string;
  description?: string | null;
  permissionIds: number[];
}
