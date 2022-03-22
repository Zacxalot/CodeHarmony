import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, IconButton, Typography, Paper, Box, TextField, Button, Stack,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { Add, PlayArrow, Settings } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ModalBox, ModalContainer, Plan } from '../../Pages/TeacherDashboard/TeacherDashboard';

interface TeacherTableProps {
  // eslint-disable-next-line no-unused-vars
  newSessionCallback: (planName: string) => void,
  plans: Plan[]
}

interface CreateNewPlanResponse {
  planName: string,
  msg: string
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
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [errorString, setErrorString] = useState('');

  const plansWithCallback = useMemo(
    () => (plans.map((plan) => ({ planName: plan.planName, callback: newSessionCallback }))),
    [plans],
  );

  const requestNewLessonPlan = () => {
    axios.post<CreateNewPlanResponse>('/plan/new', { planName: newPlanName })
      .then(({ data: { planName } }) => {
        navigate(`/t/plan/${planName}`);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setErrorString('Plan name already in use');
        } else {
          setErrorString('There was a problem. Please try again later');
        }
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* New lesson plan modal */}
      <ModalContainer
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ModalBox alignItems="center" spacing={1} bgcolor="background.default">
          <Typography variant="h5" color="text.primary">Create New Lesson Plan</Typography>
          <TextField label="Name" onChange={({ target: { value } }) => setNewPlanName(value)} inputProps={{ maxLength: 128 }} error={errorString !== ''} helperText={errorString} />
          <Button
            variant="contained"
            disabled={newPlanName.length < 4}
            onClick={requestNewLessonPlan}
          >
            Create
          </Button>
        </ModalBox>
      </ModalContainer>

      <Container>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" color="text.primary">Plans</Typography>
            <Button variant="contained" onClick={() => { setModalOpen(true); }} endIcon={<Add />}>New Plan</Button>
          </Stack>
          <Paper>
            <DataGrid
              rows={plansWithCallback}
              columns={columns}
              getRowId={(row) => row.planName}
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

export default TeacherPlanTable;
