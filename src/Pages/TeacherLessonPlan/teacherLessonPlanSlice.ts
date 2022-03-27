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
        state[sectionId].elements[id].props = {};
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
      } else if (type === 'prop') {
        // Set the value of a prop
        if (newValue) {
          const [key, val] = newValue.split(':');
          console.log(key);
          console.log(val);
          state[sectionId].elements[id].props[key] = val;
        }
      }
    },
    // Add new element to the selected section
    addNewElement: (state, action: PayloadAction<EditorElementNew>) => {
      const { payload: { sectionId, index } } = action;
      state[sectionId].elements.splice(index, 0, { elType: 'Typography', children: { String: '' }, props: {} });
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
    // eslint-disable-next-line max-len
    setSectionName: (state, action: PayloadAction<{ sectionId: number, newName: string }>) => {
      const { payload: { sectionId, newName } } = action;
      if (!state.find((section) => section.name === newName)) {
        state[sectionId].name = newName;
      }
    },

    // Clears changed flag on items
    clearChangedFlag: (state) => {
      for (let i = 0; i < state.length; i += 1) {
        state[i].changed = false;
      }
    },

    setSectionType: (state, action: PayloadAction<{ sectionId: number, newType: string }>) => {
      const { payload: { sectionId, newType } } = action;
      state[sectionId].sectionType = newType;
    },

    createNewSection: (state, action: PayloadAction<PlanSection>) => {
      state.push(action.payload);
    },

    // eslint-disable-next-line max-len
    setSectionLanguage: (state, action: PayloadAction<{ sectionId: number, newLanguage: string }>) => {
      const { payload: { sectionId, newLanguage } } = action;
      state[sectionId].codingData.language = newLanguage;
      state[sectionId].changed = true;
    },

    // eslint-disable-next-line max-len
    setStarterAndExpectedCode: (state, action: PayloadAction<{ sectionId: number, newCode: string, toSet: string }>) => {
      const { payload: { newCode, sectionId, toSet } } = action;
      if (toSet === 'starter') {
        state[sectionId].codingData.startingCode = newCode;
      } else {
        state[sectionId].codingData.expectedOutput = newCode;
      }
      state[sectionId].changed = true;
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
  setSectionType,
  setSectionLanguage,
  setStarterAndExpectedCode,
} = teacherLessonPlanSlice.actions;
export default teacherLessonPlanSlice.reducer;
