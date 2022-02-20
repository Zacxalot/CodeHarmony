import React from 'react';
import { CHElement } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import './CHElementComponent.scss';

interface CHElementComponentProps {
  element: CHElement
}

function renderElementPreview(element: CHElement) {
  if (element.elType === 'img') {
    return React.createElement(element.elType, element.props);
  }

  return React.createElement(element.elType, element.props, element.children.String);
}

function CHElementComponent({ element }: CHElementComponentProps) {
  return (
    <div className="element-preview">
      {renderElementPreview(element)}
    </div>
  );
}

export default CHElementComponent;
