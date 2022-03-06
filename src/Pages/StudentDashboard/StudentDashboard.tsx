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

interface ActiveTeacherSession {
  teacher: String,
  plan_name: String,
  username: String,
  session_date: Date
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
    renderCell: ({ row }) => <IconButton component={Link} to={`/s/session/${encodeURIComponent(row.plan_name)}/${encodeURIComponent(row.session_name)}`}><PlayArrow /></IconButton>,
  },
];

export default function StudentDashboard() {
  const [activeTeacherSessions, setActiveTeacherSessions] = useState<ActiveTeacherSession[]>([]);

  useEffect(() => {
    axios.get<ActiveTeacherSession[]>('/session/active')
      .then(({ data }) => {
        setActiveTeacherSessions(data);
      })
      .catch();
  }, []);

  return (
    <div>
      <NavBar small />
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={2} mt={2}>
          <Container>
            <Typography variant="h4">Active sessions</Typography>
            <Paper>
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
        </Stack>
      </Container>
    </div>
  );
}
