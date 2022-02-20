// TODO FIX THESE
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CHElement } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import './LessonPlanEditorElement.scss';
import upArrow from '../../Vectors/up.svg';
import downArrow from '../../Vectors/down.svg';
import { updateElement } from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';
import CHElementComponent from '../CHElementComponent/CHElementComponent';

interface LessonPlanEditorElementProps {
  element: CHElement,
  sectionId: number,
  id: number
}

function LessonPlanEditorElement({ element, sectionId, id }: LessonPlanEditorElementProps) {
  const [textValue, setTextValue] = useState(element.children.String);
  const dispatch = useDispatch();

  useEffect(() => {
    setTextValue(element.children.String);
  }, [element.children.String]);

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Clear the text value if the element is set to image
    if (e.target.value === 'img') {
      setTextValue('');
      dispatch(updateElement({
        type: 'child', newValue: '', id, sectionId,
      }));
    }

    dispatch(updateElement({
      type: 'eltype', newValue: e.target.value, id, sectionId,
    }));
  };

  const handlePositionUp = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(updateElement({
      type: 'move', newValue: 'up', id, sectionId,
    }));
    console.log('Up');
  };

  const handlePositionDown = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(updateElement({
      type: 'move', newValue: 'down', id, sectionId,
    }));
    console.log('Down');
  };

  const handleTextboxChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(updateElement({
      type: 'child', newValue: e.target.value, id, sectionId,
    }));
    setTextValue(e.target.value);
  };

  const renderInput = () => {
    if (element.elType === 'img') {
      return <input className="textbox" onChange={handleTextboxChange} value={textValue} />;
    }

    return <textarea className="textbox" onChange={handleTextboxChange} value={textValue} />;
  };

  return (
    <div className="editor-element-container">
      <div className="editor-preview">
        <CHElementComponent element={element} />
      </div>
      <div className="editor-options">
        <div className="options-container">
          <select value={element.elType} onChange={handleTypeChange}>
            <option value="h1">Heading</option>
            <option value="p">Paragraph</option>
            <option value="img">Image</option>
          </select>
          {renderInput()}
        </div>

        <div className="arrow-container">
          <span onClick={handlePositionUp} className="arrow-button button-hover">
            <img src={upArrow} className="arrow-image" alt="up arrow" />
          </span>
          <span onClick={handlePositionDown} className="arrow-button arrow-button-down button-hover">
            <img src={downArrow} className="arrow-image" alt="down arrow" />
          </span>
        </div>
      </div>

    </div>
  );
}

export default LessonPlanEditorElement;
