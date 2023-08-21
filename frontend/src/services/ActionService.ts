import $api from '../http';
import { AxiosResponse } from 'axios';
import { IAction } from '../models/IAction';
import { IActionsPage } from '../models/IActionsPage';

export default class ActionService {
  static async getTrainActions(
    day_team: string,
    date: string,
    limit: number,
    page: number,
  ): Promise<AxiosResponse<IActionsPage>> {
    return $api.get<IActionsPage>(
      `/train-actions?date=${date}&day_team=${day_team}&limit=${limit}&page=${page}`,
    );
  }
}
