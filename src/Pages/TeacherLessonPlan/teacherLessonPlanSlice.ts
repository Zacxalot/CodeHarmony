import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorElementChange, EditorElementNew, PlanSection } from "./TeacherLessonPlan";

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
                // Set the element type to what was selected in the dropdown
                state[payload.section_id].elements[payload.id].el_type = payload.new_value;
            }
            else if(payload.type === "move" && payload.new_value){
                // Move the element up if it isn't at the top
                if (payload.new_value === "up" && payload.id !== 0){
                    let temp = state[payload.section_id].elements[payload.id - 1];
                    state[payload.section_id].elements[payload.id - 1] = state[payload.section_id].elements[payload.id]
                    state[payload.section_id].elements[payload.id] = temp
                }

                // Move the element down if it isn't at the bottom
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
        },
        addNewElement: (state, action: PayloadAction<EditorElementNew>) => {
            let payload = action.payload
            state[payload.section_id].elements.push({el_type:"h1",children:{String:""},props:{}});
        }
    }
})

export const {loadLessonPlan, updateElement, addNewElement} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer