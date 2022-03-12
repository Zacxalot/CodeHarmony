// TODO FIX THESE
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ListItem, ListItemButton } from '@mui/material';
import React from 'react';
import './LessonPlanSectionListItem.scss';

interface LessonPlanSectionListItemProps {
  sectionName: String,
  // eslint-disable-next-line no-unused-vars
  callback: () => void
}

function LessonPlanSectionListItem(
  { sectionName, callback }: LessonPlanSectionListItemProps,
) {
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ justifyContent: 'center' }} onClick={callback}>
        {sectionName}
      </ListItemButton>
    </ListItem>
  );
}

export default LessonPlanSectionListItem;
