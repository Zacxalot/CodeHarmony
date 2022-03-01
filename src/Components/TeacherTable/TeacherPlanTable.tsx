import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, IconButton, Typography } from '@mui/material';
import { PlayArrow, Settings } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plan } from '../../Pages/TeacherDashboard/TeacherDashboard';

interface TeacherTableProps {
  plans: Plan[],
  // eslint-disable-next-line no-unused-vars
  newSessionCallback: (planName: string) => void
}

const columns: GridColDef[] = [
  { field: 'planName', headerName: 'Plan Name', flex: 1 },
  {
    field: 'start',
    headerName: 'Start',
    sortable: false,
    renderCell: ({ row }) => (
      <IconButton onClick={() => { row.callback(row.planName); }}>
        <PlayArrow />
      </IconButton>
    ),
  },
  {
    field: 'configure',
    headerName: 'Configure',
    sortable: false,
    renderCell: ({ row }) => <IconButton component={Link} to={`/t/plan/${row.planName}`}><Settings /></IconButton>,
  },
];

function TeacherPlanTable({ plans, newSessionCallback }: TeacherTableProps) {
  const plansWithCallback = useMemo(
    () => (plans.map((plan) => ({ planName: plan.planName, callback: newSessionCallback }))),
    [plans],
  );

  return (
    <Container>
      <Typography variant="h4">Plans</Typography>
      <DataGrid
        rows={plansWithCallback}
        columns={columns}
        getRowId={(row) => row.planName}
        autoHeight
        rowCount={20}
        rowsPerPageOptions={[]}
        disableSelectionOnClick
      />
    </Container>
  );
}

export default TeacherPlanTable;
