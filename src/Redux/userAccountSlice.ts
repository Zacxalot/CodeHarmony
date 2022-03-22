/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Account {
  username: string | undefined,
}

const initialState: Account = { username: undefined };

const userAccountSlice = createSlice({
  name: 'userAccount',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string }>) => {
      const { payload: { username } } = action;
      state.username = username;
    },
    logout: (state) => {
      state.username = undefined;
    },
  },
});

export const { login, logout } = userAccountSlice.actions;

export default userAccountSlice.reducer;
