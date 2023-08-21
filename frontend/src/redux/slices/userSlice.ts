import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
import { AxiosResponse } from 'axios';
import { Status } from './profileSlice';
import { RootState } from '../store';
import UserService from '../../services/UserService';
import { FetchError } from './trainSlice';
import RoleService from '../../services/RoleService';
import { UsersFetch } from '../../pages/Players';

type RemoveRoleUsersParams = {
  users: number[];
};

type DeleteUserParams = {
  id_user: number;
};

type GiveRoleUsersParams = RemoveRoleUsersParams & {
  role: string;
};

type PageParams = {
  page: number;
  limit: number;
};
type ParamsSearch = {
  value?: string;
  valueGroup?: string;
  page: number;
  limit: number;
};
//Функция запроса users
export const fetchUsers = createAsyncThunk<
  AxiosResponse<UsersFetch>,
  PageParams,
  { rejectValue: FetchError }
>('users/fetchAllUsers', async (params, { rejectWithValue }) => {
  try {
    const { page, limit } = params;
    const response = await UserService.fetchUsers(page, limit);
    console.log('data', response.data);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});
export const searchUsers = createAsyncThunk<
  AxiosResponse<UsersFetch>,
  ParamsSearch,
  { rejectValue: FetchError }
>('users/fetchAllUsers', async (params, { rejectWithValue }) => {
  try {
    const { value, valueGroup, page, limit } = params;
    const response = await UserService.searchUsers(value, valueGroup, page, limit);
    console.log('data', response.data);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});
//Функция добавления роли у user
export const giveRoleUsers = createAsyncThunk<
  AxiosResponse<IUser[]>,
  GiveRoleUsersParams,
  { rejectValue: FetchError }
>('users/giveRoleUsers', async (params, { rejectWithValue }) => {
  try {
    const { role, users } = params;
    const response = await RoleService.giveRoles(role, users);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});
//Функция удаления роли у user
export const removeRoleUsers = createAsyncThunk<
  AxiosResponse<IUser[]>,
  RemoveRoleUsersParams,
  { rejectValue: FetchError }
>('users/removeRoleUsers', async (params, { rejectWithValue }) => {
  try {
    const { users } = params;
    const response = await RoleService.removeRoles(users);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});
//Функция удаления user
export const deleteUser = createAsyncThunk<
  AxiosResponse<IUser>,
  DeleteUserParams,
  { rejectValue: FetchError }
>('users/deleteUser', async (params, { rejectWithValue }) => {
  try {
    const { id_user } = params;
    const response = await UserService.deleteUser(id_user);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});
// Функция обновления данных пользователя
export const updateOneUser = createAsyncThunk<
  AxiosResponse<IUser>,
  { id_user: number; userData: Partial<IUser> }
>('users/updateUserData', async (params, { rejectWithValue }) => {
  try {
    const { id_user, userData } = params;
    const response = await UserService.updateUser(id_user, userData);
    console.log('response', response);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    alert(error.response?.data?.message);
    return rejectWithValue(error.response?.data?.message);
  }
});

export interface User {
  users: IUser[];
  status: Status;
  isLoading: boolean;
  count: number;
  error: string | null;
}

const initialState: User = {
  users: [],
  isLoading: false,
  status: Status.LOADING,
  count: 0,
  error: null,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    usersFetching(state) {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    usersFetchingSuccess(state, action: PayloadAction<IUser[]>) {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.users = action.payload;
      state.error = initialState.error;
    },
    usersFetchingError(state, action) {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
    },
  },
  extraReducers: {
    [fetchUsers.fulfilled.type]: (state, action: PayloadAction<IUser[]>) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.users = action.payload;
      state.error = initialState.error;
    },
    [fetchUsers.pending.type]: (state) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [fetchUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
    },

    [searchUsers.fulfilled.type]: (state, action: PayloadAction<IUser[]>) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.users = action.payload;
      state.error = initialState.error;
    },
    [searchUsers.pending.type]: (state) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [searchUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
    },

    [updateOneUser.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = initialState.error;
      const response = action.payload.data;
      console.log('Обновленный пользователь', response);
      const updUsers = state.users.map((user) => {
        if (user.id_account === response.id_account) {
          return response; // Заменяем объект пользователем с обновленными данными
        }
        return user; // Возвращаем неизмененный объект
      });
      state.status = Status.SUCCESS;
      state.users = updUsers;
    },
    [updateOneUser.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [updateOneUser.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },

    [giveRoleUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const response = action.payload.data;
      console.log('Тут выдают роль', response);

      const updUsers = state.users.map((user) => {
        console.log('Выдалась роль user', response);

        const findUser = response.find((obj) => obj.id_account === user.id_account);
        if (findUser) {
          return findUser;
        } else return user;
      });
      state.users = updUsers;
    },
    [giveRoleUsers.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [giveRoleUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },

    [removeRoleUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const response = action.payload.data;
      const updUsers = state.users.map((user) => {
        const findUser = response.find((obj: IUser) => obj.id_account === user.id_account);
        if (findUser) {
          return findUser;
        } else return user;
      });
      state.users = updUsers;
    },
    [removeRoleUsers.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [removeRoleUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },

    [deleteUser.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const delUser = action.payload.data;
      state.users = state.users.filter((user) => user.id_account !== delUser.id_account);
    },
    [deleteUser.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [deleteUser.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },
    [fetchUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      state.users = action.payload.data.rows;
      state.count = action.payload.data.count;
    },
    [fetchUsers.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [fetchUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },
  },
});
export const SelectUsers = (state: RootState) => state.usersReducer.users;
export const SelectInfoUsers = (state: RootState) => state.usersReducer;

export default userSlice.reducer;
