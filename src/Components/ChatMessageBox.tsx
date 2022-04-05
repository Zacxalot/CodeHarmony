import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../Redux/hooks';
import { Message } from './ChatWindow';

interface ChatMessageBoxProps {
  message: Message,
  username: string,
}

export default function ChatMessageBox({ message, username }: ChatMessageBoxProps) {
  const isOwnMessage = username === message.username;
  const selectedTheme = useAppSelector(({ themeSelector: { theme } }) => theme);

  // Gets the correct background colour
  const background = () => {
    if (!isOwnMessage) { return 'default'; }
    if (selectedTheme === 'light') {
      return ('primary.light');
    }
    return ('primary.dark');
  };

  const renderName = () => {
    if (!isOwnMessage) {
      return (<Typography variant="subtitle2" color="primary.main">{message.username}</Typography>);
    }
    return (null);
  };

  return (
    <Paper
      sx={{
        width: '20rem',
        maxWidth: '100%',
        p: '5px',
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
        backgroundColor: background,
      }}
      elevation={1}
    >
      <Stack sx={{ wordWrap: 'break-word' }}>
        {renderName()}
        {message.text}
      </Stack>
    </Paper>
  );
}
