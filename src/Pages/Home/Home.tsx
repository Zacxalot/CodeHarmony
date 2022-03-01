import React from 'react';
import {
  Link,
} from 'react-router-dom';
import {
  Box, Stack, Button,
} from '@mui/material';
import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar';

function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box sx={{
        flex: '1', justifyContent: 'center', alignItems: 'center', display: 'flex',
      }}
      >
        <Stack direction="row" height="2rem" spacing={4}>
          <Button variant="contained" component={Link} to="/s/dashboard">
            I&apos;m a student
          </Button>
          <Button variant="contained" component={Link} to="/t/dashboard">
            I&apos;m a teacher
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default HomePage;
