import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  Stack, CircularProgress, Container, Paper, Button, ThemeProvider, Box,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import { renderSection } from '../TeacherSession/TeacherSession';
import CodingInfoWindow from '../../Components/CodingInfoWindow/CodingInfoWindow';
import Console from '../../Components/Console/Console';
import Codemirror from '../../Components/Codemirror/Codemirror';
import { darkTheme } from '../../Theme';

interface CodeSendResponse {
  language: string,
  run: {
    stdout: string,
    signal: string | null
  },
  version: string
}

export default function StudentSession() {
  const location = useLocation();
  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [sendingUpdates, setSendingUpdates] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(0);

  // eslint-disable-next-line no-undef
  const updateInterval = useRef<NodeJS.Timeout>();

  const codemirrorRef = useRef<Codemirror>(null);
  const consoleRef = useRef<Console>(null);

  // Gets the updates from codemirror and tries sending them to the teacher
  // Only if they are being told to send
  const getUpdates = () => {
    if (codemirrorRef.current && sendingUpdates) {
      const changes = codemirrorRef.current.getChanges(currentVersion);
      if (changes.length !== 0) {
        if (socket) {
          socket.send(`sUpdate ${JSON.stringify(changes)}`);
          setCurrentVersion(currentVersion + changes.length);
          console.log(changes);
        }
      }
    }
  };

  useEffect(() => {
    const [planName, , teacherName] = location.pathname.split('/').splice(-3);

    if (planName && teacherName) {
      setSocket(new WebSocket('ws://localhost:8080/ws'));
      axios.get<PlanSection[]>(`/plan/info/student/${planName}/${teacherName}`)
        .then(({ data }) => {
          setPlanSections(data);
        })
        .catch(() => { });
    }

    return function cleanup() {
      if (updateInterval.current) {
        clearTimeout(updateInterval.current);
      }
    };
  }, []);

  // When the requested version changes
  useEffect(() => {
    if (updateInterval.current) {
      clearTimeout(updateInterval.current);
    }

    updateInterval.current = setInterval(() => {
      getUpdates();
    }, 333);
  }, [currentVersion, sendingUpdates]);

  // When socket connects
  useEffect(() => {
    const [planName, sessionName, teacherName] = location.pathname.split('/').splice(-3);
    if (socket && planName && sessionName && teacherName) {
      socket.onopen = () => {
        socket.send(`sJoin ${decodeURIComponent(planName)}:${decodeURIComponent(sessionName)}:${decodeURIComponent(teacherName)}`);
        console.log('opened');
      };

      socket.onmessage = (message) => {
        const text: String = message.data;
        const split = text.split(' ');

        if (split[0] === 'sec') {
          setCurrentSection(parseInt(split[1], 10));
        } else if (text === 'unsub') {
          setSendingUpdates(false);
        } else if (text === 'subscribe') {
          if (codemirrorRef.current) {
            socket.send(`sDoc ${JSON.stringify(codemirrorRef.current.getEditorState())}`);
            codemirrorRef.current.clearChanges();
          }
          setSendingUpdates(true);
        }
      };
    }
  }, [socket]);

  const runCode = () => {
    console.log('Running code');
    let code;

    // Get code from the Codemirror
    if (codemirrorRef.current) {
      code = codemirrorRef.current.getEditorState()?.join('\n');
    }

    if (code !== undefined) {
      const sendCode = {
        language: 'python',
        version: '3.10.0',
        files: [
          {
            name: 'main.py',
            content: code,
          },
        ],
      };

      axios.post<CodeSendResponse>('/api/v2/execute', sendCode)
        .then((response) => {
          if (consoleRef.current) {
            consoleRef.current.setState(
              { contents: response.data.run.stdout, signal: response.data.run.signal },
            );
            consoleRef.current?.scrollToBottom();
          }
        })
        .catch((ex) => {
          console.log('Running code failed');
          console.log(ex);
        });
    }
  };

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

  const renderLectureOrCoding = () => {
    if (planSections[currentSection] && planSections[currentSection].sectionType === 'CODING  ') {
      return (
        <Box>
          <ThemeProvider theme={darkTheme}>
            <Paper
              sx={{
                position: 'absolute', width: 'calc(50% - 7.5px)', height: '100%', maxHeight: 'calc(100vh - 50px)', left: '5px', top: '45px', overflowY: 'scroll', display: 'flex', flexDirection: 'column',
              }}
            >
              <Codemirror ref={codemirrorRef} />
              <Box sx={{ flex: 1 }} onClick={() => { codemirrorRef.current?.focusEditor(); }} />
            </Paper>
          </ThemeProvider>
          <Stack
            flex={1}
            spacing="5px"
            sx={{
              position: 'absolute', width: 'calc(50% - 7.5px)', height: '100%', maxHeight: 'calc(100vh - 50px)', right: '5px', top: '45px',
            }}
          >
            <CodingInfoWindow planSection={planSections[currentSection]} />
            <Console ref={consoleRef} />
            <Paper sx={{ height: '7%' }}>
              <Stack direction="row" spacing={1} padding={1}>
                <Button variant="contained" onClick={runCode} endIcon={<PlayArrow />}>Run</Button>
                <Button variant="outlined">Test</Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      );
    }
    return (
      <Stack alignItems="center" pt={2}>
        <Container>
          <Paper sx={{ p: 2 }}>
            {renderElements}
          </Paper>
        </Container>
        {renderLoading()}
      </Stack>
    );
  };

  return (
    <Stack minHeight="100vh" maxHeight={planSections[currentSection] && planSections[currentSection].sectionType === 'CODING  ' ? '100vh' : 'default'} sx={{ backgroundColor: 'background.default' }}>
      <NavBar />
      {renderLectureOrCoding()}
    </Stack>
  );
}
