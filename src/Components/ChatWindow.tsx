import React from 'react';
import {
  Paper, Stack, Typography, Box, Button, IconButton, TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface ChatWindowProps {
  open: boolean,
  onClose: () => void,
}

export default function ChatWindow({ open, onClose }: ChatWindowProps) {
  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        height: '20rem',
        maxHeight: 'min(100vh, 32)',
        width: '36rem',
        maxWidth: 'min(100vw, 56rem)',
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
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
          <Typography variant="h1">Lalalalal</Typography>
        </Box>
        <Stack direction="row" flex="1">
          <TextField sx={{ flex: 1 }} />
          <Button size="large" sx={{ fontWeight: 700 }}>Send</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
