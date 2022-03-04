import React from 'react';
import axios from 'axios';
import {
  Button, Paper, Stack,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import Codemirror from '../../Components/Codemirror/Codemirror';
import NavBar from '../../Components/NavBar/NavBar';
import Console from '../../Components/Console/Console';
import CodingInfoWindow from '../../Components/CodingInfoWindow/CodingInfoWindow';

interface CodeSendResponse {
  language: string,
  run: {
    stdout: string,
    signal: string | null
  },
  version: string
}

class StudentCoding extends React.Component {
  codemirrorRef: React.RefObject<Codemirror>;

  consoleRef: React.RefObject<Console>;

  constructor(props: any) {
    super(props);
    this.codemirrorRef = React.createRef();
    this.consoleRef = React.createRef();
  }

  runCode = () => {
    let code;

    // Get code from the Codemirror
    if (this.codemirrorRef.current !== null) {
      code = this.codemirrorRef.current.getEditorState()?.join('\n');
    }

    if (code !== undefined) {
      const sendCode = {
        language: 'python',
        version: '3.9.4',
        files: [
          {
            name: 'main.py',
            content: code,
          },
        ],
      };

      axios.post<CodeSendResponse>('/api/v2/execute', sendCode)
        .then((response) => {
          this.consoleRef.current?.setState(
            { contents: response.data.run.stdout, signal: response.data.run.signal },
          );
          this.consoleRef.current?.scrollToBottom();
        })
        .catch((ex) => {
          console.log('Running code failed');
          console.log(ex);
        });
    }
  }

  render() {
    return (
      <Stack minHeight="100vh">
        <NavBar small />
        <Stack flex={1} direction="row" p={1} spacing={1}>
          <Paper sx={{ flex: 1 }}>
            <Stack alignItems="center" height="100%" width="100%">
              <Codemirror ref={this.codemirrorRef} />
            </Stack>
          </Paper>
          <Stack flex={1} spacing={1}>
            <CodingInfoWindow />
            <Console ref={this.consoleRef} />
            <Paper>
              <Stack direction="row" spacing={1} padding={1}>
                <Button variant="contained" onClick={this.runCode} endIcon={<PlayArrow />}>Run</Button>
                <Button variant="outlined">Test</Button>
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Stack>

    );
  }
}

export default StudentCoding;
