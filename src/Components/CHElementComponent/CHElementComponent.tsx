import React from 'react';
import { Typography } from '@mui/material';
import { CHElement } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import Image from '../Image';

interface CHElementComponentProps {
  element: CHElement
}

function renderElementPreview(element: CHElement) {
  // Get the element class to render
  const elClass = () => {
    switch (element.elType) {
      case 'Typography': return (Typography);
      case 'Image': return (Image);
      default: return (element.elType);
    }
  };

  if (element.elType === 'Image') {
    return React.createElement(elClass() as any, { src: element.children.String });
  }

  return React.createElement(elClass() as any, element.props, element.children.String);
}

function CHElementComponent({ element }: CHElementComponentProps) {
  return (
    <div style={{ wordWrap: 'break-word' }}>
      {renderElementPreview(element)}
    </div>
  );
}

export default CHElementComponent;
