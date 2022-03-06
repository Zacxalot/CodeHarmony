import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Stack, CircularProgress } from '@mui/material';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import { renderSection } from '../TeacherSession/TeacherSession';

export default function StudentSession() {
  const location = useLocation();
  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const [planName, sessionName] = location.pathname.split('/').splice(-2);
    axios.get<PlanSection[]>(`/plan/info/${planName}`)
      .then(({ data }) => {
        setPlanSections(data);
      })
      .catch(() => { });
  }, []);

  const renderLoading = () => {
    if (planSections.length === 0) {
      return (<CircularProgress />);
    }
    return null;
  };

  const renderElements = useMemo(() => {
    if (planSections.length !== 0 && currentSection < planSections.length && currentSection >= 0) {
      return (renderSection(planSections[currentSection]));
    }
    return (null);
  }, [planSections, currentSection]);

  return (
    <div>
      <NavBar small />
      <Stack alignItems="center">
        {renderElements}
        {renderLoading()}
      </Stack>
    </div>
  );
}
