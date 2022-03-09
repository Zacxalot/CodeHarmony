/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Account {
  username: String | undefined,
}

const initialState: Account = { username: undefined };

const userAccountSlice = createSlice({
  name: 'userAccount',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: String }>) => {
      const { payload: { username } } = action;
      state.username = username;
    },
  },
});

export const { login } = userAccountSlice.actions;

export default userAccountSlice.reducer;
