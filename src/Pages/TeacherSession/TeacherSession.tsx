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
  Box, Card, CardActionArea, CardContent, Typography, Fab, Grid,
} from '@mui/material';
import { ChangeSet } from '@codemirror/state';
import { Chat } from '@mui/icons-material';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import CHElementComponent from '../../Components/CHElementComponent/CHElementComponent';
import { useAppSelector } from '../../Redux/hooks';
import Codemirror from '../../Components/Codemirror/Codemirror';
import { ModalBox, ModalContainer } from '../TeacherDashboard/TeacherDashboard';
import ChatWindow, { Message } from '../../Components/ChatWindow';

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

  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [connectedStudents, setConnectedStudents] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [subbedName, setSubbedName] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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
    setSocket(new WebSocket(`ws${document.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/ws`));
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
    if (socket && planName && sessionName && username) {
      socket.onopen = () => {
        socket.send(`tJoin ${decodeURIComponent(planName)}:${decodeURIComponent(sessionName)}:${decodeURIComponent(username)}`);
        console.log('opened');
      };

      socket.onmessage = (message) => {
        const text: string = message.data;
        const split = text.split(' ');

        console.log(text);

        if (split[0] === 'sDoc') {
          // Set the inital state of the editor
          const doc = JSON.parse(text.slice(5)).join('\n');
          if (codemirrorRef.current && codemirrorRef.current.view) {
            codemirrorRef.current.setEditorState(doc);
          }
        } else if (split[0] === 'sUpdate') {
          // Get the changes array and turn it into an array of TransactionSpecs
          // Then let the editor update with them
          const rawArray: any[] = JSON.parse(text.slice(8));
          const changes = rawArray.map((change: any) => ({ changes: ChangeSet.fromJSON(change) }));
          if (codemirrorRef.current) {
            codemirrorRef.current.applyChanges(changes);
          }
        } else if (split[0] === 'txtm') {
          const txtm: Message = JSON.parse(text.substring(5));

          // Copy the messages array and push the new message
          const tmpMessages = [...messages];
          tmpMessages.push(txtm);
          setMessages(tmpMessages);
        }
      };
    }
  }, [socket, messages, planSections, username]);

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

  // Send message to server
  // Return success
  const sendMessage = (txt: string) => {
    if (socket) {
      socket.send(`txtm ${txt}`);
      return (true);
    }
    return (false);
  };

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
          <ModalContainer open={subbedName !== ''} onClose={() => { setSubbedName(''); }}>
            <ModalBox
              sx={{
                maxWidth: '90vw', width: '90vw', maxHeight: '90vh', height: '90vh', overflowY: 'scroll', p: 1,
              }}
              bgcolor="background.default"
            >
              <Codemirror ref={codemirrorRef} disabled />
            </ModalBox>
          </ModalContainer>
          <Stack height="100rem" maxHeight="calc(100vh - 50px - 9rem)" padding="5px" direction="row" spacing="5px">
            <Grid
              container
              sx={{
                p: 2, flex: 1, overflowY: 'auto', minHeight: '100%',
              }}
              alignContent="flex-start"
              spacing={2}
              justifyContent="center"
            >
              {connectedStudents.map((sUsername) => (
                <Grid item key={`s - ${sUsername}`}>
                  <Card>
                    <CardActionArea sx={{ height: '100%' }} onClick={() => { setSubbedName(sUsername); }}>
                      <CardContent>
                        <Typography variant="h5" textAlign="center">{sUsername}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}

              <Grid item>
                <Card>
                  <CardActionArea sx={{ height: '100%' }} onClick={() => { setSubbedName('Bob'); }}>
                    <CardContent>
                      <Typography variant="h5" textAlign="center">Bob</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <CardActionArea sx={{ height: '100%' }} onClick={() => { setSubbedName('Bob'); }}>
                    <CardContent>
                      <Typography variant="h5" textAlign="center">Charli</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <CardActionArea sx={{ height: '100%' }} onClick={() => { setSubbedName('Bob'); }}>
                    <CardContent>
                      <Typography variant="h5" textAlign="center">Toni</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

            </Grid>
            <Paper sx={{
              p: 2, minHeight: '100%', flex: 1, overflowY: 'auto',
            }}
            >
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
      <Fab sx={{ position: 'fixed', bottom: 16, left: 16 }} onClick={() => { setChatOpen(true); }}>
        <Chat />
      </Fab>
      <ChatWindow
        onClose={() => { setChatOpen(false); }}
        open={chatOpen}
        username={username || ''}
        messages={messages}
        messageSend={sendMessage}
      />
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
