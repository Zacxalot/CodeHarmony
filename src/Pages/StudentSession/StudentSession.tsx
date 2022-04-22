import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  Stack, CircularProgress, Container, Paper, Button,
  ThemeProvider, Box, Fab,
} from '@mui/material';
import {
  Chat, PlayArrow, Save,
} from '@mui/icons-material';
import { debounce } from 'lodash';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import { renderSection } from '../TeacherSession/TeacherSession';
import CodingInfoWindow from '../../Components/CodingInfoWindow/CodingInfoWindow';
import Console from '../../Components/Console/Console';
import Codemirror from '../../Components/Codemirror/Codemirror';
import { darkTheme } from '../../Theme';
import ChatWindow, { Message } from '../../Components/ChatWindow';
import { useAppSelector } from '../../Redux/hooks';

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
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const username = useAppSelector((state) => state.account.username);

  // eslint-disable-next-line no-undef
  const updateInterval = useRef<NodeJS.Timeout>();

  const codemirrorRef = useRef<Codemirror>(null);
  const consoleRef = useRef<Console>(null);

  // Gets the updates from codemirror and tries sending them to the teacher
  // Only if they are being told to send
  const getUpdates = () => {
    if (codemirrorRef.current && sendingUpdates) {
      const changes = codemirrorRef.current.getChanges(currentVersion);
      console.log(changes);
      if (changes.length !== 0) {
        if (socket) {
          console.log(`Sending ${JSON.stringify(changes)}`);
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
      setSocket(new WebSocket(`ws${document.location.protocol === 'https:' ? 's' : ''}://${window.location.host}:8080/ws`));
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

  // Handle socket messages
  const handleMessage = useCallback((message: MessageEvent<any>) => {
    const text: String = message.data;
    const split = text.split(' ');

    console.log(text);

    if (split[0] === 'sec') {
      setCurrentSection(parseInt(split[1], 10));
    } else if (text === 'unsub') {
      setSendingUpdates(false);
    } else if (text === 'subscribe') {
      if (codemirrorRef.current && socket) {
        socket.send(`sDoc ${JSON.stringify(codemirrorRef.current.getEditorState())}`);
        setCurrentVersion(0);
        codemirrorRef.current.clearChanges();
      }
      setSendingUpdates(true);
    } else if (split[0] === 'txtm') {
      const txtm: Message = JSON.parse(text.substring(5));

      // Copy the messages array and push the new message
      const tmpMessages = [...messages];
      tmpMessages.push(txtm);
      setMessages(tmpMessages);
    }
  }, [socket, messages]);

  // When socket connects
  useEffect(() => {
    const [planName, sessionName, teacherName] = location.pathname.split('/').splice(-3);
    if (socket && planName && sessionName && teacherName) {
      socket.onopen = () => {
        socket.send(`sJoin ${decodeURIComponent(planName)}:${decodeURIComponent(sessionName)}:${decodeURIComponent(teacherName)}`);
        console.log('opened');
      };

      socket.onmessage = handleMessage;
    }
  }, [handleMessage]);

  // When current section changes
  useEffect(() => {
    if (planSections[currentSection] && planSections[currentSection].sectionType === 'CODING  ') {
      const [planName, sessionName, teacherName] = location.pathname.split('/').splice(-3);

      // If we can get all the info we need, post the code
      if (planName
        && sessionName
        && teacherName
        && planSections[currentSection]
      ) {
        console.log('Getting code');
        axios.get<String[]>(`/session/save/${encodeURIComponent(planName)}/${encodeURIComponent(sessionName)}/${encodeURIComponent(teacherName)}/${encodeURIComponent(planSections[currentSection].name)}`)
          .then(({ data }) => {
            if (codemirrorRef.current) {
              console.log(data);
              if (data.length === 1 && data[0].trim() === '') {
                codemirrorRef.current.setEditorState(
                  planSections[currentSection].codingData.startingCode,
                );
              } else {
                codemirrorRef.current.setEditorState(data.join('\n'));
              }
            }
          })
          .catch(() => {
            if (codemirrorRef.current) {
              codemirrorRef.current.setEditorState(
                planSections[currentSection].codingData.startingCode,
              );
            }
          });
      }
    }
  }, [currentSection, planSections]);

  const runCode = () => {
    // eslint-disable-next-line no-unused-vars
    const [planName, _sessionName, teacherName] = location.pathname.split('/').splice(-3);

    console.log('Running code');
    let code;

    // Get code from the Codemirror
    if (codemirrorRef.current) {
      code = codemirrorRef.current.getEditorState()?.join('\n');
    }

    console.log(planName, teacherName, planSections[currentSection], code, planSections);

    if (code !== undefined && planSections[currentSection]) {
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

      // Post the code and identifier to the API
      axios.post<CodeSendResponse>('/run', { piston: sendCode, identifier: { plan_name: planName, host: teacherName, section_name: planSections[currentSection].name } })
        .then(({ data, status }) => {
          if (consoleRef.current) {
            if (status === 202) {
              console.log('Correct answer!');
            } else if (status === 200) {
              console.log('Incorrect!');
            }

            // Push results to console
            consoleRef.current.setState(
              { contents: data.run.stdout, signal: data.run.signal },
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

  const runHandler = useCallback(
    debounce(runCode, 2000, { leading: true }),
    [currentSection, socket, planSections],
  );

  const saveCode = () => {
    let code;

    // Get code from the Codemirror
    if (codemirrorRef.current) {
      code = codemirrorRef.current.getEditorState();
    }

    const [planName, sessionName, teacherName] = location.pathname.split('/').splice(-3);

    // If we can get all the info we need, post the code
    if (code !== undefined
      && planName
      && sessionName
      && teacherName
      && planSections[currentSection]
    ) {
      console.log('Saving code');
      axios.post(`/session/save/${encodeURIComponent(planName)}/${encodeURIComponent(sessionName)}/${encodeURIComponent(teacherName)}/${encodeURIComponent(planSections[currentSection].name)}`, code);
    }
  };

  const saveHandler = useCallback(
    debounce(saveCode, 2000, { leading: true }),
    [planSections, currentSection],
  );

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
              <Codemirror ref={codemirrorRef} disabled={false} />
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
                <Button variant="contained" onClick={() => { runHandler(); }} endIcon={<PlayArrow />}>Run</Button>
                <Button variant="contained" onClick={() => { saveHandler(); }} endIcon={<Save />}>Save</Button>
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

  // Send message to server
  // Return success
  const sendMessage = (txt: string) => {
    if (socket) {
      socket.send(`txtm ${txt}`);
      return (true);
    }
    return (false);
  };

  return (
    <Stack minHeight="100vh" maxHeight={planSections[currentSection] && planSections[currentSection].sectionType === 'CODING  ' ? '100vh' : 'default'} sx={{ backgroundColor: 'background.default' }}>
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
      {renderLectureOrCoding()}
    </Stack>
  );
}
