import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
  static async login(login: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/login', { login, password });
  }

  static async registration(
    login: string,
    password: string,
    name: string,
    surname: string,
    patronimyc: string,
    email: string,
    phone: string,
    team: string,
    recaptha: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/registration', {
      login,
      password,
      name,
      surname,
      patronimyc,
      email,
      phone,
      team,
      ['g-recaptcha-response']: recaptha,
    });
  }

  static async logout(): Promise<void> {
    return $api.post('/logout');
  }
}
