import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Container, IconButton, Paper, Stack, TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import LessonPlanEditorElement from '../LessonPlanEditorElement/LessonPlanEditorElement';
import { addNewElement, setSectionName } from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';

interface LessonPlanEditorProps {
  planSection: PlanSection,
  sectionId: number,
  // eslint-disable-next-line no-unused-vars
  sectionNameChecker: (arg0: string) => boolean
}

function LessonPlanEditor({ planSection, sectionId, sectionNameChecker }: LessonPlanEditorProps) {
  const [updateSectionNameText, setUpdateSectionNameText] = useState(planSection.name);
  const [updateSectionNameError, setUpdateSectionNameError] = useState('');

  const dispatch = useDispatch();

  const handleAddNewElement = (index: number) => {
    dispatch(addNewElement({ index, sectionId }));
  };

  const addElementSlimButton = (index: number) => <Button variant="outlined" onClick={() => handleAddNewElement(index)} endIcon={<Add />} fullWidth />;

  const renderSectionElements = () => (
    planSection.elements.map((element, index) => (
      <Stack spacing={1} key={index.toString()}>
        <LessonPlanEditorElement
          element={element}
          sectionId={sectionId}
          id={index}
        />
        {addElementSlimButton(index + 1)}
      </Stack>
    ))
  );

  if (planSection.sectionType === 'undefined') {
    return (<div>To get started, add a new section!</div>);
  }

  return (
    // eslint-disable-next-line react/no-unstable-nested-components
    <Stack spacing={2}>
      <Paper>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <TextField
            onChange={(e) => {
              setUpdateSectionNameText(e.target.value);
              if (sectionNameChecker(e.target.value) === true) {
                setUpdateSectionNameError('Section name in use');
              } else {
                setUpdateSectionNameError('');
              }
            }}
            error={updateSectionNameError !== ''}
            helperText={updateSectionNameError}
          />
          <Button
            size="large"
            onClick={() => {
              dispatch(setSectionName({ sectionId, newName: updateSectionNameText }));
            }}
            variant="contained"
            disabled={updateSectionNameText.trim().length === 0 || updateSectionNameError !== ''}
          >
            Update
          </Button>
        </Stack>
      </Paper>
      {addElementSlimButton(0)}
      {renderSectionElements()}

    </Stack>
  );
}

export default LessonPlanEditor;
