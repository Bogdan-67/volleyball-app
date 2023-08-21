import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  searchValue: string;
  searchValueGroup: string;
}
const initialState: FilterState = {
  searchValue: '',
  searchValueGroup: '',
};
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    setSearchValueGroup(state, action: PayloadAction<string>) {
      state.searchValueGroup = action.payload;
    },
  },
});

export const { setSearchValue, setSearchValueGroup } = filterSlice.actions;

export default filterSlice.reducer;
