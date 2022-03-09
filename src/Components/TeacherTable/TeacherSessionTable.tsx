import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, IconButton, Typography, Paper,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Session } from '../../Pages/TeacherDashboard/TeacherDashboard';

interface TeacherTableProps {
  sessions: Session[]
}

const columns: GridColDef[] = [
  { field: 'sessionName', headerName: 'Session Name', flex: 1 },
  { field: 'planName', headerName: 'Plan Name', flex: 1 },
  {
    field: 'open',
    headerName: 'Open',
    sortable: false,
    renderCell: ({ row }) => <IconButton component={Link} to={`/t/session/${encodeURIComponent(row.planName)}/${encodeURIComponent(row.sessionName)}`}><PlayArrow /></IconButton>,
  },
];

function TeacherSessionTable({ sessions }: TeacherTableProps) {
  return (
    <Container>
      <Typography variant="h4" color="text.primary">Sessions</Typography>
      <Paper>
        <DataGrid
          rows={sessions}
          columns={columns}
          getRowId={(row) => row.sessionName}
          autoHeight
          rowCount={20}
          rowsPerPageOptions={[]}
          disableSelectionOnClick
        />
      </Paper>
    </Container>
  );
}

export default TeacherSessionTable;
