// import axios from "axios";
import {
  CircularProgress, Paper, Stack,
} from '@mui/material';
import React from 'react';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import { renderSection } from '../../Pages/TeacherSession/TeacherSession';
import './CodingInfoWindow.scss';

interface CodingInfoWindowProps {
  planSection?: PlanSection
}

function CodingInfoWindow({ planSection }: CodingInfoWindowProps) {
  const renderPlanSection = () => {
    if (planSection) {
      return (renderSection(planSection));
    }
    return (<CircularProgress />);
  };

  return (
    <Paper sx={{ height: 'calc(60% - 10px)', overflowY: 'scroll' }}>
      <Stack>
        {renderPlanSection()}
      </Stack>
    </Paper>
  );
}

CodingInfoWindow.defaultProps = {
  planSection: {},
};

export default CodingInfoWindow;
