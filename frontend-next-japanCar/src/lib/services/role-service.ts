import http from '../configs/axios-config';
import { IPermission } from '../interfaces/permission';
import { IRole } from '../interfaces/role';

class RoleService {
  getRoles = async (): Promise<IRole[]> => {
    const res = await http.get<IRole[]>('/role');
    return res.data;
  };

  getPermissions = async (): Promise<IPermission[]> => {
    const res = await http.get<IPermission[]>('/role/permissions');
    return res.data;
  };

  getRoleById = async (id: number) => {
    const res = await http.get<IRole>(`/role/${id}`);
    return res.data;
  };

  createRole = async (model: IRole) => await http.post('/role', model);

  updateRole = async (id: number, model: IRole) => await http.put(`/role/${id}`, model);

  deleteRole = async (id: number) => await http.delete(`/role/${id}`);
}

const roleService = new RoleService();
export default roleService;
