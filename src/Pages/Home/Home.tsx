import React from 'react';
import { Person, School } from '@mui/icons-material';
import {
  Link,
} from 'react-router-dom';
import {
  Box, Stack, Card, CardActionArea, Typography, CardContent,
} from '@mui/material';
import NavBar from '../../Components/NavBar/NavBar';

function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box sx={{
        flex: '1', justifyContent: 'center', alignItems: 'center', display: 'flex',
      }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
          <Card>
            <CardActionArea component={Link} to="/s/dashboard">
              <CardContent>
                <Stack alignItems="center" fontSize="large">
                  <Person sx={{ fontSize: 240 }} />
                  <Typography variant="h2" textAlign="center">
                    I&apos;m a student
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card>
            <CardActionArea component={Link} to="/t/dashboard">
              <CardContent>
                <Stack alignItems="center" fontSize="large">
                  <School sx={{ fontSize: 240 }} />
                  <Typography variant="h2" textAlign="center">
                    I&apos;m a teacher
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}

export default HomePage;
