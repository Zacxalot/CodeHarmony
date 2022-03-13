import { configureStore } from '@reduxjs/toolkit';
import teacherLessonPlanSlice from '../Pages/TeacherLessonPlan/teacherLessonPlanSlice';
import themeSelectorSlice from './themeSelectorSlice';
import userAccountSlice from './userAccountSlice';

export const store = configureStore({
  reducer: {
    planSections: teacherLessonPlanSlice,
    account: userAccountSlice,
    themeSelector: themeSelectorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
