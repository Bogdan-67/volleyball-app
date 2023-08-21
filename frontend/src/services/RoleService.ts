import $api from '../http';
import { AxiosResponse } from 'axios';
import { IUser } from '../models/IUser';

export default class RoleService {
  static fetchRoles(): Promise<AxiosResponse<string[]>> {
    return $api.get<string[]>('/roles');
  }
  static giveRoles(role: string, users: number[]): Promise<AxiosResponse<IUser[]>> {
    return $api.post<IUser[]>('/roles', { role, users });
  }
  static removeRoles(users: number[]): Promise<AxiosResponse<IUser[]>> {
    return $api.post<IUser[]>('/remove-roles', { users });
  }
}
