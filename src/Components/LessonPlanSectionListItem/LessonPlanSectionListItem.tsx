// TODO FIX THESE
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import './LessonPlanSectionListItem.scss';

interface LessonPlanSectionListItemProps {
  sectionName: String,
  position: number,
  callback: (index: number) => void
}

function LessonPlanSectionListItem(
  { sectionName, position, callback }: LessonPlanSectionListItemProps,
) {
  const handleSelect = () => {
    callback(position);
  };

  return (
    <li onClick={handleSelect} className="lesson-plan-section-item button-hover">
      <span>{sectionName}</span>
    </li>
  );
}

export default LessonPlanSectionListItem;
