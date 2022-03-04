// TODO FIX THESE
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';
import {
  Button,
  Container,
  Stack,
  Step, StepLabel, Stepper, CircularProgress,
} from '@mui/material';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import './TeacherSession.scss';
import CHElementComponent from '../../Components/CHElementComponent/CHElementComponent';

interface LessonSession {
  plan: PlanSection[],
  session: SessionInfo
}

interface SessionInfo {
  date: number
}

export function renderSection(section: PlanSection) {
  if (section.elements) {
    return (
      section.elements.map((element, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <CHElementComponent element={element} key={section.name + index} />
      ))
    );
  }
  return <CircularProgress />;
}

function TeacherSession() {
  const location = useLocation();
  const planName = location.pathname.split('/').slice(-2)[0];
  const sessionName = location.pathname.split('/').slice(-1)[0];

  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(0);

  // First load
  useEffect(() => {
    axios.get<LessonSession>(`/session/info/${planName}/${sessionName}`)
      .then((lessonSession) => {
        setPlanSections(lessonSession.data.plan);
      })
      .catch(() => console.error('Request failed'));
  }, [planName, sessionName]);

  const renderElements = useMemo(() => {
    if (planSections !== undefined && currentSection < planSections.length && currentSection >= 0) {
      return (renderSection(planSections[currentSection]));
    }

    return <span>Could not display section!</span>;
  }, [planSections, currentSection]);

  const regressSection = () => {
    if (planSections !== undefined && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const advanceSection = () => {
    if (planSections !== undefined && currentSection < planSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const sectionNavButtons = () => (
    <Stack direction="row" justifyContent="space-between" mt={2}>
      <Button variant="outlined" disabled={currentSection <= 0} onClick={regressSection}>Previous</Button>
      <Button variant="outlined" disabled={currentSection >= (planSections.length - 1)} onClick={advanceSection}>Next</Button>
    </Stack>
  );

  return (
    <div>
      <NavBar small />
      <Stack alignItems="center" mt={2} spacing={2}>
        <Container>
          <Stepper activeStep={currentSection}>
            {planSections?.map((section) => (
              <Step key={section.name}>
                <StepLabel>{section.name}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {sectionNavButtons()}
        </Container>
        {renderElements}
        <Container>
          {sectionNavButtons()}
        </Container>
      </Stack>
    </div>
  );
}

export default TeacherSession;
