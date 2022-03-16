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

  const codemirrorRef = useRef<Codemirror>(null);
  const consoleRef = useRef<Console>(null);

  useEffect(() => {
    console.log('running');
    const [planName] = location.pathname.split('/').splice(-2);
    setSocket(new WebSocket('ws://localhost:8080/ws'));
    axios.get<PlanSection[]>(`/plan/info/${planName}`)
      .then(({ data }) => {
        setPlanSections(data);
      })
      .catch(() => { });
  }, []);

  // When socket connects
  useEffect(() => {
    const [planName, sessionName] = location.pathname.split('/').splice(-2);
    if (socket) {
      socket.onopen = () => {
        socket.send(`sJoin ${planName}:${sessionName}:user1`);
        console.log('opened');
      };

      socket.onmessage = (message) => {
        const text: String = message.data;
        const split = text.split(' ');

        if (split[0] === 'sec') {
          setCurrentSection(parseInt(split[1], 10));
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
          <Paper
            sx={{
              position: 'absolute', width: 'calc(50% - 7.5px)', height: '100%', maxHeight: 'calc(100vh - 50px)', left: '5px', top: '45px', overflowY: 'scroll',
            }}
          >
            <Codemirror ref={codemirrorRef} />
          </Paper>
          <Stack
            flex={1}
            spacing={1}
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
    <Stack minHeight="100vh" maxHeight="100vh">
      <NavBar />
      {renderLectureOrCoding()}
    </Stack>
  );
}
