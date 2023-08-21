import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface NewTrainData {
  selectPlayers: number[];
  team: string;
}

const initialState: NewTrainData = {
  selectPlayers: [],
  team: '',
};

const createTrainSlice = createSlice({
  name: 'createTraining',
  initialState,
  reducers: {
    setSelectedTeam(state, action: PayloadAction<string>) {
      state.team = action.payload;
    },
    clearTeam(state) {
      state.team = initialState.team;
    },
    setPlayers(state, action: PayloadAction<number[]>) {
      state.selectPlayers = action.payload;
    },
  },
});

export const SelectCreateTrain = (state: RootState) => state.createTrain;
export const { setSelectedTeam, clearTeam, setPlayers } = createTrainSlice.actions;

export default createTrainSlice.reducer;
