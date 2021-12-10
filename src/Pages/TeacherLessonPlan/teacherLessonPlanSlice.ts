import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorElementChange, PlanSection } from "./TeacherLessonPlan";

const initialState: PlanSection[] = [];

export const teacherLessonPlanSlice = createSlice({
    name: 'currentLessonPlan',
    initialState,
    reducers:{
        loadLessonPlan: (state, action: PayloadAction<PlanSection[]>) => {
            while (state.length > 0){
                state.pop();
            }
            action.payload.forEach((section) => state.push(section))
        },
        updateElement: (state, action:PayloadAction<EditorElementChange>) => {
            let payload = action.payload

            if(payload.type === "eltype" && payload.new_value){
                state[payload.section_id].elements[payload.id].el_type = payload.new_value;
            }
            else if(payload.type === "move" && payload.new_value){
                if (payload.new_value === "up" && payload.id !== 0){
                    let temp = state[payload.section_id].elements[payload.id - 1];
                    state[payload.section_id].elements[payload.id - 1] = state[payload.section_id].elements[payload.id]
                    state[payload.section_id].elements[payload.id] = temp
                }

                if (payload.new_value === "down" && payload.id < state[payload.section_id].elements.length -1){
                    let temp = state[payload.section_id].elements[payload.id + 1];
                    state[payload.section_id].elements[payload.id + 1] = state[payload.section_id].elements[payload.id]
                    state[payload.section_id].elements[payload.id] = temp
                }
            }
            else if(payload.type === "child"){
                if(payload.new_value){
                    state[payload.section_id].elements[payload.id].children = {String:payload.new_value}
                }
                else{
                    state[payload.section_id].elements[payload.id].children = {String:""}
                }
                
            }
            
                
            
        }
    }
})

export const {loadLessonPlan, updateElement} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer