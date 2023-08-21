import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import profile from './slices/profileSlice';
import train from './slices/trainSlice';
import createTrain from './slices/createTrainSlice';
import actionTypes from './slices/actionTypesSlice';
import actions from './slices/actionsSlice';
import usersReducer from './slices/userSlice';
import stat from './slices/statSlice';

export const store = configureStore({
  reducer: {
    profile,
    train,
    createTrain,
    actionTypes,
    actions,
    usersReducer,
    stat,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
