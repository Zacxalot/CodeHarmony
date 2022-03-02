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
      const {
        payload: {
          sectionId, type, newValue, id,
        },
      } = action;

      state[sectionId].changed = true;

      if (type === 'eltype' && newValue) {
        // Set the element type to what was selected in the dropdown
        state[sectionId].elements[id].elType = newValue;
      } else if (type === 'move' && newValue) {
        // Move the element up if it isn't at the top
        if (newValue === 'up' && id !== 0) {
          const temp = state[sectionId].elements[id - 1];
          state[sectionId].elements[id - 1] = (
            state[sectionId].elements[id]
          );
          state[sectionId].elements[id] = temp;
        }

        // Move the element down if it isn't at the bottom
        if (newValue === 'down' && id < state[sectionId].elements.length - 1) {
          const temp = state[sectionId].elements[id + 1];
          state[sectionId].elements[id + 1] = (
            state[sectionId].elements[id]
          );
          state[sectionId].elements[id] = temp;
        }
      } else if (type === 'child') {
        // Sets the child value of the component
        // Also sets appropriate props for specific elements
        if (newValue) {
          if (state[sectionId].elements[id].elType === 'img') {
            state[sectionId].elements[id].props = { src: newValue };
          } else {
            state[sectionId].elements[id].children = { String: newValue };
          }
        } else {
          state[sectionId].elements[id].children = { String: '' };
        }
      }
    },
    // Add new element to the selected section
    addNewElement: (state, action: PayloadAction<EditorElementNew>) => {
      const { payload: { sectionId, index } } = action;
      state[sectionId].elements.splice(index, 0, { elType: 'h1', children: { String: '' }, props: [] });
      state[sectionId].changed = true;
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

    // Set the section name
    setSectionName: (state, action: PayloadAction<{ sectionId: number, newName: string }>) => {
      const { payload: { sectionId, newName } } = action;
      if (!state.find((section) => section.name === newName)) {
        state[sectionId].name = newName;
        state[sectionId].changed = true;
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
  setSectionName,
} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer;
