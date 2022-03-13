/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeOption = 'light' | 'dark';

export interface SelectTheme {
  theme: ThemeOption,
}

const initialState: SelectTheme = { theme: 'light' };

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  initialState.theme = 'dark';
}

const themeSelectorSlice = createSlice({
  name: 'themeSelector',
  initialState,
  reducers: {
    setTheme: (state, { payload: { theme } }: PayloadAction<{ theme: ThemeOption }>) => {
      state.theme = theme;
    },
  },
});

export const { setTheme } = themeSelectorSlice.actions;

export default themeSelectorSlice.reducer;
