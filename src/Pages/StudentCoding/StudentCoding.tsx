import React, { useRef, useState } from 'react';
import axios from 'axios';
import {
  Button, Paper, Stack,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import Codemirror from '../../Components/Codemirror/Codemirror';
import NavBar from '../../Components/NavBar/NavBar';
import Console from '../../Components/Console/Console';
import CodingInfoWindow from '../../Components/CodingInfoWindow/CodingInfoWindow';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';

interface CodeSendResponse {
  language: string,
  run: {
    stdout: string,
    signal: string | null
  },
  version: string
}

export function StudentCoding() {
  const codemirrorRef = useRef<Codemirror>(null);
  const consoleRef = useRef<Console>(null);
  const [planSection, setPlanSection] = useState<PlanSection>();

  const runCode = () => {
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

  return (
    <Stack minHeight="100vh">
      <NavBar />
      <Stack flex={1} direction="row" p={1} spacing={1}>
        <Paper sx={{ flex: 1 }}>
          <Stack alignItems="center" height="100%" width="100%">
            <Codemirror ref={codemirrorRef} />
          </Stack>
        </Paper>
        <Stack flex={1} spacing={1}>
          <CodingInfoWindow planSection={planSection} />
          <Console ref={consoleRef} />
          <Paper>
            <Stack direction="row" spacing={1} padding={1}>
              <Button variant="contained" onClick={runCode} endIcon={<PlayArrow />}>Run</Button>
              <Button variant="outlined">Test</Button>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Stack>

  );
}

export default StudentCoding;
