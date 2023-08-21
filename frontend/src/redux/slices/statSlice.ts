import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AxiosResponse } from 'axios';
import { ITrain } from '../../models/ITrain';
import TrainService from '../../services/TrainService';
import { Status } from './profileSlice';

type FetchError = {
  message: string;
};

export type StatParams = {
  team: string;
  date_start: string;
  date_end: string;
};

export type GetTeamRangeStatParams = {
  account_id: number;
  team: string;
  date_start: string;
  date_end: string;
};

export type Players = ITrain[];

export const getTeamRangeStat = createAsyncThunk<
  AxiosResponse<Players>,
  GetTeamRangeStatParams,
  { rejectValue: FetchError }
>('stat/getTeamTrain', async (params, { rejectWithValue }) => {
  try {
    const { account_id, team, date_start, date_end } = params;
    const response = await TrainService.getTeamRangeStat(account_id, team, date_start, date_end);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export interface Stat {
  date_start: string;
  date_end: string;
  team: string;
  playersRangeStat: Players;
  status: Status;
  error: string | null;
}

const initialState: Stat = {
  date_start: '',
  date_end: '',
  team: '',
  playersRangeStat: [],
  status: Status.LOADING,
  error: null,
};

const statSlice = createSlice({
  name: 'Statistics',
  initialState,
  reducers: {
    setStatTeam(state, action: PayloadAction<string>) {
      state.team = action.payload;
    },
    setStatParams(state, action: PayloadAction<StatParams>) {
      state.team = action.payload.team;
      state.date_start = action.payload.date_start;
      state.date_end = action.payload.date_end;
    },
    setDateStart(state, action: PayloadAction<string>) {
      state.date_start = action.payload;
    },
    setDateEnd(state, action: PayloadAction<string>) {
      state.date_end = action.payload;
    },
    clearStat(state) {
      state.playersRangeStat = initialState.playersRangeStat;
    },
  },
  extraReducers: (builder) => {
    // Кейсы для получения тренировки
    builder.addCase(getTeamRangeStat.pending, (state) => {
      console.log('getTeamRangeStat LOADING');
      state.status = Status.LOADING;
      state.playersRangeStat = initialState.playersRangeStat;
      state.error = initialState.error;
    });
    builder.addCase(getTeamRangeStat.fulfilled, (state, action) => {
      state.playersRangeStat = action.payload.data;
      console.log('playersRangeStat in slice', state.playersRangeStat);
      state.status = Status.SUCCESS;
      state.error = initialState.error;
    });
    builder.addCase(getTeamRangeStat.rejected, (state, action) => {
      console.log('REJECTED');
      state.status = Status.ERROR;
      state.error = action.payload.message;
      state.playersRangeStat = initialState.playersRangeStat;
    });
  },
});

export const SelectTeamStatStatus = (state: RootState) => state.stat.status;
export const SelectTeamStatError = (state: RootState) => state.stat.error;
export const SelectTeamStatPlayers = (state: RootState) => state.stat.playersRangeStat;
export const SelectTeamStatTeam = (state: RootState) => state.stat.team;
export const SelectTeamStat = (state: RootState) => state.stat;
export const { setStatTeam, setStatParams, setDateStart, setDateEnd, clearStat } =
  statSlice.actions;

export default statSlice.reducer;
