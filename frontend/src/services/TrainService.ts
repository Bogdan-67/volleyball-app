import $api from '../http';
import { AxiosResponse } from 'axios';
import { ITrain } from '../models/ITrain';
import { ActionType } from '../models/IActionType';
import { UserTrain } from '../pages/UserTraining';

export default class TrainService {
  static async newTrain(
    account_id: number,
    day_team: string,
    players: number[],
  ): Promise<AxiosResponse<ITrain[]>> {
    return $api.post<ITrain[]>('/team-train', {
      account_id,
      day_team,
      players,
    });
  }

  static async addPlayerTrain(
    account_id: number,
    date: string,
    day_team: string,
  ): Promise<AxiosResponse<ITrain>> {
    return $api.post<ITrain>('/train', {
      account_id,
      date,
      day_team,
    });
  }

  static async getTrain(
    account_id: number,
    day_team: string,
    date: string,
  ): Promise<AxiosResponse<ITrain[]>> {
    return $api.get<ITrain[]>(
      `/team-train?account_id=${account_id}&date=${date}&day_team=${day_team}`,
    );
  }

  static async getOneTrain(
    id_train: number,
    account_id: number,
  ): Promise<AxiosResponse<UserTrain>> {
    return $api.get<UserTrain>(`/train/${account_id}?id_train=${id_train}`);
  }

  static async getTeamRangeStat(
    account_id: number,
    day_team: string,
    date_start: string,
    date_end: string,
  ): Promise<AxiosResponse<ITrain[]>> {
    return $api.get<ITrain[]>(
      `/team-stat?account_id=${account_id}&date_start=${date_start}&date_end=${date_end}&day_team=${day_team}`,
    );
  }

  static async addAction(
    id_train: number,
    id_action_type: number,
    name_action: string,
    result: string,
    condition: string,
    score: number,
    date: string,
    day_team: string,
  ): Promise<AxiosResponse<ITrain>> {
    return $api.post<ITrain>('/action', {
      id_train,
      id_action_type,
      name_action,
      result,
      condition,
      score,
      date,
      day_team,
    });
  }

  static async deleteTrainAction(id_action: number): Promise<AxiosResponse<ITrain>> {
    return $api.delete<ITrain>(`/train-action?id_action=${id_action}`);
  }

  static async deleteTrain(
    account_id: number,
    date: string,
    day_team: string,
  ): Promise<AxiosResponse<ITrain[]>> {
    return $api.delete<ITrain[]>(`/team-train/${account_id}?date=${date}&day_team=${day_team}`);
  }

  static async deletePlayerTrain(
    account_id: number,
    id_train: number,
  ): Promise<AxiosResponse<ITrain>> {
    return $api.delete<ITrain>(`/train/${account_id}?id_train=${id_train}`);
  }

  static async checkTeam(team: string): Promise<AxiosResponse<boolean>> {
    return $api.get<boolean>(`/team/${team}`);
  }

  static async getTeams(): Promise<AxiosResponse<string[]>> {
    return $api.get<string[]>(`/teams`);
  }

  static async getTeamDates(day_team: string): Promise<AxiosResponse<string[]>> {
    return $api.get<string[]>(`/team-dates?day_team=${day_team}`);
  }

  static async getActionsTypes(): Promise<AxiosResponse<ActionType[]>> {
    return $api.get<ActionType[]>(`/action-types`);
  }
}
