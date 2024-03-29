/* eslint-disable camelcase */
import { PlayArrow } from '@mui/icons-material';
import {
  Container, IconButton, Paper, Stack, Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import TextFieldWithButton from '../../Components/TextFieldWithButton/TextFieldWithButton';

interface ActiveTeacherSession {
  plan_name: string,
  username: string,
  session_date: Date
  session_name: string,
}

const teacherColumns: GridColDef[] = [
  { field: 'session_name', headerName: 'Session Name', flex: 3 },
  { field: 'plan_name', headerName: 'Plan Name', flex: 3 },
  { field: 'username', headerName: 'Teacher', flex: 1 },
  { field: 'session_date', headerName: 'Date', flex: 1 },
  {
    field: 'open',
    headerName: 'Open',
    sortable: false,
    renderCell: ({ row }) => <IconButton component={Link} to={`/s/session/${encodeURIComponent(row.plan_name)}/${encodeURIComponent(row.session_name)}/${encodeURIComponent(row.username)}`}><PlayArrow /></IconButton>,
  },
];

export default function StudentDashboard() {
  const [activeTeacherSessions, setActiveTeacherSessions] = useState<ActiveTeacherSession[]>([]);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    axios.get<ActiveTeacherSession[]>('/session/active')
      .then(({ data }) => {
        setActiveTeacherSessions(data);
      })
      .catch(() => { });
  }, []);

  const requestAddTeacher = () => {
    axios.post(`/account/add-teacher/${code}`)
      .then(() => { })
      .catch(() => { });
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={2} mt={2}>
          <Container>
            <Typography variant="h4" color="text.primary">Active sessions</Typography>
            <Paper sx={{ width: '100%' }}>
              <DataGrid
                rows={activeTeacherSessions}
                columns={teacherColumns}
                getRowId={(row) => row.session_date}
                autoHeight
                rowCount={20}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
              />
            </Paper>
          </Container>
          <Container maxWidth="sm">
            <Typography variant="h4" color="text.primary">Teachers</Typography>
            <Paper>
              <Stack alignItems="center" py={2} spacing={2}>
                <Typography variant="h6" color="text.primary">Add a teacher</Typography>
                <Stack direction="row">
                  <TextFieldWithButton
                    buttonText="Add"
                    onChange={(value) => setCode(value)}
                    label="Code"
                    onClick={requestAddTeacher}
                    helperText=""
                  />
                </Stack>
              </Stack>
            </Paper>
          </Container>
        </Stack>
      </Container>
    </div>
  );
}
