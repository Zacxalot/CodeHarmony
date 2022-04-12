import { Delete, Launch } from '@mui/icons-material';
import {
  Box, Button, Container, IconButton, Paper, Stack, Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlanSearchInfo } from '../../Pages/PlanShare/PlanShare';
import { ModalBox, ModalContainer } from '../../Pages/TeacherDashboard/TeacherDashboard';

const columns: GridColDef[] = [
  { field: 'plan_name', headerName: 'Plan Name', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 3 },
  {
    field: 'open',
    headerName: 'Open',
    sortable: false,
    renderCell: ({ row }) => <IconButton component={Link} to={`/t/published/${encodeURIComponent(row.plan_name)}/${encodeURIComponent(row.username)}`}><Launch /></IconButton>,
  },
  {
    field: 'delete',
    headerName: 'Delete',
    sortable: false,
    renderCell: ({ row }) => (
      <IconButton onClick={() => { row.deleteCallback(row.plan_name); }}><Delete /></IconButton>
    ),
  },
];

interface TeacherPublishedTableProps {
  plans: PlanSearchInfo[];
}

export default function TeacherPublishedTable({ plans }: TeacherPublishedTableProps) {
  const [toDelete, setToDelete] = useState('');
  const deleteCallback = (planName: string) => { setToDelete(planName); };

  const plansWithCallback = useMemo(
    () => (plans.map((plan) => ({
      plan_name: plan.plan_name,
      description: plan.description,
      username: plan.username,
      deleteCallback,
    }))),
    [plans, deleteCallback],
  );

  const deletePublishedPLan = () => {
    setToDelete('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ModalContainer
        open={toDelete !== ''}
        onClose={() => { setToDelete(''); }}
      >
        <ModalBox alignItems="center" spacing={1} bgcolor="background.default">
          <Typography variant="h5" color="text.primary">
            Are you sure you want to delete
            <Typography display="inline" variant="h5" color="primary">{` ${toDelete}`}</Typography>
            ?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={deletePublishedPLan}
          >
            Delete
          </Button>
        </ModalBox>
      </ModalContainer>
      <Container>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" color="text.primary">Published Plans</Typography>
            <Button component={Link} to="/t/browse" variant="contained">
              Get More Plans
            </Button>
          </Stack>
          <Paper>
            <DataGrid
              rows={plansWithCallback}
              columns={columns}
              getRowId={(row) => row.plan_name}
              autoHeight
              rowCount={20}
              rowsPerPageOptions={[]}
              disableSelectionOnClick
            />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
