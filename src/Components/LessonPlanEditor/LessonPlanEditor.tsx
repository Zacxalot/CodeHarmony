// TODO FIX THESE
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useDispatch } from 'react-redux';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import LessonPlanEditorElement from '../LessonPlanEditorElement/LessonPlanEditorElement';
import { addNewElement } from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';
import './LessonPlanEditor.scss';

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

  const handleAddNewElement = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(addNewElement({ sectionId }));
    console.log('Down');
  };

  if (planSection.sectionType === 'undefined') {
    return (<div>To get started, add a new section!</div>);
  }

  return (
    <div className="editor-elements">
      {renderSectionElements()}
      <span onClick={handleAddNewElement} className="editor-element-container button-hover add-element-button">+</span>

    </div>
  );
}

export default LessonPlanEditor;
