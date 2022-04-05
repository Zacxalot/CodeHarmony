import React, { useEffect, useRef, useState } from 'react';
import {
  Paper, Stack, Box, Button, IconButton, TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ChatMessageBox from './ChatMessageBox';

export interface Message {
  username: string,
  text: string,
  uuid: string,
}

interface ChatWindowProps {
  open: boolean,
  onClose: () => void,
  messages: Message[],
  username: string,
  // eslint-disable-next-line no-unused-vars
  messageSend: (txt: string) => boolean,
}

export default function ChatWindow({
  open, onClose, messages, username, messageSend,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    // If the text wasn't empty and the message send went ok, clear the input
    if (inputText.trim() !== '' && messageSend(inputText)) {
      setInputText('');
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        height: '20rem',
        maxHeight: 'min(100vh, 32)',
        width: '36rem',
        maxWidth: 'min(100vw - 32px, 56rem)',
        visibility: open ? 'visible' : 'hidden',
        zIndex: 5000,
      }}
      elevation={5}
    >
      <Stack height="100%">
        <Stack direction="row" justifyContent="flex-end" flex="1">
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        <Box sx={{ overflowY: 'scroll', height: '16rem' }}>
          <Stack spacing="5px" p="5px" alignItems="flex-end">
            {messages.map((msg) => (
              <ChatMessageBox message={msg} key={msg.uuid} username={username} />
            ))}
            <div ref={scrollRef} />
          </Stack>
        </Box>
        <Stack direction="row" flex="1" component="form" onSubmitCapture={(e: any) => { e.preventDefault(); sendMessage(); }}>
          <TextField
            sx={{ flex: 1 }}
            onChange={(val) => { setInputText(val.target.value); }}
            value={inputText}
            type="form"
          />
          <Button size="large" sx={{ fontWeight: 700 }} type="submit">Send</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
