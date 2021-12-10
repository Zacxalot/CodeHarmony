import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorElementChange, PlanSection } from "./TeacherLessonPlan";

const initialState: PlanSection[] = [];

export const teacherLessonPlanSlice = createSlice({
    name: 'currentLessonPlan',
    initialState,
    reducers:{
        loadLessonPlan: (state, action: PayloadAction<PlanSection[]>) => {
            action.payload.forEach((section) => state.push(section))
        },
        updateElement: (state, action:PayloadAction<EditorElementChange>) => {
            if (action.payload.new_value){
                state[action.payload.section_id].elements[action.payload.id].el_type = action.payload.new_value;
            }
            
        }
    }
})

export const {loadLessonPlan, updateElement} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer