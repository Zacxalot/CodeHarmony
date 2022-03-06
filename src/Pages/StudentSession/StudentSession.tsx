import React from 'react';
import { Typography, Stack } from '@mui/material';
import NavBar from '../../Components/NavBar/NavBar';

export default function StudentSession() {
  return (
    <div>
      <NavBar small />
      <Stack>
        <Typography variant="h1">HELLO!</Typography>
      </Stack>
    </div>
  );
}
