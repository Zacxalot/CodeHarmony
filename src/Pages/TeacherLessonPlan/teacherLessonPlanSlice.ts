// TODO FIX THIS
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorElementChange, EditorElementNew, PlanSection } from './TeacherLessonPlan';

const initialState: PlanSection[] = [];

export const teacherLessonPlanSlice = createSlice({
  name: 'currentLessonPlan',
  initialState,
  reducers: {
    loadLessonPlan: (state, action: PayloadAction<PlanSection[]>) => {
      while (state.length > 0) {
        state.pop();
      }
      action.payload.forEach((section) => state.push(section));
    },
    updateElement: (state, action: PayloadAction<EditorElementChange>) => {
      const { payload } = action;

      state[payload.sectionId].changed = true;

      if (payload.type === 'eltype' && payload.newValue) {
        // Set the element type to what was selected in the dropdown
        state[payload.sectionId].elements[payload.id].elType = payload.newValue;
      } else if (payload.type === 'move' && payload.newValue) {
        // Move the element up if it isn't at the top
        if (payload.newValue === 'up' && payload.id !== 0) {
          const temp = state[payload.sectionId].elements[payload.id - 1];
          state[payload.sectionId].elements[payload.id - 1] = (
            state[payload.sectionId].elements[payload.id]
          );
          state[payload.sectionId].elements[payload.id] = temp;
        }

        // Move the element down if it isn't at the bottom
        if (payload.newValue === 'down' && payload.id < state[payload.sectionId].elements.length - 1) {
          const temp = state[payload.sectionId].elements[payload.id + 1];
          state[payload.sectionId].elements[payload.id + 1] = (
            state[payload.sectionId].elements[payload.id]
          );
          state[payload.sectionId].elements[payload.id] = temp;
        }
      } else if (payload.type === 'child') {
        // Sets the child value of the component
        // Also sets appropriate props for specific elements
        if (payload.newValue) {
          if (state[payload.sectionId].elements[payload.id].elType === 'img') {
            state[payload.sectionId].elements[payload.id].props = { src: payload.newValue };
          } else {
            state[payload.sectionId].elements[payload.id].children = { String: payload.newValue };
          }
        } else {
          state[payload.sectionId].elements[payload.id].children = { String: '' };
        }
      }
    },
    // Add new element to the selected section
    addNewElement: (state, action: PayloadAction<EditorElementNew>) => {
      const { payload } = action;
      const { sectionId, index } = payload;
      state[sectionId].elements.splice(index, 0, { elType: 'h1', children: { String: '' }, props: [] });
      state[payload.sectionId].changed = true;
    },
    removeElement: (state, action: PayloadAction<EditorElementNew>) => {
      const { payload } = action;
      const { sectionId, index } = payload;
      state[sectionId].elements.splice(index, 1);
      state[payload.sectionId].changed = true;
    },
    // Re assign the section orders
    setSectionOrders: (state) => {
      for (let i = 0; i < state.length; i += 1) {
        if (state[i].orderPos !== i) {
          state[i].orderPos = i;
          state[i].changed = true;
        }
      }
    },

    // Clears changed flag on items
    clearChangedFlag: (state) => {
      for (let i = 0; i < state.length; i += 1) {
        state[i].changed = false;
      }
    },

    createNewSection: (state, action: PayloadAction<PlanSection>) => {
      state.push(action.payload);
    },
  },
});

export const {
  loadLessonPlan,
  updateElement,
  addNewElement,
  setSectionOrders,
  clearChangedFlag,
  createNewSection,
  removeElement,
} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer;
