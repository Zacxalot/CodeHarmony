import { configureStore } from '@reduxjs/toolkit'
import teacherLessonPlanSlice from '../Pages/TeacherLessonPlan/teacherLessonPlanSlice'

export const store = configureStore({
  reducer: {
      planSections: teacherLessonPlanSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch