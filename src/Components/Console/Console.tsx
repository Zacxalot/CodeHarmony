// TODO Fix
/* eslint-disable react/destructuring-assignment */
import { ThemeProvider } from '@emotion/react';
import { Paper } from '@mui/material';
import React, { RefObject } from 'react';
import { darkTheme } from '../../Theme';
import './Console.scss';

interface ConsoleProps {
}

interface ConsoleState {
  contents: String,
  signal: String | null
}

class Console extends React.Component<ConsoleProps, ConsoleState> {
  scrollRef: RefObject<HTMLPreElement>;

  constructor(props: ConsoleProps) {
    super(props);
    this.state = { contents: '', signal: null };
    this.scrollRef = React.createRef();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  scrollToBottom() {
    if (this.scrollRef.current?.scrollTop !== undefined) {
      this.scrollRef.current.scrollTop = this.scrollRef.current.scrollHeight;
    }
  }

  render() {
    let { contents } = this.state;
    if (this.state.signal === 'SIGKILL') {
      contents += '\nOutput truncated';
    }

    return (
      <ThemeProvider theme={darkTheme}>
        <Paper sx={{ flex: 1, paddingLeft: 1, color: '#11c429' }}>
          <pre ref={this.scrollRef}>
            {contents}
          </pre>
        </Paper>
      </ThemeProvider>
    );
  }
}

export default Console;
