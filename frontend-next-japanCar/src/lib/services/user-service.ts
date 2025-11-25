import http from '../configs/axios-config';
import { IPermission } from '../interfaces/permission';
import { IRole } from '../interfaces/role';

class UserService {
  getRoles = async (): Promise<IRole[]> => {
    const res = await http.get<IRole[]>('/user/roles');
    return res.data;
  };

  getPermissions = async (): Promise<IPermission[]> => {
    const res = await http.get<IPermission[]>('/user/permissions');
    return res.data;
  };

  getRoleById = async (id: number) => {
    const res = await http.get<IRole>(`/user/role/${id}`);
    return res.data;
  };

  createRole = async (model: IRole) => await http.post('/user/role', model);

  updateRole = async (id: number, model: IRole) =>
    await http.put(`/user/role/${id}`, model);

  deleteRole = async (id: number) => await http.delete(`/user/role/${id}`);
}

const userService = new UserService();
export default userService;
