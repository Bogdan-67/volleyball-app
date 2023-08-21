import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosResponse } from 'axios';
import TrainService from '../../services/TrainService';
import { Status } from './profileSlice';
import { ActionType } from '../../models/IActionType';

export type AddActionParams = {
  account_id: number;
  team: string;
  selectPlayers: number[];
};

export const getActionsTypes = createAsyncThunk<AxiosResponse<ActionType[]>, void>(
  'train/getActionsTypes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await TrainService.getActionsTypes();
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.message);
    }
  },
);

export interface ActionTypes {
  actionTypes: ActionType[];
  status: string;
}

const initialState: ActionTypes = {
  actionTypes: [],
  status: Status.LOADING,
};

const actionSlice = createSlice({
  name: 'Actions',
  initialState,
  reducers: {
    clearActionTypes(state) {
      state.actionTypes = initialState.actionTypes;
    },
  },
  extraReducers: (builder) => {
    // Кейсы для получения типов действий
    builder.addCase(getActionsTypes.pending, (state) => {
      console.log('LOADING');
      state.status = Status.LOADING;
      state.actionTypes = initialState.actionTypes;
    });
    builder.addCase(getActionsTypes.fulfilled, (state, action) => {
      state.actionTypes = action.payload.data;
      console.log('actionTypes', state.actionTypes);
      state.status = Status.SUCCESS;
    });
    builder.addCase(getActionsTypes.rejected, (state, action) => {
      console.log('REJECTED');
      alert(action.payload);
      state.status = Status.ERROR;
      state.actionTypes = initialState.actionTypes;
    });
  },
});

export const SelectActionTypes = (state: RootState) => state.actionTypes;
export const { clearActionTypes } = actionSlice.actions;

export default actionSlice.reducer;
