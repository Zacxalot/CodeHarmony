import React from 'react';
import { useDispatch } from 'react-redux';
import { Stack } from '@mui/material';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import LessonPlanEditorElement from '../LessonPlanEditorElement/LessonPlanEditorElement';
import { addNewElement } from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';

interface LessonPlanEditorProps {
  planSection: PlanSection,
  sectionId: number
}

function LessonPlanEditor({ planSection, sectionId }: LessonPlanEditorProps) {
  const dispatch = useDispatch();

  const renderSectionElements = () => (
    planSection.elements.map((element, index) => (
      <LessonPlanEditorElement
        element={element}
        key={index.toString()}
        sectionId={sectionId}
        id={index}
      />
    ))
  );

  const handleAddNewElement = () => {
    dispatch(addNewElement({ sectionId }));
    console.log('Down');
  };

  if (planSection.sectionType === 'undefined') {
    return (<div>To get started, add a new section!</div>);
  }

  return (
    <Stack spacing={2}>
      {renderSectionElements()}

    </Stack>
  );
}

export default LessonPlanEditor;
