import http from '../configs/axios-config';
import { IUser } from '../interfaces/user';

class UserService {
  getUsers = async (): Promise<IUser[]> => {
    const res = await http.get<IUser[]>('/user');
    return res.data;
  };

  getUserById = async (id: number) => {
    const res = await http.get<IUser>(`/user/${id}`);
    return res.data;
  };

  createUser = async (model: IUser) => await http.post('/user', model);

  updateUser = async (id: number, model: IUser) => await http.put(`/user/${id}`, model);

  deleteUser = async (id: number) => await http.delete(`/user/${id}`);
}

const userService = new UserService();
export default userService;
