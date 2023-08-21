import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AxiosResponse } from 'axios';
import { ITrain } from '../../models/ITrain';
import TrainService from '../../services/TrainService';
import { Status } from './profileSlice';

export type FetchError = {
  message: string;
};

export type NewTrainParams = {
  account_id: number;
  team: string;
  selectPlayers: number[];
};

export type AddPlayerTrainParams = {
  account_id: number;
  date: string;
  team: string;
};

export type GetTrainParams = {
  account_id: number;
  team: string;
  date: string;
};

export type DeletePlayerTrainParams = {
  account_id: number;
  id_train: number;
};

export type TrainParams = {
  team: string;
  date: string;
};

export type PostActionParams = {
  id_train: number;
  id_action_type: number;
  name_action: string;
  result: string;
  condition: string;
  score: number;
  date: string;
  team: string;
};

export type DeleteActionParams = {
  id_action: number;
};

export type Players = ITrain[];

export const postNewTrain = createAsyncThunk<
  AxiosResponse<Players>,
  NewTrainParams,
  { rejectValue: FetchError }
>('train/postNewTrain', async (params, { rejectWithValue }) => {
  try {
    const { account_id, team, selectPlayers } = params;
    const response = await TrainService.newTrain(account_id, team, selectPlayers);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export const addPlayerTrain = createAsyncThunk<
  AxiosResponse<ITrain>,
  AddPlayerTrainParams,
  { rejectValue: FetchError }
>('train/addPlayerTrain', async (params, { rejectWithValue }) => {
  try {
    const { account_id, date, team } = params;
    const response = await TrainService.addPlayerTrain(account_id, date, team);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export const getTeamTrain = createAsyncThunk<
  AxiosResponse<Players>,
  GetTrainParams,
  { rejectValue: FetchError }
>('train/getTeamTrain', async (params, { rejectWithValue }) => {
  try {
    const { account_id, team, date } = params;
    const response = await TrainService.getTrain(account_id, team, date);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export const deleteTeamTrain = createAsyncThunk<
  AxiosResponse<Players>,
  GetTrainParams,
  { rejectValue: FetchError }
>('train/deleteTeamTrain', async (params, { rejectWithValue }) => {
  try {
    const { account_id, team, date } = params;
    const response = await TrainService.deleteTrain(account_id, date, team);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export const deletePlayerTrain = createAsyncThunk<
  AxiosResponse<ITrain>,
  DeletePlayerTrainParams,
  { rejectValue: FetchError }
>('train/deletePlayerTrain', async (params, { rejectWithValue }) => {
  try {
    const { account_id, id_train } = params;
    const response = await TrainService.deletePlayerTrain(account_id, id_train);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export const postAction = createAsyncThunk<
  AxiosResponse<ITrain>,
  PostActionParams,
  { rejectValue: FetchError }
>('train/postActionParams', async (params, { rejectWithValue }) => {
  try {
    const { id_train, id_action_type, name_action, result, condition, score, date, team } = params;
    console.log('id_train in redux', id_train);
    const response = await TrainService.addAction(
      id_train,
      id_action_type,
      name_action,
      result,
      condition,
      score,
      date,
      team,
    );
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export const deleteAction = createAsyncThunk<
  AxiosResponse<ITrain>,
  DeleteActionParams,
  { rejectValue: FetchError }
>('train/deleteActionParams', async (params, { rejectWithValue }) => {
  try {
    const { id_action } = params;
    const response = await TrainService.deleteTrainAction(id_action);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export interface Train {
  date: string;
  team: string;
  players: Players;
  status: Status;
  error: string | null;
}

const initialState: Train = {
  date: '',
  team: '',
  players: [],
  status: Status.LOADING,
  error: null,
};

const trainSlice = createSlice({
  name: 'Training',
  initialState,
  reducers: {
    setTeam(state, action: PayloadAction<string>) {
      state.team = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setTrainParams(state, action: PayloadAction<TrainParams>) {
      state.date = action.payload.date;
      state.team = action.payload.team;
    },
    setError(state) {
      state.status = Status.ERROR;
    },
    setLoading(state) {
      state.status = Status.LOADING;
    },
    clearTrain(state) {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    // Кейсы для создания новой тренировки
    builder.addCase(postNewTrain.pending, (state) => {
      state.status = Status.LOADING;
      state.players = initialState.players;
      state.error = initialState.error;
    });
    builder.addCase(postNewTrain.fulfilled, (state, action) => {
      state.players = action.payload.data;
      console.log('players', state.players);
      state.status = Status.SUCCESS;
      state.error = initialState.error;
    });
    builder.addCase(postNewTrain.rejected, (state, action) => {
      console.log('REJECTED');
      alert(action.payload);
      state.status = Status.ERROR;
      state.error = action.payload.message;
      state.players = initialState.players;
    });

    // Кейсы для добавления игрока
    builder.addCase(addPlayerTrain.pending, (state) => {
      state.status = Status.LOADING;
      state.error = initialState.error;
    });
    builder.addCase(addPlayerTrain.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const newPlayer = action.payload.data;
      state.players.push(newPlayer);
    });
    builder.addCase(addPlayerTrain.rejected, (state, action) => {
      alert(action.payload.message);
      state.status = Status.ERROR;
    });

    // Кейсы для получения тренировки
    builder.addCase(getTeamTrain.pending, (state) => {
      state.status = Status.LOADING;
      state.players = initialState.players;
      state.error = initialState.error;
    });
    builder.addCase(getTeamTrain.fulfilled, (state, action) => {
      state.players = action.payload.data;
      console.log('players in trainSlice', state.players);
      state.status = Status.SUCCESS;
      state.error = initialState.error;
    });
    builder.addCase(getTeamTrain.rejected, (state, action) => {
      console.log('REJECTED');
      state.status = Status.ERROR;
      state.error = action.payload.message;
      state.players = initialState.players;
    });

    // Кейсы для добавления действия
    builder.addCase(postAction.pending, (state) => {
      state.status = Status.LOADING;
      state.error = initialState.error;
    });
    builder.addCase(postAction.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const updPlayer = action.payload.data;
      const playersData = state.players.map((item) => {
        if (item.id_train === updPlayer.id_train) {
          return updPlayer;
        }
        return item;
      });
      state.players = playersData;
    });
    builder.addCase(postAction.rejected, (state, action) => {
      console.log('REJECTED');
      console.log(action.payload);
      state.status = Status.ERROR;
      state.error = action.payload.message;
    });

    // Кейсы для удаления действия
    builder.addCase(deleteAction.pending, (state) => {
      state.status = Status.LOADING;
      state.error = initialState.error;
    });
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const updPlayer = action.payload.data;
      const playersData = state.players.map((item) => {
        if (item.id_train === updPlayer.id_train) {
          return updPlayer;
        }
        return item;
      });
      state.players = playersData;
    });
    builder.addCase(deleteAction.rejected, (state, action) => {
      console.log('REJECTED');
      console.log(action.payload);
      state.error = action.payload.message;
      state.status = Status.ERROR;
    });

    // Кейсы для удаления тренировки команды
    builder.addCase(deleteTeamTrain.pending, (state) => {
      state.status = Status.LOADING;
      state.error = initialState.error;
    });
    builder.addCase(deleteTeamTrain.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.players = initialState.players;
      state.team = initialState.team;
      state.date = initialState.date;
      state.status = initialState.status;
      state.error = initialState.error;
    });
    builder.addCase(deleteTeamTrain.rejected, (state, action) => {
      console.log('REJECTED');
      console.log(action.payload);
      state.error = action.payload.message;
      state.status = Status.ERROR;
    });

    // Кейсы для удаления игрока из тренировки
    builder.addCase(deletePlayerTrain.pending, (state) => {
      state.status = Status.LOADING;
      state.error = initialState.error;
    });
    builder.addCase(deletePlayerTrain.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const deletedPlayer = action.payload.data;
      const playersData = state.players.filter((item) => item.id_train !== deletedPlayer.id_train);
      state.players = playersData;
    });
    builder.addCase(deletePlayerTrain.rejected, (state, action) => {
      console.log('REJECTED');
      console.log(action.payload);
      state.error = action.payload.message;
      state.status = Status.ERROR;
    });
  },
});

export const SelectTrainStatus = (state: RootState) => state.train.status;
export const SelectTrainError = (state: RootState) => state.train.error;
export const SelectTrainPlayers = (state: RootState) => state.train.players;
export const SelectTrainTeam = (state: RootState) => state.train.team;
export const SelectTrainDate = (state: RootState) => state.train.date;
export const SelectTrain = (state: RootState) => state.train;
export const { setTeam, setDate, setError, setLoading, clearTrain, setTrainParams } =
  trainSlice.actions;

export default trainSlice.reducer;
