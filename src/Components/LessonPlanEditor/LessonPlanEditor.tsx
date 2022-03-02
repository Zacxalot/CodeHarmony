import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Container, IconButton, Stack,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import LessonPlanEditorElement from '../LessonPlanEditorElement/LessonPlanEditorElement';
import { addNewElement } from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';

interface LessonPlanEditorProps {
  planSection: PlanSection,
  sectionId: number
}

function LessonPlanEditor({ planSection, sectionId }: LessonPlanEditorProps) {
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
      {addElementSlimButton(0)}
      {renderSectionElements()}

    </Stack>
  );
}

export default LessonPlanEditor;
