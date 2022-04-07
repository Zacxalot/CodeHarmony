import { Stack, Typography } from '@mui/material';
import React from 'react';
import NavBar from '../../Components/NavBar/NavBar';

function PageNotFound() {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <NavBar />
      <Stack flex="1" sx={{ color: 'text.primary' }} alignItems="center" justifyContent="center">
        <Typography variant="h1" fontWeight={700}>404</Typography>
        <Typography variant="h1" fontWeight={700}>Not Found</Typography>
        <Typography>sorry...</Typography>
      </Stack>
    </Stack>
  );
}

export default PageNotFound;
