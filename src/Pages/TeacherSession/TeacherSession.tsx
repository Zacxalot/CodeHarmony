// TODO FIX THESE
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import axios from 'axios';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { useLocation } from 'react-router-dom';
import {
  Button, Container, Stack, Step, StepLabel, Stepper, CircularProgress, Paper,
  Box, Card, styled, CardActionArea, CardContent, Typography,
} from '@mui/material';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import './TeacherSession.scss';
import CHElementComponent from '../../Components/CHElementComponent/CHElementComponent';
import { useAppSelector } from '../../Redux/hooks';
import Codemirror from '../../Components/Codemirror/Codemirror';
import { ModalBox, ModalContainer } from '../TeacherDashboard/TeacherDashboard';

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

const CodeCard = styled(Card)`
  max-width: 30%;
  width: 100%;
  height: 6rem;
  margin-bottom: 1rem;
`;

function TeacherSession() {
  const location = useLocation();

  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [connectedStudents, setConnectedStudents] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [subbedName, setSubbedName] = useState('');

  const username = useAppSelector((state) => state.account.username);

  const codemirrorRef = useRef<Codemirror>(null);

  const getStudentList = () => {
    if (username) {
      const [planName, sessionName] = location.pathname.split('/').splice(-2);
      axios.get<string[]>(`/session/connected/${username}/${planName}/${sessionName}`).then(({ data }) => {
        setConnectedStudents(data);
      }).catch(() => { });
    }
  };

  // First load
  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8080/ws'));
  }, []);

  useEffect(() => {
    if (username) {
      const [planName, sessionName] = location.pathname.split('/').splice(-2);
      axios.get<LessonSession>(`/session/info/${planName}/${sessionName}/${username}`)
        .then((lessonSession) => {
          setPlanSections(lessonSession.data.plan);
        })
        .catch(() => console.error('Request failed'));
    }
  }, [username]);

  useEffect(() => {
    if (planSections[currentSection] && planSections[currentSection].sectionType === 'CODING  ') {
      getStudentList();
    }
  }, [currentSection]);

  // When the socket connection is made
  useEffect(() => {
    const [planName, sessionName] = location.pathname.split('/').splice(-2);
    if (socket) {
      socket.onopen = () => {
        socket.send(`tJoin ${decodeURIComponent(planName)}:${decodeURIComponent(sessionName)}:user1`);
        console.log('opened');
      };

      socket.onmessage = (message) => {
        const g = message.data;
        console.log(g);
      };
    }
  }, [socket]);

  const renderElements = useMemo(() => {
    if (planSections !== undefined && currentSection < planSections.length && currentSection >= 0) {
      return (renderSection(planSections[currentSection]));
    }

    return <CircularProgress />;
  }, [planSections, currentSection]);

  const setSection = (val: number) => {
    if (socket) {
      socket.send(`tInst setSection ${val}`);
    }
    setCurrentSection(val);
  };

  const regressSection = () => {
    if (planSections !== undefined && currentSection > 0) {
      setSection(currentSection - 1);
    }
  };

  const advanceSection = () => {
    if (planSections !== undefined && currentSection < planSections.length - 1) {
      setSection(currentSection + 1);
    }
  };

  useEffect(() => {
    if (socket) {
      if (subbedName === '') {
        socket.send('unsub');
      } else {
        socket.send(`tInst subscribe ${subbedName}`);
      }
    }
  }, [subbedName]);

  const sectionNavButtons = () => (
    <Stack direction="row" justifyContent="space-between" mt={2}>
      <Button variant="outlined" disabled={currentSection <= 0} onClick={regressSection}>Previous</Button>
      <Button variant="outlined" disabled={currentSection >= (planSections.length - 1)} onClick={advanceSection}>Next</Button>
    </Stack>
  );

  const renderLectureOrCoding = () => {
    if (planSections[currentSection] && planSections[currentSection].sectionType === 'CODING  ') {
      return (
        <div>
          <ModalContainer open={subbedName !== ''}>
            <ModalBox
              sx={{
                maxWidth: '90vw', width: '90vw', maxHeight: '90vh', height: '90vh', overflowY: 'scroll', p: 1,
              }}
              bgcolor="background.default"
            >
              <Codemirror ref={codemirrorRef} />
            </ModalBox>
          </ModalContainer>
          <Stack height="100rem" maxHeight="calc(100vh - 50px - 9rem)" padding="5px" direction="row" spacing="5px">
            <Stack
              sx={{
                p: 2, flex: 1, overflowY: 'auto', minHeight: '100%',
              }}
              direction="row"
              flexWrap="wrap"
              alignContent="flex-start"
              justifyContent="space-around"
            >
              {connectedStudents.map((sUsername) => (
                <CodeCard key={`s-${sUsername}`}>
                  <CardActionArea sx={{ height: '100%' }} onClick={() => { setSubbedName(sUsername); }}>
                    <CardContent>
                      <Stack>
                        <Typography variant="h5" textAlign="center">{sUsername}</Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </CodeCard>
              ))}
            </Stack>
            <Paper sx={{ p: 2, minHeight: '100%', flex: 1 }}>
              {renderElements}
            </Paper>
          </Stack>
        </div>
      );
    }

    // Render lecture section
    return (
      <Box width="100%">
        <Container>
          <Paper sx={{ p: 2 }}>
            {renderElements}
          </Paper>
        </Container>
        <Container>
          {sectionNavButtons()}
        </Container>
      </Box>
    );
  };

  return (
    <div>
      <NavBar />
      <Stack mt={2} spacing={2}>
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
        {renderLectureOrCoding()}
      </Stack>
    </div>
  );
}

export default TeacherSession;
