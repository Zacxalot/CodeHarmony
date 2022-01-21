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

            state[payload.section_id].changed = true;
            
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
            // Sets the child value of the component
            // Also sets appropriate props for specific elements
            else if(payload.type === "child"){
                if(payload.new_value){
                    if(state[payload.section_id].elements[payload.id].el_type === "img"){
                        state[payload.section_id].elements[payload.id].props = {src:payload.new_value}
                    }
                    else{
                        state[payload.section_id].elements[payload.id].children = {String:payload.new_value}
                    }
                    
                }
                else{
                    state[payload.section_id].elements[payload.id].children = {String:""}
                }
            }
        },
        // Add new element to the selected section
        addNewElement: (state, action: PayloadAction<EditorElementNew>) => {
            let payload = action.payload
            state[payload.section_id].elements.push({el_type:"h1",children:{String:""},props:[]});
        },
        // Re assign the section orders
        setSectionOrders: (state) => {
            for(let i = 0; i < state.length;i++){
                if (state[i].order_pos !== i){
                    state[i].order_pos = i;
                    state[i].changed = true;
                }
            }
        },

        // Clears changed flag on items
        clearChangedFlag: (state) => {
            for(let i = 0; i < state.length;i++){
                state[i].changed = false
            }
        },

        createNewSection:(state, action:PayloadAction<PlanSection>) => {
            state.push(action.payload)
        }
    }
})

export const {loadLessonPlan, updateElement, addNewElement, setSectionOrders, clearChangedFlag, createNewSection} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer